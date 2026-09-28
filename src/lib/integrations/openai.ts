/** Server-only AI workflow boundary. No keys are required for demo mode. */
export function getAIConfig() { return { configured: Boolean(process.env.OPENAI_API_KEY), model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini" }; }
export async function generateCareerDraft(input: { task: string; context: string }) { void input; if (!process.env.OPENAI_API_KEY) return { mode:"demo" as const, text:"Demo draft — connect OPENAI_API_KEY and implement a server-side workflow to generate a personalized result." }; throw new Error("AI provider adapter is not configured yet."); }
