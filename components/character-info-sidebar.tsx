"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { History, Info, X, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  message_count?: number;
}

interface CharacterInfoSidebarProps {
  characterId: string;
  characterName: string;
  characterAvatar: string;
  characterDescription: string;
  characterGreeting: string;
}

export function CharacterInfoSidebar({
  characterId,
  characterName,
  characterAvatar,
  characterDescription,
  characterGreeting,
}: CharacterInfoSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "history">("info");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  // Character'a ait conversation'ları yükle
  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("conversations")
          .select("*")
          .eq("character_id", characterId)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Conversations yüklenirken hata:", error);
          return;
        }

        setConversations(data || []);
      } catch (error) {
        console.error("Beklenmeyen hata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === "history") {
      fetchConversations();
    }

    // Realtime subscription
    const channel = supabase
      .channel(`character_${characterId}_conversations`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `character_id=eq.${characterId}`,
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [characterId, activeTab, supabase]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full w-full">
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
            {/* <div>
              <h3 className="text-sm font-semibold mb-3">İstatistikler</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Toplam Sohbet:</span>
                  <span className="font-medium">{conversations.length}</span>
                </div>
              </div>
            </div> */}
          </div>
        ) : (
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-semibold mb-3">Geçmiş Sohbetler</h3>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-20 bg-muted rounded-lg animate-pulse" />
                <div className="h-20 bg-muted rounded-lg animate-pulse" />
                <div className="h-20 bg-muted rounded-lg animate-pulse" />
              </div>
            ) : conversations.length > 0 ? (
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <Link
                    key={conversation.id}
                    href={`/dashboard/conversation/${conversation.id}`}
                  >
                    <div className="border rounded-lg p-3 hover:bg-accent transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">
                            {conversation.title}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(conversation.created_at).toLocaleDateString(
                          "tr-TR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Henüz geçmiş sohbet yok
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  İlk mesajı göndererek sohbete başlayın
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
      {/* Mobile Menu Button - Fixed in top right corner */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-[18px] right-4 z-50 bg-background/80 backdrop-blur-sm border shadow-sm"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Info className="h-5 w-5" />
        )}
      </Button>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 pt-[73px]"
          onClick={() => setIsMobileOpen(false)}
        >
          <div
            className="ml-auto w-80 h-full bg-background border-l shadow-xl"
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
