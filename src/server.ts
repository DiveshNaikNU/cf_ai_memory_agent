import { routeAgentRequest, type Schedule } from "agents";
import { AIChatAgent } from "agents/ai-chat-agent";
import {
  generateId,
  streamText,
  type StreamTextOnFinishCallback,
  createUIMessageStream,
  convertToModelMessages,
  createUIMessageStreamResponse,
  type ToolSet
} from "ai";
import { createWorkersAI } from "workers-ai-provider";
import { cleanupMessages } from "./utils";

/**
 * Chat Agent implementation that handles real-time AI chat interactions
 * Using Cloudflare Workers AI with Llama
 */
export class Chat extends AIChatAgent<Env> {
  /**
   * Handles incoming chat messages and manages the response stream
   */
  async onChatMessage(
    onFinish: StreamTextOnFinishCallback<ToolSet>,
    _options?: { abortSignal?: AbortSignal }
  ) {
    // Initialize Workers AI with the AI binding from env
    const workersai = createWorkersAI({ binding: this.env.AI });

    // @ts-ignore - Model exists but types are not updated
    const model = workersai("@cf/meta/llama-3.1-8b-instruct");

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        // Clean up incomplete tool calls to prevent API errors
        const cleanedMessages = cleanupMessages(this.messages);

        const result = streamText({
          system: `You are a friendly and helpful AI assistant powered by Llama running on Cloudflare Workers AI.

Guidelines:
- Be conversational, warm, and helpful
- Give direct, informative answers to questions
- If someone greets you, greet them back warmly
- Keep responses concise but informative
- You can help with general knowledge, coding, math, writing, explanations, and more
- Always provide a substantive response

Current date: ${new Date().toLocaleDateString()}
`,
          messages: convertToModelMessages(cleanedMessages),
          model,
          onFinish: onFinish as unknown as StreamTextOnFinishCallback<ToolSet>
        });

        writer.merge(result.toUIMessageStream());
      }
    });

    return createUIMessageStreamResponse({ stream });
  }

  async executeTask(description: string, _task: Schedule<string>) {
    await this.saveMessages([
      ...this.messages,
      {
        id: generateId(),
        role: "user",
        parts: [
          {
            type: "text",
            text: `Running scheduled task: ${description}`
          }
        ],
        metadata: {
          createdAt: new Date()
        }
      }
    ]);
  }
}

/**
 * Worker entry point
 */
export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/check-open-ai-key") {
      return Response.json({
        success: true,
        provider: "workers-ai",
        model: "llama-3.1-8b"
      });
    }

    return (
      (await routeAgentRequest(request, env)) ||
      new Response("Not found", { status: 404 })
    );
  }
} satisfies ExportedHandler<Env>;
