"use client";

import { useState, useRef } from "react";
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
import { Plus, X } from "lucide-react";
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Lütfen bir resim dosyası seçin");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Dosya boyutu 2MB'dan küçük olmalıdır");
      return;
    }

    setUploadError("");
    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    setUploadError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadAvatar = async (userId: string): Promise<string> => {
    if (!avatarFile) return "";

    const supabase = createClient();
    const fileExt = avatarFile.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setUploadError("");

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUploadError("Kullanıcı oturumu bulunamadı");
      setIsLoading(false);
      return;
    }

    try {
      let uploadedAvatarUrl = "";
      if (avatarFile) {
        uploadedAvatarUrl = await uploadAvatar(user.id);
      }

      const newCharacter = {
        name,
        description,
        greeting,
        avatar_url: uploadedAvatarUrl,
      };

      await addCharacterToSupabase(newCharacter);

      onCharacterCreated?.(newCharacter);

      setName("");
      setDescription("");
      setGreeting("");
      setAvatarFile(null);
      setAvatarPreview("");
      setOpen(false);
    } catch (error) {
      console.error("Karakter oluşturma hatası:", error);
      setUploadError(
        error instanceof Error ? error.message : "Bir hata oluştu"
      );
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
              <Label htmlFor="avatar">Avatar</Label>
              <div className="flex gap-2">
                <Input
                  ref={fileInputRef}
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
                {avatarFile && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleRemoveAvatar}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {uploadError && (
                <p className="text-sm text-red-500">{uploadError}</p>
              )}
              {avatarPreview && (
                <div className="flex justify-center mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-20 h-20 rounded-full object-cover"
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
