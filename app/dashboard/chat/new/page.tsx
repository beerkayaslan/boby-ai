"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function NewChatPage() {
  const router = useRouter();
  const t = useTranslations("dashboard");

  useEffect(() => {
    // Dashboard'a yönlendir - kullanıcı karakter seçsin
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted-foreground">{t("redirecting")}</p>
    </div>
  );
}
