import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function summarizeArticle(title, content) {
  const text = (content?.trim() || title?.trim() || '').slice(0, 3000);
  if (!text) return null;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `You are a concise research assistant for a senior Product Manager interested in learning more about AI and staying current on AI developments.
Summarize this article in 3-4 sentences. Focus on: the key insight, why it matters,
and any implication for product teams. Be direct — no filler phrases.

Title: ${title}

Content: ${text}`,
      },
    ],
  });

  const block = message.content[0];
  return (block?.type === 'text' && block.text) ? block.text : null;
}
