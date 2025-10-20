"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { History, Info, X, MessageSquare, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { EditCharacterModal } from "@/components/edit-character-modal";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  message_count?: number;
}

interface Character {
  id: string;
  name: string;
  avatar_url: string;
  description: string;
  description_info?: string;
  greeting: string;
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
  const t = useTranslations("dashboard.characterInfo");
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "history">("info");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();

  const character: Character = {
    id: characterId,
    name: characterName,
    avatar_url: characterAvatar,
    description: characterDescription,
    greeting: characterGreeting,
  };

  const handleDeleteCharacter = async () => {
    setIsDeleting(true);
    try {
      // First delete all conversations related to this character
      await supabase
        .from("conversations")
        .delete()
        .eq("character_id", characterId);

      // Then delete the character
      const { error } = await supabase
        .from("characters")
        .delete()
        .eq("id", characterId);

      if (error) throw error;

      // Close the dialog
      setIsDeleteDialogOpen(false);

      // Navigate to dashboard and force refresh
      router.push("/dashboard");
      window.location.reload();
    } catch (error) {
      console.error("Karakter silme hatası:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCharacterUpdated = () => {
    // Close the edit modal
    setIsEditModalOpen(false);

    // Navigate to dashboard and force refresh
    window.location.reload();
  };

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
          {t("tabs.info")}
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
          {t("tabs.history")}
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
                <p className="text-sm text-muted-foreground">
                  {t("aiCharacter")}
                </p>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold mb-2">{t("description")}</h3>
              <p className="text-sm text-muted-foreground">
                {characterDescription}
              </p>
            </div>

            <Separator />

            {/* First Message */}
            <div>
              <h3 className="text-sm font-semibold mb-2">
                {t("firstMessage")}
              </h3>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm">{characterGreeting}</p>
              </div>
            </div>

            <Separator />

            {/* Action Buttons - Hidden for default characters */}
            {!characterId.startsWith("default-") && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  {t("editButton")}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t("deleteButton")}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-semibold mb-3">
              {t("conversationHistory")}
            </h3>
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
                  {t("noHistory")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("noHistoryDescription")}
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

      {/* Edit Character Modal */}
      <EditCharacterModal
        character={character}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onCharacterUpdated={handleCharacterUpdated}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteConfirm.title")}</DialogTitle>
            <DialogDescription>
              {t("deleteConfirm.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              {t("deleteConfirm.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCharacter}
              disabled={isDeleting}
            >
              {isDeleting
                ? t("deleteConfirm.deleting")
                : t("deleteConfirm.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
