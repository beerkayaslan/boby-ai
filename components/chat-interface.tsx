"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { useTranslations, useLocale } from "next-intl";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  characterId: string;
  characterName: string;
  characterAvatar: string;
  characterGreeting: string;
  characterDescription?: string;
  existingConversationId?: string | null;
  disableSave?: boolean;
}

export function ChatInterface({
  characterId,
  characterName,
  characterAvatar,
  characterGreeting,
  characterDescription = "",
  existingConversationId = null,
  disableSave = false,
}: ChatInterfaceProps) {
  const t = useTranslations("dashboard.chat");
  const locale = useLocale();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(
    existingConversationId
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const loadMessages = async () => {
      if (existingConversationId) {
        setConversationId(existingConversationId);
        try {
          const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
            .eq("conversation_id", existingConversationId)
            .order("created_at", { ascending: true });

          if (error) throw error;

          if (data && data.length > 0) {
            const loadedMessages: Message[] = data.map((msg) => ({
              id: msg.id,
              role: msg.sender_type === "ai" ? "assistant" : "user",
              content: msg.content,
              timestamp: new Date(msg.created_at),
            }));
            setMessages(loadedMessages);
          } else {
            setMessages([
              {
                id: "1",
                role: "assistant",
                content: characterGreeting,
                timestamp: new Date(),
              },
            ]);
          }
        } catch (error) {
          console.error("Mesajlar yüklenirken hata:", error);
          setMessages([
            {
              id: "1",
              role: "assistant",
              content: characterGreeting,
              timestamp: new Date(),
            },
          ]);
        }
      } else {
        setMessages([
          {
            id: "1",
            role: "assistant",
            content: characterGreeting,
            timestamp: new Date(),
          },
        ]);
      }
    };

    loadMessages();
  }, [existingConversationId, characterGreeting, supabase]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const createConversation = async (userId: string) => {
    try {
      // Create a proper title with character name based on locale
      const conversationTitle =
        locale === "tr"
          ? `${characterName} ile sohbet`
          : `Chat with ${characterName}`;

      const { data, error } = await supabase
        .from("conversations")
        .insert({
          user_id: userId,
          title: conversationTitle,
          character_id: characterId,
        })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error("Conversation oluşturma hatası:", error);
      return null;
    }
  };

  const saveMessage = async (
    convId: string,
    userId: string,
    content: string,
    senderType: "user" | "ai"
  ) => {
    try {
      await supabase.from("messages").insert({
        conversation_id: convId,
        user_id: userId,
        sender_type: senderType,
        content: content,
      });
    } catch (error) {
      console.error("Mesaj kaydetme hatası:", error);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error(t("errors.userNotFound"));
      return;
    }

    let currentConversationId = conversationId;

    // Only create conversation if save is enabled
    if (!disableSave && !currentConversationId) {
      currentConversationId = await createConversation(user.id);
      if (!currentConversationId) {
        console.error(t("errors.conversationCreateError"));
        return;
      }
      setConversationId(currentConversationId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Only save message if save is enabled and conversation exists
    if (!disableSave && currentConversationId) {
      await saveMessage(currentConversationId, user.id, inputValue, "user");
    }

    setInputValue("");
    setIsLoading(true);

    try {
      // Karakter kişiliğini system prompt olarak oluştur
      // Bu, AI'nın her yanıtta karakterin kişiliğini korumasını sağlar
      const systemMessageContent = characterDescription
        ? `You are ${characterName}. ${characterDescription}\n\nImportant: Always stay in character and respond according to this personality description. Never break character.`
        : `You are ${characterName}. Always respond in character.`;

      const systemMessage = {
        role: "system",
        content: systemMessageContent,
      };

      // API'ye gönderilecek mesajları hazırla
      // System message her zaman ilk sırada olmalı
      const apiMessages = [
        systemMessage,
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: "user",
          content: userMessage.content,
        },
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(t("errors.apiError"));
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";

      const aiMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: aiMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        },
      ]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          aiResponse += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId ? { ...msg, content: aiResponse } : msg
            )
          );
        }
      }

      // Only save AI message if save is enabled and conversation exists
      if (!disableSave && aiResponse && currentConversationId) {
        await saveMessage(currentConversationId, user.id, aiResponse, "ai");
      }
    } catch (error) {
      console.error("Chat hatası:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: t("errors.errorMessage"),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="border-b p-4 flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={characterAvatar} />
          <AvatarFallback>{characterName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{characterName}</h2>
          <p className="text-xs text-muted-foreground">{t("online")}</p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4 max-w-5xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="h-8 w-8 shrink-0">
                {message.role === "assistant" ? (
                  <>
                    <AvatarImage src={characterAvatar} />
                    <AvatarFallback>{characterName[0]}</AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              <div
                className={`flex flex-col min-w-0 flex-1 ${
                  message.role === "user" ? "items-end" : ""
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-full md:max-w-3xl break-words overflow-hidden ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.role === "user" ? (
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  ) : (
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none [&>*]:break-words">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight, rehypeRaw]}
                        components={{
                          code({ className, children, ...props }) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            const isInline = !match;

                            return isInline ? (
                              <code
                                className="bg-black/20 dark:bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono break-words"
                                {...props}
                              >
                                {children}
                              </code>
                            ) : (
                              <code
                                className={`${className} break-words`}
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                          pre({ children, ...props }) {
                            return (
                              <pre
                                className="bg-black/90 dark:bg-black text-white p-4 rounded-lg overflow-x-auto my-2 border border-white/10 max-w-full"
                                style={{
                                  wordBreak: "normal",
                                  overflowWrap: "normal",
                                  whiteSpace: "pre",
                                }}
                                {...props}
                              >
                                {children}
                              </pre>
                            );
                          },
                          p({ children, ...props }) {
                            return (
                              <p
                                className="mb-2 last:mb-0 break-words"
                                {...props}
                              >
                                {children}
                              </p>
                            );
                          },
                          ul({ children, ...props }) {
                            return (
                              <ul
                                className="list-disc list-inside mb-2 break-words"
                                {...props}
                              >
                                {children}
                              </ul>
                            );
                          },
                          ol({ children, ...props }) {
                            return (
                              <ol
                                className="list-decimal list-inside mb-2 break-words"
                                {...props}
                              >
                                {children}
                              </ol>
                            );
                          },
                          blockquote({ children, ...props }) {
                            return (
                              <blockquote
                                className="border-l-4 border-primary/50 pl-4 italic my-2 break-words overflow-hidden"
                                {...props}
                              >
                                {children}
                              </blockquote>
                            );
                          },
                          h1({ children, ...props }) {
                            return (
                              <h1
                                className="text-xl font-bold mt-4 mb-2 break-words"
                                {...props}
                              >
                                {children}
                              </h1>
                            );
                          },
                          h2({ children, ...props }) {
                            return (
                              <h2
                                className="text-lg font-bold mt-3 mb-2 break-words"
                                {...props}
                              >
                                {children}
                              </h2>
                            );
                          },
                          h3({ children, ...props }) {
                            return (
                              <h3
                                className="text-base font-bold mt-2 mb-1 break-words"
                                {...props}
                              >
                                {children}
                              </h3>
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={characterAvatar} />
                <AvatarFallback>{characterName[0]}</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="border-t p-4">
        <div className="max-w-6xl mx-auto flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t("inputPlaceholder")}
            disabled={isLoading}
            className="flex-1 h-12"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="h-12 w-12"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
