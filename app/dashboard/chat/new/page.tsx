"use client";

import { ChatInterface } from "@/components/chat-interface";
import { useTranslations } from "next-intl";

export default function NewChatPage() {
  const t = useTranslations("dashboard.chat");

  return (
    <div className="flex-1 flex h-full">
      <ChatInterface
        characterId="new_chat"
        characterName={t("aiAssistant")}
        characterAvatar=""
        characterGreeting={t("aiGreeting")}
        characterDescription=""
        existingConversationId={null}
        disableSave={true}
      />
    </div>
  );
}
