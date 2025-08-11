const Groq = require("groq-sdk");
const dotenv = require("dotenv");
dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

module.exports.getAiGeneratedMessage = async (content, model) => {
  const completion = await getGroqChatCompletion(content, model);
  return completion.choices[0]?.message?.content || "";
}

const getGroqChatCompletion = async (content, model) => {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
        You are a message generating assistant.
        Your job is to take the user's intent and converting it into a short, natural, human-like message based on:
        1. The recent chat messages (for context).
        2. The user's requested tone.

        Rules:
        - Keep it in the same language as the conversation.
        - Make it sound like a real human wrote it.
        - Match the tone exactly.
        - generate message of 1-2 lines only.
        - Do not add anything unrelated to the conversation.
        `,
      },
      {
        role: "user",
        content: content
      }
      
    ],
    model: model,
  });
};
