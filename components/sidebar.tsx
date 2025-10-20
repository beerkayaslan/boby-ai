"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateCharacterModal } from "./create-character-modal";
import { UserProfile } from "./user-profile";
import { LanguageSelector } from "./language-selector";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import logo from "@/assets/boby_ai_logo.jpeg";
import { useTranslations, useLocale } from "next-intl";
import { getDefaultCharacters, type Character } from "@/lib/default-characters";

export function Sidebar() {
  const t = useTranslations("dashboard.sidebar");
  const locale = useLocale();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const defaultCharacters = getDefaultCharacters(locale);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Karakterler yüklenirken hata:", error);
        return;
      }

      setCharacters(data || []);
    } catch (error) {
      console.error("Beklenmeyen hata:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCharacterCreated = () => {
    fetchCharacters();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full w-full">
      {/* Logo - Desktop Only */}
      <div className="hidden md:flex p-4 items-center justify-between border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src={logo} alt="Boby AI Logo" className="h-6 w-6" />
          <h1 className="text-xl font-bold">Boby AI</h1>
        </Link>
        <LanguageSelector />
      </div>

      {/* Quick Chat Link */}
      <div className="px-4 py-3 border-b">
        <Link href="/dashboard/chat/new_chat">
          <Button
            variant={
              pathname === "/dashboard/chat/new_chat" ? "default" : "ghost"
            }
            className="w-full justify-start"
          >
            {t("startChat")}
          </Button>
        </Link>
      </div>

      {/* Characters Section */}
      <div className="px-4 py-3 border-b">
        <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
          <Users className="h-4 w-4" />
          {t("characters")}
        </h2>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 pb-4 w-64">
          {isLoading ? (
            <div className="space-y-2 p-3 w-64">
              <div className="h-12 bg-muted rounded-lg animate-pulse" />
              <div className="h-12 bg-muted rounded-lg animate-pulse" />
              <div className="h-12 bg-muted rounded-lg animate-pulse" />
              <div className="h-12 bg-muted rounded-lg animate-pulse" />
              <div className="h-12 bg-muted rounded-lg animate-pulse" />
            </div>
          ) : (
            <>
              {/* Always show default characters first */}
              {defaultCharacters.map((character) => (
                <Link
                  key={character.id}
                  href={`/dashboard/chat/${character.id}`}
                >
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent transition-colors cursor-pointer",
                      pathname === `/dashboard/chat/${character.id}` &&
                        "bg-accent"
                    )}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={character.avatar_url} />
                      <AvatarFallback>{character.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium truncate">
                        {character.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {character.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Show user's custom characters after default ones */}
              {characters.length > 0 && (
                <>
                  <Separator className="my-2" />
                  {characters.map((character) => (
                    <Link
                      key={character.id}
                      href={`/dashboard/chat/${character.id}`}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent transition-colors cursor-pointer",
                          pathname === `/dashboard/chat/${character.id}` &&
                            "bg-accent"
                        )}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={character.avatar_url} />
                          <AvatarFallback>{character.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-medium truncate">
                            {character.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {character.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      <Separator />

      {/* Create Character Button */}
      <div className="p-4">
        <CreateCharacterModal onCharacterCreated={handleCharacterCreated} />
      </div>

      {/* User Profile */}
      <div className="border-t">
        <UserProfile />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header with Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="flex items-center  p-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image src={logo} alt="Boby AI Logo" className="h-6 w-6" />
              <h1 className="text-xl font-bold">Boby AI</h1>
            </Link>
          </div>
          <LanguageSelector />
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 pt-[73px]"
          onClick={() => setIsMobileOpen(false)}
        >
          <div
            className="w-64 h-full bg-background border-r shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r bg-background h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  );
}
