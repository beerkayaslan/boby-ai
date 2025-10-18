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
import { createClient } from "@/lib/supabase/client";

interface Character {
  name: string;
  description: string;
  greeting: string;
  avatar_url: string;
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

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    try {
      // TODO: Supabase'e karakter kaydetme işlemi
      const newCharacter = {
        name,
        description,
        greeting,
        avatar_url: avatarUrl,
        user_id: user?.id,
      };

      // Simüle edilmiş kaydetme
      await new Promise((resolve) => setTimeout(resolve, 500));

      onCharacterCreated?.(newCharacter);

      await addCharacterToSupabase(newCharacter);

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

  const addCharacterToSupabase = async (character: Character) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("characters")
      .insert([character])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
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
              onClick={handleSubmit}
            >
              {isLoading ? "Oluşturuluyor..." : "Oluştur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
