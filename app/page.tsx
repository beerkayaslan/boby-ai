import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles, Users, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import logo from "@/assets/boby_ai_logo.jpeg";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("home");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        {/* Navigation */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
          <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-2 items-center font-bold text-lg">
              <Image
                src={logo}
                alt="Boby AI Logo"
                className="h-8 w-8 rounded-full"
              />
              <Link href={"/"}>{t("nav.title")}</Link>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>

        {/* Hero Section */}
        <section className="w-full max-w-7xl px-5 py-20 md:py-32">
          <div className="flex flex-col items-center text-center gap-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>{t("hero.badge")}</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl">
              {t("hero.title")}
              <span className="text-primary">{t("hero.titleHighlight")}</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              {t("hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href={user ? "/dashboard" : "/auth/sign-up"}>
                <Button size="lg" className="text-lg px-8 py-6">
                  {t("hero.startButton")}
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {!user && (
                <Link href={user ? "/dashboard" : "/auth/login"}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6"
                  >
                    {user ? t("hero.startButton") : t("hero.loginButton")}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-7xl px-5 py-20 bg-muted/30 rounded-3xl my-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("features.title")}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border hover:shadow-lg transition-all">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("features.naturalChats.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("features.naturalChats.description")}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border hover:shadow-lg transition-all">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("features.createCharacter.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("features.createCharacter.description")}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border hover:shadow-lg transition-all">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("features.library.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("features.library.description")}
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-7xl px-5 py-20 text-center">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl p-12 md:p-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t("cta.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("cta.description")}
            </p>
            <Link href={user ? "/dashboard" : "/auth/sign-up"}>
              <Button size="lg" className="text-lg px-10 py-6">
                {user ? t("hero.dashboardButton") : t("cta.button")}
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16 mt-20">
          <p className="text-muted-foreground">{t("footer.copyright")}</p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
