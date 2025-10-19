"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
}

export function ChatInterface({
  characterId,
  characterName,
  characterAvatar,
  characterGreeting,
  characterDescription = "",
  existingConversationId = null,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(
    existingConversationId
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Geçmiş mesajları yükle
  useEffect(() => {
    const loadMessages = async () => {
      if (existingConversationId) {
        setConversationId(existingConversationId);
        try {
          const { data, error } = await supabase
            .from("messages")
            .select("*")
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
            // Eğer mesaj yoksa karşılama mesajını göster
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
          // Hata durumunda karşılama mesajını göster
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
        // Yeni konuşma - karşılama mesajını göster
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
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Conversation oluştur
  const createConversation = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .insert({
          user_id: userId,
          title: `${characterName} ile sohbet`,
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

  // Mesaj kaydet
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

    // Kullanıcıyı al
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("Kullanıcı bulunamadı");
      return;
    }

    // İlk mesajsa conversation oluştur
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      currentConversationId = await createConversation(user.id);
      if (!currentConversationId) {
        console.error("Conversation oluşturulamadı");
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

    // Kullanıcı mesajını kaydet
    await saveMessage(currentConversationId, user.id, inputValue, "user");

    setInputValue("");
    setIsLoading(true);

    try {
      // Karakter rolü için sistem mesajı oluştur
      const systemMessage = {
        role: "system",
        content: `Sen ${characterName} adlı bir karaktersin. ${
          characterDescription
            ? `Karakterin açıklaması: "${characterDescription}". `
            : ""
        }Karakterin karşılama mesajı: "${characterGreeting}". Bu rolle uyumlu şekilde yanıt ver. Türkçe konuş ve karakterin kişiliğini yansıt.`,
      };

      // API'ye gönderilecek mesaj listesi
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
        throw new Error("API isteği başarısız oldu");
      }

      // Streaming yanıtı işle
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";

      // AI mesajını ekle (ilk olarak boş)
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

          // Mesajı güncelle
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId ? { ...msg, content: aiResponse } : msg
            )
          );
        }
      }

      // AI yanıtını kaydet
      if (aiResponse && currentConversationId) {
        await saveMessage(currentConversationId, user.id, aiResponse, "ai");
      }
    } catch (error) {
      console.error("Chat hatası:", error);
      // Hata durumunda kullanıcıya bilgi ver
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
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
      {/* Header */}
      <div className="border-b p-4 flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={characterAvatar} />
          <AvatarFallback>{characterName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{characterName}</h2>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4 max-w-3xl mx-auto">
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
                className={`flex flex-col ${
                  message.role === "user" ? "items-end" : ""
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-xl ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
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
              <Avatar className="h-8 w-8">
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
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mesajınızı yazın..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
