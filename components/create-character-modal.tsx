"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload } from "lucide-react";

interface Character {
  name: string;
  description: string;
  greeting: string;
  avatar_url: string;
  created_at: string;
}

interface CreateCharacterModalProps {
  onCharacterCreated?: (character: Character) => void;
}

export function CreateCharacterModal({
  onCharacterCreated,
}: CreateCharacterModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [greeting, setGreeting] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Supabase'e karakter kaydetme işlemi
      const newCharacter = {
        name,
        description,
        greeting,
        avatar_url: avatarUrl,
        created_at: new Date().toISOString(),
      };

      // Simüle edilmiş kaydetme
      await new Promise((resolve) => setTimeout(resolve, 500));

      onCharacterCreated?.(newCharacter);

      // Formu temizle
      setName("");
      setDescription("");
      setGreeting("");
      setAvatarUrl("");
      setOpen(false);
    } catch (error) {
      console.error("Karakter oluşturma hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Karakter Oluştur
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Yeni Karakter Oluştur</DialogTitle>
            <DialogDescription>
              AI karakterinizi oluşturun. İsim, açıklama ve karşılama mesajı
              ekleyin.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <div className="flex gap-2">
                <Input
                  id="avatar"
                  placeholder="https://example.com/avatar.jpg"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
                <Button type="button" variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              {avatarUrl && (
                <div className="flex justify-center mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarUrl}
                    alt="Avatar preview"
                    className="w-20 h-20 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(name || "?");
                    }}
                  />
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Karakter Adı *</Label>
              <Input
                id="name"
                placeholder="Örn: Einstein"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Açıklama *</Label>
              <Textarea
                id="description"
                placeholder="Karakterinizi tanımlayın..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="min-h-[100px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="greeting">İlk Mesaj *</Label>
              <Textarea
                id="greeting"
                placeholder="Karakterin ilk selamlaması..."
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !name || !description || !greeting}
            >
              {isLoading ? "Oluşturuluyor..." : "Oluştur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
