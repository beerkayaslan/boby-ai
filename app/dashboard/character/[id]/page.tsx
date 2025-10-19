"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function CharacterPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.id as string;
  const t = useTranslations("dashboard");

  useEffect(() => {
    // Karakter sayfası yerine direkt chat'e yönlendir
    router.replace(`/dashboard/chat/${characterId}`);
  }, [characterId, router]);

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted-foreground">{t("redirecting")}</p>
    </div>
  );
}
