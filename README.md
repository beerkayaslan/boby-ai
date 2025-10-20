# Boby AI - Yapay Zeka Destekli Karakter Sohbet Platformu

Boby AI, yapay zeka teknolojisi ile güçlendirilmiş karakterlerle gerçek zamanlı sohbet deneyimi sunan modern bir web uygulamasıdır. Next.js 15, Supabase ve Groq AI ile geliştirilmiştir.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## İçindekiler

- [Özellikler](#-özellikler)
- [Kurulum](#-kurulum)
- [Proje Yapısı](#-proje-yapısı)
- [Sayfalar](#-sayfalar)
- [Dil Desteği](#-dil-desteği)
- [Tema Sistemi](#-tema-sistemi)
- [Teknolojiler](#-teknolojiler)

## Özellikler

- **AI Destekli Sohbetler**: Groq AI ile doğal ve akıcı konuşmalar
- **Karakter Oluşturma**: Kendi AI karakterlerinizi tasarlayın
- **Karakter Kütüphanesi**: Binlerce hazır karakterle tanışın
- **Çoklu Dil Desteği**: Türkçe ve İngilizce arayüz
- **Tema Seçenekleri**: Light, Dark ve System temaları
- **Güvenli Kimlik Doğrulama**: Supabase Auth ile e-posta/Google girişi
- **Gerçek Zamanlı Chat**: Markdown desteği ile zengin mesajlaşma
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm

## Kurulum

### Gereksinimler

Bu projeyi çalıştırmak için aşağıdaki araçların yüklü olması gerekmektedir:

- **Node.js**: v22.18.0 (`.nvmrc` dosyasında belirtilmiştir)
- **npm** veya **yarn**: Paket yöneticisi
- **Git**: Projeyi klonlamak için

### Adım 1: Node.js Sürümünü Ayarlama

Proje, Node.js v22.18.0 sürümünü kullanmaktadır. NVM (Node Version Manager) kullanıyorsanız:

```bash
# NVM ile doğru Node.js sürümünü yükleyin
nvm install

# Veya manuel olarak
nvm install 22.18.0
nvm use 22.18.0
```

### Adım 2: Projeyi Klonlama

```bash
# Projeyi klonlayın
git clone https://github.com/beerkayaslan/boby-ai.git

# Proje dizinine gidin
cd boby-ai
```

### Adım 3: Bağımlılıkları Yükleme

```bash
# npm kullanarak bağımlılıkları yükleyin
npm install

# veya yarn kullanabilirsiniz
yarn install
```

### Adım 4: Ortam Değişkenlerini Ayarlama

Projenin kök dizininde `.env.local` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Groq AI
GROQ_API_KEY=your-groq-api-key
```

### Adım 5: Uygulamayı Başlatma

```bash
# Development server'ı başlatın
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

### Diğer Komutlar

```bash
# Production build oluşturma
npm run build

# Production server'ı başlatma
npm start

# Kod kalitesi kontrolü
npm run lint
```

## Proje Yapısı

```
boby-ai/
├── app/                          # Next.js App Router
│   ├── api/                      # API rotaları
│   │   └── chat/                 # Chat endpoint (AI sohbet işlemleri)
│   ├── auth/                     # Kimlik doğrulama sayfaları
│   │   ├── login/                # Giriş sayfası
│   │   ├── sign-up/              # Kayıt sayfası
│   │   ├── forgot-password/      # Şifre sıfırlama
│   │   ├── update-password/      # Şifre güncelleme
│   │   ├── confirm/              # E-posta onaylama
│   │   ├── error/                # Hata sayfası
│   │   └── sign-up-success/      # Kayıt başarılı sayfası
│   ├── dashboard/                # Kullanıcı paneli
│   │   ├── chat/                 # Sohbet sayfaları
│   │   │   ├── [id]/             # Mevcut sohbet
│   │   │   └── new/              # Yeni sohbet
│   │   ├── character/            # Karakter sayfaları
│   │   │   └── [id]/             # Karakter detayı
│   │   └── conversation/         # Konuşma sayfaları
│   │       └── [id]/             # Konuşma detayı
│   ├── globals.css               # Global stiller
│   ├── layout.tsx                # Ana layout
│   └── page.tsx                  # Ana sayfa
├── components/                   # React bileşenleri
│   ├── ui/                       # Temel UI bileşenleri (shadcn/ui)
│   ├── auth-button.tsx           # Kimlik doğrulama butonu
│   ├── chat-interface.tsx        # Chat arayüzü
│   ├── create-character-modal.tsx# Karakter oluşturma modalı
│   ├── language-selector.tsx     # Dil seçici
│   ├── theme-switcher.tsx        # Tema değiştirici
│   ├── sidebar.tsx               # Yan menü
│   └── ...                       # Diğer bileşenler
├── lib/                          # Yardımcı kütüphaneler
│   ├── supabase/                 # Supabase istemcileri
│   │   ├── client.ts             # İstemci tarafı
│   │   ├── server.ts             # Sunucu tarafı
│   │   └── middleware.ts         # Middleware
│   └── utils.ts                  # Yardımcı fonksiyonlar
├── messages/                     # Çeviri dosyaları
│   ├── en.json                   # İngilizce çeviriler
│   └── tr.json                   # Türkçe çeviriler
├── i18n/                         # i18n yapılandırması
│   └── request.ts                # Dil talebi yönetimi
├── .nvmrc                        # Node.js sürüm belirteci
├── middleware.ts                 # Next.js middleware
├── next.config.ts                # Next.js yapılandırması
├── tailwind.config.ts            # Tailwind CSS yapılandırması
└── tsconfig.json                 # TypeScript yapılandırması
```

## Sayfalar

### Ana Sayfa (`/`)
Landing page, uygulamanın özelliklerini sergiler:
- Hero bölümü ve CTA butonları
- Özellik kartları (Doğal Sohbetler, Karakter Oluşturma, Karakter Kütüphanesi)
- Dil ve tema seçicileri
- Giriş/Kayıt butonları

### Kimlik Doğrulama Sayfaları (`/auth/*`)

#### `/auth/login` - Giriş Sayfası
- E-posta ve şifre ile giriş
- Google OAuth desteği
- Şifremi unuttum bağlantısı

#### `/auth/sign-up` - Kayıt Sayfası
- Yeni kullanıcı kaydı
- E-posta doğrulama
- Google OAuth ile hızlı kayıt

#### `/auth/forgot-password` - Şifre Sıfırlama
- E-posta ile şifre sıfırlama talebi
- Güvenli token gönderimi

#### `/auth/update-password` - Şifre Güncelleme
- Yeni şifre belirleme
- Doğrulama ile güvenli güncelleme

#### `/auth/confirm` - E-posta Onaylama
- E-posta doğrulama endpoint'i
- Otomatik yönlendirme

#### `/auth/error` - Hata Sayfası
- Kimlik doğrulama hatalarını gösterir

#### `/auth/sign-up-success` - Kayıt Başarılı
- E-posta doğrulama talimatları

### Dashboard Sayfaları (`/dashboard/*`)

#### `/dashboard` - Ana Panel
- Hoş geldin mesajı
- İstatistik kartları
- Hızlı erişim linkleri
- Son sohbetler ve karakterler

#### `/dashboard/chat/new` - Yeni Sohbet
- Karakter seçimi
- Yeni sohbet başlatma
- AI destekli ilk mesaj önerileri

#### `/dashboard/chat/[id]` - Sohbet Detayı
- Gerçek zamanlı mesajlaşma
- Markdown desteği
- Kod highlight'ı
- Mesaj geçmişi
- Karakter profili gösterimi

#### `/dashboard/character/[id]` - Karakter Detayı
- Karakter bilgileri
- Karakter tanımı ve kişiliği
- Sohbet başlatma
- Karakter düzenleme (eğer kullanıcının karakteriyse)

#### `/dashboard/conversation/[id]` - Konuşma Detayı
- Konuşma geçmişi
- İstatistikler ve analizler

### API Rotaları (`/api/*`)

#### `/api/chat` - Chat API
- POST: Yeni mesaj gönderme
- AI yanıtı alma (Groq)
- Stream desteği
- Konuşma geçmişi yönetimi

## 🌍 Dil Desteği

Proje, **next-intl** kütüphanesi kullanarak çoklu dil desteği sunmaktadır.

### Desteklenen Diller
- **Türkçe** (tr)
- **İngilizce** (en)

### Dil Değiştirme
- Navigasyon barında dil seçici butonu
- Cookie tabanlı dil tercihi saklama
- Sayfa yenilemeden dil değişimi
- Tüm sayfa ve bileşenlerde otomatik çeviri

### Çeviri Dosyaları
Çeviriler `messages/` klasöründe JSON formatında saklanır:

```
messages/
├── en.json    # İngilizce çeviriler
└── tr.json    # Türkçe çeviriler
```

Her dosya aşağıdaki yapıyı takip eder:
- `home`: Ana sayfa çevirileri
- `auth`: Kimlik doğrulama sayfaları
- `dashboard`: Dashboard ve sohbet arayüzü
- `common`: Genel kullanılan metinler

## Tema Sistemi

Proje, **next-themes** kütüphanesi ile dinamik tema desteği sunar.

### Tema Seçenekleri
- **Light Mode**: Aydınlık tema
- **Dark Mode**: Karanlık tema
- **System**: Sistem temasını takip eder

### Tema Özellikleri
- Kullanıcı tercihini localStorage'da saklar
- Sayfa yenilemede tema korunur
- Tüm bileşenlerde otomatik tema uyumu
- Tailwind CSS dark mode desteği
- Smooth geçişler

### Tema Değiştirme
Navigasyon barındaki tema butonu ile kolayca değiştirebilirsiniz.

## Teknolojiler

### Frontend
- **Next.js 15**: React framework (App Router)
- **React 19**: UI kütüphanesi
- **TypeScript**: Tip güvenli geliştirme
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Hazır UI bileşenleri
- **Radix UI**: Erişilebilir primitif bileşenler
- **Lucide React**: İkon kütüphanesi
- **next-themes**: Tema yönetimi
- **next-intl**: Çoklu dil desteği
- **nextjs-toploader**: Sayfa yükleme göstergesi

### Backend & Database
- **Supabase**: Backend-as-a-Service
  - PostgreSQL veritabanı
  - Kimlik doğrulama (Auth)
  - Row Level Security (RLS)
- **Groq AI**: Hızlı AI çıkarım motoru
  - Llama 3 modeli
  - Düşük latency
  - Yüksek throughput

### Markdown & Syntax Highlighting
- **react-markdown**: Markdown render
- **remark-gfm**: GitHub Flavored Markdown
- **rehype-highlight**: Kod vurgulama
- **rehype-raw**: HTML desteği

### Development Tools
- **ESLint**: Kod kalitesi
- **Prettier**: Kod formatlama (otomatik)
- **Turbopack**: Hızlı bundling
- **PostCSS**: CSS dönüşümleri

## Güvenlik

- Supabase Row Level Security (RLS) politikaları
- Güvenli kimlik doğrulama akışları
- Environment variables ile hassas bilgi yönetimi
- HTTPS zorunluluğu (production)
- XSS koruması
- CSRF token'ları

## Lisans

Bu proje [MIT lisansı](LICENSE) altında lisanslanmıştır.

## Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen bir pull request göndermeden önce:

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## İletişim

Proje Sahibi: [Berkay Aslan](https://github.com/beerkayaslan)

Proje Linki: [https://github.com/beerkayaslan/boby-ai](https://github.com/beerkayaslan/boby-ai)
