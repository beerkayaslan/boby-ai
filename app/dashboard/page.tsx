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
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const t = await getTranslations("dashboard");

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          {t("welcome")}
        </h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              {t("chats.title")}
            </CardTitle>
            <CardDescription>{t("chats.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("chats.content")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {t("characters.title")}
            </CardTitle>
            <CardDescription>{t("characters.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("characters.content")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              {t("quickStart.title")}
            </CardTitle>
            <CardDescription>{t("quickStart.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("quickStart.content")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">{t("howToUse.title")}</h2>
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold">{t("howToUse.step1.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("howToUse.step1.description")}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold">{t("howToUse.step2.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("howToUse.step2.description")}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold">{t("howToUse.step3.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("howToUse.step3.description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
