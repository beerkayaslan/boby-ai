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
import { Plus, X, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("dashboard.createCharacter");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [greeting, setGreeting] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError(t("errors.imageOnly"));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError(t("errors.fileTooLarge"));
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file);
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
      setUploadError(t("errors.userNotFound"));
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
        error instanceof Error ? error.message : t("errors.createError")
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
          {t("button")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="avatar">{t("avatar")}</Label>

              {/* Avatar Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="relative border-2 border-dashed rounded-lg p-6 transition-colors hover:border-primary/50"
              >
                <input
                  ref={fileInputRef}
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {avatarPreview ? (
                  <div className="flex flex-col items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-lg"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {t("changeButton")}
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveAvatar}
                      >
                        <X className="h-4 w-4 mr-1" />
                        {t("removeButton")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{t("uploadAvatar")}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("clickOrDrag")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("fileFormat")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {uploadError && (
                <p className="text-sm text-red-500">{uploadError}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">{t("characterName")} *</Label>
              <Input
                id="name"
                placeholder={t("characterNamePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">{t("descriptionLabel")} *</Label>
              <Textarea
                id="description"
                placeholder={t("descriptionPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="min-h-[100px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="greeting">{t("firstMessage")} *</Label>
              <Textarea
                id="greeting"
                placeholder={t("firstMessagePlaceholder")}
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
              {t("cancelButton")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !name || !description || !greeting}
              onClick={handleSubmit}
            >
              {isLoading ? t("creating") : t("createButton")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
