"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewChatPage() {
  const router = useRouter();

  useEffect(() => {
    // Dashboard'a yönlendir - kullanıcı karakter seçsin
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted-foreground">Yönlendiriliyor...</p>
    </div>
  );
}
