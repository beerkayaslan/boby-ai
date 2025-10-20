"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatInterface } from "@/components/chat-interface";
import { CharacterInfoSidebar } from "@/components/character-info-sidebar";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

interface Character {
  id: string;
  name: string;
  avatar_url: string;
  greeting: string;
  description: string;
  description_info?: string;
}

interface Conversation {
  id: string;
  title: string;
  character_id?: string;
}

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.id as string;
  const [character, setCharacter] = useState<Character | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations("dashboard");

  useEffect(() => {
    const fetchConversationAndCharacter = async () => {
      try {
        const supabase = createClient();

        // Conversation'ı al
        const { data: convData, error: convError } = await supabase
          .from("conversations")
          .select("*")
          .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
          .eq("id", conversationId)
          .single();

        if (convError) {
          console.log("Conversation yüklenirken hata:", convError);
          setIsLoading(false);
          return;
        }

        setConversation(convData);

        // Eğer character_id conversation'da varsa onu kullan
        if (convData.character_id) {
          const { data: charData, error: charError } = await supabase
            .from("characters")
            .select("*")
            .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
            .eq("id", convData.character_id)
            .single();

          if (!charError && charData) {
            setCharacter(charData);
          }
        } else {
          // Varsayılan karakter bilgileri
          // Bu durumda conversation'dan title'ı kullanabiliriz
          setCharacter({
            id: "temp",
            name: convData.title
              .replace(" ile sohbet", "")
              .replace(" chat", ""),
            avatar_url: "",
            greeting: t("defaultGreeting"),
            description: "",
          });
        }
      } catch (error) {
        console.log("Beklenmeyen hata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversationAndCharacter();
  }, [conversationId, t]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-64 bg-muted rounded"></div>
          <div className="h-8 w-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!conversation || !character) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">
            {t("conversationNotFound.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("conversationNotFound.description")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex-1">
        <ChatInterface
          characterId={character.id}
          characterName={character.name}
          characterAvatar={character.avatar_url}
          characterGreeting={character.greeting}
          characterDescription={character.description}
          existingConversationId={conversationId}
        />
      </div>
      <CharacterInfoSidebar
        characterId={character.id}
        characterName={character.name}
        characterAvatar={character.avatar_url}
        characterDescription={character.description}
        characterGreeting={character.greeting}
      />
    </div>
  );
}
