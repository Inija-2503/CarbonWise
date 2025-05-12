import { OpenAI } from 'openai';

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // for Vite projects
  dangerouslyAllowBrowser: true, // ONLY for client-side testing, not production
});
