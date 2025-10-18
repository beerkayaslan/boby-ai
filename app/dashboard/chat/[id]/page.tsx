"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatInterface } from "@/components/chat-interface";
import { CharacterInfoSidebar } from "@/components/character-info-sidebar";
import { createClient } from "@/lib/supabase/client";

interface Character {
  id: string;
  name: string;
  avatar_url: string;
  greeting: string;
  description: string;
}

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("characters")
          .select("*")
          .eq("id", chatId)
          .single();

        if (error) {
          console.error("Karakter yüklenirken hata:", error);
          return;
        }

        setCharacter(data);
      } catch (error) {
        console.error("Beklenmeyen hata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacter();
  }, [chatId]);

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

  if (!character) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Karakter bulunamadı</h2>
          <p className="text-muted-foreground">
            Bu karakter mevcut değil veya silinmiş olabilir.
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
