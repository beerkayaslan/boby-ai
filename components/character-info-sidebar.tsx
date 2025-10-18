"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { History, Info, X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHistory {
  id: string;
  date: string;
  message_count: number;
  last_message: string;
}

interface CharacterInfoSidebarProps {
  characterId: string;
  characterName: string;
  characterAvatar: string;
  characterDescription: string;
  characterGreeting: string;
}

export function CharacterInfoSidebar({
  characterName,
  characterAvatar,
  characterDescription,
  characterGreeting,
}: CharacterInfoSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "history">("info");

  // Örnek chat geçmişi
  const [chatHistory] = useState<ChatHistory[]>([
    {
      id: "1",
      date: "18 Ekim 2025",
      message_count: 24,
      last_message: "Görelilik teorisi hakkında harika bir sohbet oldu!",
    },
    {
      id: "2",
      date: "17 Ekim 2025",
      message_count: 15,
      last_message: "Kuantum fiziği üzerine tartıştık.",
    },
    {
      id: "3",
      date: "15 Ekim 2025",
      message_count: 8,
      last_message: "E=mc² formülünü detaylıca açıkladı.",
    },
  ]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("info")}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2",
            activeTab === "info"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Info className="h-4 w-4" />
          Bilgi
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2",
            activeTab === "history"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <History className="h-4 w-4" />
          Geçmiş
        </button>
      </div>

      <ScrollArea className="flex-1">
        {activeTab === "info" ? (
          <div className="p-4 space-y-6">
            {/* Character Avatar & Name */}
            <div className="flex flex-col items-center text-center space-y-3">
              <Avatar className="h-24 w-24">
                <AvatarImage src={characterAvatar} />
                <AvatarFallback>{characterName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{characterName}</h2>
                <p className="text-sm text-muted-foreground">AI Karakter</p>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Açıklama</h3>
              <p className="text-sm text-muted-foreground">
                {characterDescription}
              </p>
            </div>

            <Separator />

            {/* First Message */}
            <div>
              <h3 className="text-sm font-semibold mb-2">İlk Mesaj</h3>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm">{characterGreeting}</p>
              </div>
            </div>

            <Separator />

            {/* Stats */}
            <div>
              <h3 className="text-sm font-semibold mb-3">İstatistikler</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Toplam Sohbet:</span>
                  <span className="font-medium">{chatHistory.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Toplam Mesaj:</span>
                  <span className="font-medium">
                    {chatHistory.reduce(
                      (sum, chat) => sum + chat.message_count,
                      0
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-semibold mb-3">Geçmiş Sohbetler</h3>
            {chatHistory.length > 0 ? (
              <div className="space-y-2">
                {chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className="border rounded-lg p-3 hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-primary">
                        {chat.date}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {chat.message_count} mesaj
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {chat.last_message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Henüz geçmiş sohbet yok
                </p>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 right-4 z-50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMobileOpen(false)}
        >
          <div
            className="ml-auto w-80 h-full bg-background border-l"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-80 border-l bg-background h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  );
}
