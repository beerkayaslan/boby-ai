"use client";

import { useParams } from "next/navigation";
import { ChatInterface } from "@/components/chat-interface";
import { CharacterInfoSidebar } from "@/components/character-info-sidebar";

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;

  interface CharacterData {
    id: string;
    name: string;
    avatar: string;
    greeting: string;
    description: string;
  }

  // TODO: Supabase'den chat bilgilerini çek
  // Şimdilik örnek veri
  const mockCharacters: Record<string, CharacterData> = {
    "1": {
      id: "1",
      name: "Einstein",
      avatar: "https://ui-avatars.com/api/?name=Einstein&background=random",
      greeting:
        "Merhaba! Ben Albert Einstein. Fizik ve evren hakkında konuşalım!",
      description:
        "Ünlü fizikçi ve görelilik teorisinin yaratıcısı. Fizik, matematik ve evrenin gizemiyle ilgili derin konuşmalar yapabiliriz.",
    },
    "2": {
      id: "2",
      name: "Shakespeare",
      avatar: "https://ui-avatars.com/api/?name=Shakespeare&background=random",
      greeting:
        "Olmak ya da olmamak, işte bütün mesele bu! Edebiyat ve sanat üzerine konuşalım.",
      description:
        "İngiliz şair ve oyun yazarı. Edebiyat, tiyatro ve insan doğası üzerine derinlemesine sohbetler edebiliriz.",
    },
    "3": {
      id: "3",
      name: "Marie Curie",
      avatar: "https://ui-avatars.com/api/?name=Marie+Curie&background=random",
      greeting:
        "Merhaba! Ben Marie Curie. Bilim ve keşifler hakkında konuşalım!",
      description:
        "Nobel ödüllü bilim insanı ve radyoaktivitenin öncüsü. Bilim, araştırma ve kadın hakları hakkında konuşabiliriz.",
    },
  };

  const character = mockCharacters[chatId] || {
    id: chatId,
    name: "AI Asistan",
    avatar: "https://ui-avatars.com/api/?name=AI&background=random",
    greeting: "Merhaba! Size nasıl yardımcı olabilirim?",
    description: "Genel amaçlı AI asistanı",
  };

  return (
    <div className="flex h-full">
      <div className="flex-1">
        <ChatInterface
          characterId={character.id}
          characterName={character.name}
          characterAvatar={character.avatar}
          characterGreeting={character.greeting}
        />
      </div>
      <CharacterInfoSidebar
        characterId={character.id}
        characterName={character.name}
        characterAvatar={character.avatar}
        characterDescription={character.description}
        characterGreeting={character.greeting}
      />
    </div>
  );
}
