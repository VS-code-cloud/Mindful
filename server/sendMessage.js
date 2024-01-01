const Database = require("@replit/database")

const db = new Database()

// This code is for v4 of the openai package: npmjs.com/package/openai
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
async function getRes(chat) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: chat,
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  chat.push(response.choices[0].message);
  return chat;
};

const sendMsg = async (uid, data) => {
  
  data.chatbot = await getRes(data.chatbot);
  
  db.set(uid, data).then((prof) => {});
  
  return data;

}

module.exports = sendMsg;
