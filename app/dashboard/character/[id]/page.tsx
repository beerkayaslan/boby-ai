"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CharacterPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.id as string;

  useEffect(() => {
    // Karakter sayfası yerine direkt chat'e yönlendir
    router.replace(`/dashboard/chat/${characterId}`);
  }, [characterId, router]);

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted-foreground">Yönlendiriliyor...</p>
    </div>
  );
}
