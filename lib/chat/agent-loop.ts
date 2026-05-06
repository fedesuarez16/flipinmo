import 'server-only'

import { getAnthropic, MODEL } from '@/lib/anthropic'
import { SYSTEM_PROMPT } from '@/lib/chat/system-prompt'
import { appendMessage, loadHistory } from '@/lib/chat/history'
import {
  writeText,
  writeTool,
  writeError,
  writeDone,
  writeProfile,
  writeFollowups,
} from '@/lib/chat/sse'
import { TOOL_DEFINITIONS, runTool, type ToolOutcome } from '@/lib/chat/tools'
import type Anthropic from '@anthropic-ai/sdk'

// ─── Types ────────────────────────────────────────────────────────────────────

export type RunAgentArgs = {
  sessionId: string
  userMessage: string
  controller: ReadableStreamDefaultController<Uint8Array>
}

// ─── Iteration cap ─────────────────────────────────────────────────────────────

const MAX_ITERATIONS = 5

// ─── runAgent ─────────────────────────────────────────────────────────────────

/**
 * Core agentic loop. Handles up to MAX_ITERATIONS tool-use cycles before
 * forcing a graceful exit. All SSE writing happens via the controller.
 *
 * Invariants:
 * - User message is persisted BEFORE streaming begins.
 * - Assistant message is persisted ONLY on a full successful turn (no tool_use pending).
 * - On error, no partial assistant row is written.
 * - writeDone is always called at the end (via finally in the route).
 *
 * The caller (route) is responsible for calling controller.close() in finally.
 */
export async function runAgent({
  sessionId,
  userMessage,
  controller,
}: RunAgentArgs): Promise<void> {
  // Persist the user turn and load the full history (includes the new message).
  await appendMessage(sessionId, 'user', userMessage)
  let history = await loadHistory(sessionId)

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    const anthropic = getAnthropic()
    let sdkStream: ReturnType<typeof anthropic.messages.stream>

    try {
      sdkStream = anthropic.messages.stream({
        model: MODEL,
        system: SYSTEM_PROMPT,
        tools: TOOL_DEFINITIONS,
        messages: history,
        max_tokens: 1024,
      })

      // Stream text deltas to the client in real-time.
      for await (const event of sdkStream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          writeText(controller, event.delta.text)
        }
      }

      // finalMessage() resolves after the stream has fully completed.
      const final = await sdkStream.finalMessage()
      const toolUseBlocks = final.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
      )

      if (final.stop_reason === 'end_turn' || toolUseBlocks.length === 0) {
        // Normal completion — persist the full assistant response and exit.
        await appendMessage(
          sessionId,
          'assistant',
          final.content as Parameters<typeof appendMessage>[2],
        )
        writeDone(controller)
        return
      }

      // ── Tool-use path ──────────────────────────────────────────────────────
      // Persist the assistant turn (which includes the tool_use blocks) so the
      // history sent in the next iteration is valid for the Anthropic API.
      await appendMessage(
        sessionId,
        'assistant',
        final.content as Parameters<typeof appendMessage>[2],
      )

      const toolResults: Anthropic.ToolResultBlockParam[] = []

      for (const tu of toolUseBlocks) {
        writeTool(controller, tu.name, 'running')
        console.log(`[agent-loop] tool call: ${tu.name}`, JSON.stringify(tu.input))

        let outcome: ToolOutcome
        try {
          outcome = await runTool(
            tu.name,
            tu.input as Record<string, unknown>,
            { sessionId },
          )
          console.log(
            `[agent-loop] tool ${tu.name} ok — profileUpdate=${
              outcome.profileUpdate ? 'yes' : 'no'
            }`,
          )
        } catch (toolErr) {
          console.error(`[agent-loop] tool ${tu.name} FAILED:`, toolErr)
          outcome = { result: { error: toolErr instanceof Error ? toolErr.message : String(toolErr) } }
        }

        // SSE order per design §5: tool(running) → tool(done) → profile/followups → text
        writeTool(controller, tu.name, 'done')
        if (outcome.profileUpdate) {
          writeProfile(controller, outcome.profileUpdate)
        }
        if (outcome.followupsUpdate) {
          writeFollowups(controller, outcome.followupsUpdate)
        }

        toolResults.push({
          type: 'tool_result',
          tool_use_id: tu.id,
          content: JSON.stringify(outcome.result),
        })
      }

      // Append tool results as a USER turn (Anthropic requirement).
      await appendMessage(
        sessionId,
        'user',
        toolResults as Parameters<typeof appendMessage>[2],
      )

      // Reload full history for the next iteration.
      history = await loadHistory(sessionId)

      // Continue to next iteration.
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Error inesperado en el bucle del agente.'
      writeError(controller, msg)
      return
    }
  }

  // Iteration cap reached — inform the user politely and exit.
  writeText(
    controller,
    'Disculpame, no pude completar la consulta en el tiempo esperado. Por favor, reformulá tu pregunta.',
  )
  writeDone(controller)

  // Persist the fallback message so history stays consistent.
  await appendMessage(sessionId, 'assistant', [
    {
      type: 'text',
      text: 'Disculpame, no pude completar la consulta en el tiempo esperado. Por favor, reformulá tu pregunta.',
    },
  ])
}
