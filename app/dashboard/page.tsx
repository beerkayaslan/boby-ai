import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sparkles, MessageSquare, Users, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          Boby AI&apos;a Hoş Geldiniz
        </h1>
        <p className="text-muted-foreground">
          AI karakterlerle sohbet edin, yeni karakterler oluşturun ve harika
          konuşmalar yapın.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Sohbetler
            </CardTitle>
            <CardDescription>
              AI karakterlerle sınırsız sohbet edin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sol menüden bir karakter seçin veya yeni bir sohbet başlatın.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Karakterler
            </CardTitle>
            <CardDescription>
              Kendi AI karakterlerinizi oluşturun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Karakter Oluştur butonuna tıklayarak özel karakterler yaratın.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Hızlı Başlangıç
            </CardTitle>
            <CardDescription>Hemen başlamaya hazır mısınız?</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Önceden hazırlanmış karakterlerle hemen sohbete başlayın.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Nasıl Kullanılır?</h2>
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold">Karakter Seçin</h3>
              <p className="text-sm text-muted-foreground">
                Sol menüden bir karakter seçin. Karaktere tıkladığınızda sohbet
                ekranı açılır.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold">Sohbet Edin</h3>
              <p className="text-sm text-muted-foreground">
                Mesajınızı yazın ve AI karakterle konuşmaya başlayın. Sağ
                tarafta karakterin bilgilerini görebilirsiniz.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold">Geçmişi Görüntüleyin</h3>
              <p className="text-sm text-muted-foreground">
                Sağ sidebar&apos;da &quot;Geçmiş&quot; sekmesine tıklayarak
                önceki sohbetlerinizi görüntüleyin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
