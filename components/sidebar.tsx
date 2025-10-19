"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateCharacterModal } from "./create-character-modal";
import { UserProfile } from "./user-profile";
import { createClient } from "@/lib/supabase/client";

interface Character {
  id: string;
  name: string;
  avatar_url: string;
  description: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("characters")
        .select("*")
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
    // Yeni karakter oluşturulduğunda listeyi yenile
    fetchCharacters();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full w-full">
      {/* Logo */}
      <Link href="/dashboard" className="p-4 flex items-center gap-2 border-b">
        <Sparkles className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold">Character AI</h1>
      </Link>

      {/* Characters Section */}
      <div className="px-4 py-3">
        <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
          <Users className="h-4 w-4" />
          Karakterler
        </h2>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 pb-4 w-64">
          {isLoading ? (
            <div className="space-y-2 p-3  w-64">
              <div className="h-12 bg-muted rounded-lg animate-pulse" />
              <div className="h-12 bg-muted rounded-lg animate-pulse" />
              <div className="h-12 bg-muted rounded-lg animate-pulse" />
              <div className="h-12 bg-muted rounded-lg animate-pulse" />
              <div className="h-12 bg-muted rounded-lg animate-pulse" />
            </div>
          ) : characters.length === 0 ? (
            <div className="text-center py-8 px-4">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Henüz karakter yok
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Aşağıdaki butona tıklayarak ilk karakterinizi oluşturun
              </p>
            </div>
          ) : (
            characters.map((character) => (
              <Link key={character.id} href={`/dashboard/chat/${character.id}`}>
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
            ))
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
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
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
            className="w-64 h-full bg-background border-r"
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
