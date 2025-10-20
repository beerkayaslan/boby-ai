export interface Character {
  id: string;
  name: string;
  avatar_url: string;
  description: string;
  greeting: string;
}

interface CharacterTranslations {
  id: string;
  avatar_url: string;
  en: {
    name: string;
    description: string;
    greeting: string;
  };
  tr: {
    name: string;
    description: string;
    greeting: string;
  };
}

const CHARACTER_TRANSLATIONS: CharacterTranslations[] = [
  {
    id: "default-1",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=assistant",
    en: {
      name: "AI Assistant",
      description: "Your helpful AI companion for daily tasks",
      greeting: "Hello! I'm your AI Assistant. How can I help you today?",
    },
    tr: {
      name: "Yapay Zeka Asistanı",
      description: "Günlük görevleriniz için yardımcı AI arkadaşınız",
      greeting:
        "Merhaba! Ben senin Yapay Zeka Asistanınım. Bugün sana nasıl yardımcı olabilirim?",
    },
  },
  {
    id: "default-2",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=writer",
    en: {
      name: "Creative Writer",
      description: "Expert in creative writing and storytelling",
      greeting:
        "Greetings! I'm here to help you craft amazing stories and creative content. What shall we write today?",
    },
    tr: {
      name: "Yaratıcı Yazar",
      description: "Yaratıcı yazarlık ve hikaye anlatımı uzmanı",
      greeting:
        "Selam! Harika hikayeler ve yaratıcı içerikler oluşturmana yardımcı olmak için buradayım. Bugün ne yazalım?",
    },
  },
  {
    id: "default-3",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=coder",
    en: {
      name: "Code Expert",
      description: "Programming mentor and debugging specialist",
      greeting:
        "Hey there! I'm your Code Expert. Ready to solve some coding challenges together?",
    },
    tr: {
      name: "Kod Uzmanı",
      description: "Programlama mentoru ve hata ayıklama uzmanı",
      greeting:
        "Selam! Ben senin Kod Uzmanınım. Birlikte kodlama zorluklarını çözmeye hazır mısın?",
    },
  },
  {
    id: "default-4",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=tutor",
    en: {
      name: "Language Tutor",
      description: "Multilingual teacher for language learning",
      greeting:
        "Welcome! I'm your Language Tutor. Which language would you like to practice today?",
    },
    tr: {
      name: "Dil Öğretmeni",
      description: "Dil öğrenimi için çok dilli öğretmen",
      greeting:
        "Hoş geldin! Ben senin Dil Öğretmeninım. Bugün hangi dili pratik yapmak istersin?",
    },
  },
  {
    id: "default-5",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=advisor",
    en: {
      name: "Business Advisor",
      description: "Strategic consultant for business decisions",
      greeting:
        "Hello! I'm your Business Advisor. Let's discuss your business strategies and goals.",
    },
    tr: {
      name: "İş Danışmanı",
      description: "İş kararları için stratejik danışman",
      greeting:
        "Merhaba! Ben senin İş Danışmanınım. İş stratejilerini ve hedeflerini konuşalım.",
    },
  },
];

export function getDefaultCharacters(locale: string = "en"): Character[] {
  const lang = locale === "tr" ? "tr" : "en";
  return CHARACTER_TRANSLATIONS.map((char) => ({
    id: char.id,
    avatar_url: char.avatar_url,
    name: char[lang].name,
    description: char[lang].description,
    greeting: char[lang].greeting,
  }));
}

export const DEFAULT_CHARACTERS: Character[] = getDefaultCharacters("en");

export function getDefaultCharacter(
  id: string,
  locale: string = "en"
): Character | undefined {
  const characters = getDefaultCharacters(locale);
  return characters.find((char) => char.id === id);
}
