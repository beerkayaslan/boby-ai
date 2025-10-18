"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateCharacterModal } from "./create-character-modal";
import { LogoutButton } from "./logout-button";

interface Character {
  id: string;
  name: string;
  avatar_url: string;
  description: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [characters] = useState<Character[]>([
    {
      id: "1",
      name: "Einstein",
      avatar_url: "https://ui-avatars.com/api/?name=Einstein&background=random",
      description: "Ünlü fizikçi ve görelilik teorisinin yaratıcısı",
    },
    {
      id: "2",
      name: "Shakespeare",
      avatar_url:
        "https://ui-avatars.com/api/?name=Shakespeare&background=random",
      description: "İngiliz şair ve oyun yazarı",
    },
    {
      id: "3",
      name: "Marie Curie",
      avatar_url:
        "https://ui-avatars.com/api/?name=Marie+Curie&background=random",
      description: "Nobel ödüllü bilim insanı",
    },
  ]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 flex items-center gap-2 border-b">
        <Sparkles className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold">Character AI</h1>
      </div>

      {/* Characters Section */}
      <div className="px-4 py-3">
        <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
          <Users className="h-4 w-4" />
          Karakterler
        </h2>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 pb-4">
          {characters.map((character) => (
            <Link key={character.id} href={`/dashboard/chat/${character.id}`}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent transition-colors cursor-pointer",
                  pathname === `/dashboard/chat/${character.id}` && "bg-accent"
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
        </div>
      </ScrollArea>

      <Separator />

      {/* Create Character Button */}
      <div className="p-4">
        <CreateCharacterModal />
      </div>

      {/* Logout */}
      <div className="p-4 border-t">
        <LogoutButton />
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
