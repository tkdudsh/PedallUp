import { createContext, useCallback, useContext, useEffect, useState } from "react";
import chatbotService from "../services/chatbotService";
import { getApiErrorMessage } from "../utils/apiError";
import { useAuth } from "./AuthContext";

const ChatbotContext = createContext(null);

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "bot",
  text: "안녕하세요! 로그인 후 따릉이 대여소 위치와 거치대 정보를 물어보세요.",
};

export function ChatbotProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isSending, setIsSending] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((value) => !value), []);
  const reset = useCallback(() => setMessages([WELCOME_MESSAGE]), []);

  // 채팅 기록은 React 메모리에만 유지하고 로그아웃하면 즉시 초기화합니다.
  useEffect(() => {
    if (!isAuthenticated) setMessages([WELCOME_MESSAGE]);
  }, [isAuthenticated]);

  const sendMessage = useCallback(
    async (text) => {
      const value = text.trim();
      if (!value || isSending) return;
      if (!isAuthenticated) {
        setMessages((previous) => [
          ...previous,
          { id: `login-${Date.now()}`, role: "bot", text: "챗봇을 사용하려면 로그인해 주세요." },
        ]);
        return;
      }

      // welcome 문구를 제외한 최근 대화를 매 요청에 함께 보내 문맥을 유지합니다.
      const history = messages
        .filter((message) => message.id !== "welcome")
        .slice(-20)
        .map((message) => ({
          role: message.role === "bot" ? "assistant" : "user",
          content: message.text,
        }));

      setMessages((previous) => [
        ...previous,
        { id: `user-${Date.now()}`, role: "user", text: value },
      ]);
      setIsSending(true);
      try {
        const answer = await chatbotService.sendMessage(value, history);
        setMessages((previous) => [
          ...previous,
          { id: `bot-${Date.now()}`, role: "bot", text: answer },
        ]);
      } catch (error) {
        setMessages((previous) => [
          ...previous,
          {
            id: `error-${Date.now()}`,
            role: "bot",
            text: getApiErrorMessage(error, "답변을 생성하지 못했습니다."),
          },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [isAuthenticated, isSending, messages]
  );

  return (
    <ChatbotContext.Provider
      value={{ isOpen, open, close, toggle, messages, sendMessage, isSending, reset }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (!context) throw new Error("useChatbot must be used within ChatbotProvider");
  return context;
}
