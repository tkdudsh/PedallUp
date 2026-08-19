import api from "../api/axios";

async function sendMessage(message, history) {
  const { data } = await api.post("/chat", { message, history });
  return data.answer;
}

const chatbotService = { sendMessage };
export default chatbotService;
