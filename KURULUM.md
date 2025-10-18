# Character AI Uygulaması - Kurulum Talimatları

## 📝 Supabase Kurulumu

### 1. Supabase Projesi Oluşturun
1. [supabase.com](https://supabase.com) adresine gidin
2. "Start your project" butonuna tıklayın
3. Yeni bir organizasyon ve proje oluşturun
4. Proje adı ve şifre belirleyin
5. Bölge seçin (size en yakın olanı)

### 2. Veritabanı Şemasını Oluşturun
1. Supabase Dashboard'da sol menüden "SQL Editor" seçin
2. "New Query" butonuna tıklayın
3. `supabase-schema.sql` dosyasının içeriğini kopyalayıp yapıştırın
4. "Run" butonuna basın
5. Şema başarıyla oluşturuldu mesajını görmelisiniz

### 3. API Anahtarlarını Alın
1. Sol menüden "Settings" → "API" seçin
2. "Project URL" ve "anon public" anahtarını kopyalayın

### 4. Ortam Değişkenlerini Ayarlayın
Proje kök dizininde `.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🚀 Uygulamayı Çalıştırma

```bash
# Geliştirme modunda çalıştır
npm run dev

# Tarayıcıda açın
# http://localhost:3000
```

## ✅ Test Adımları

1. **Kayıt Olun**: `/auth/sign-up` sayfasından yeni bir hesap oluşturun
2. **Giriş Yapın**: `/auth/login` sayfasından giriş yapın
3. **Dashboard**: Giriş yaptıktan sonra dashboard'a yönlendirileceksiniz
4. **Karakter Seçin**: Sol menüden bir karaktere tıklayın - otomatik olarak chat ekranı açılır
5. **Sohbet Edin**: Mesajınızı yazın ve AI karakterle konuşun
6. **Karakter Bilgilerini Görün**: Sağ sidebar'da "Bilgi" sekmesinde karakter detaylarını görüntüleyin
7. **Geçmişi İnceleyin**: Sağ sidebar'da "Geçmiş" sekmesine tıklayarak önceki sohbetlerinizi görün
8. **Yeni Karakter Oluşturun**: Sol menüdeki "Karakter Oluştur" butonuna tıklayın

## 🎨 Özellikler

### Mevcut Özellikler
- ✅ Kullanıcı kimlik doğrulama (kayıt/giriş/çıkış)
- ✅ Sol sidebar - Sadece karakterler listesi
- ✅ Karaktere tıklayınca direkt chat'e gitme
- ✅ Sağ sidebar - Karakter bilgileri ve geçmiş
- ✅ İki sekme: "Bilgi" ve "Geçmiş"
- ✅ Karakter oluşturma modalı
- ✅ Chat arayüzü
- ✅ Responsive tasarım (mobil + masaüstü)
- ✅ Tema değiştirici (dark/light)

### Geliştirilmesi Gerekenler
- [ ] Supabase ile karakter kaydetme
- [ ] Supabase ile sohbet kaydetme
- [ ] AI API entegrasyonu (OpenAI/Anthropic)
- [ ] Avatar resim yükleme (Supabase Storage)
- [ ] Gerçek zamanlı mesajlaşma
- [ ] Karakter arama/filtreleme

## 🗄️ Veritabanı Tabloları

### `characters`
- Kullanıcıların oluşturduğu AI karakterleri
- Sütunlar: id, user_id, name, description, greeting, avatar_url, is_public

### `chats`
- Kullanıcı ve karakter arasındaki sohbet oturumları
- Sütunlar: id, user_id, character_id, title, created_at, updated_at

### `messages`
- Her sohbetteki bireysel mesajlar
- Sütunlar: id, chat_id, role (user/assistant), content, created_at

## 🔐 Güvenlik (Row Level Security)

Tüm tablolar RLS ile korunmaktadır:
- Kullanıcılar sadece kendi verilerini görebilir/düzenleyebilir
- Public karakterler tüm kullanıcılar tarafından görülebilir
- Mesajlar sadece sohbet sahibi tarafından görülebilir

## 🐛 Sorun Giderme

### "Invalid API Key" hatası
- `.env.local` dosyasının doğru konumda olduğundan emin olun
- Anahtarların doğru kopyalandığını kontrol edin
- Sunucuyu yeniden başlatın (`npm run dev`)

### "Unauthorized" hatası
- Supabase Dashboard'da RLS politikalarının aktif olduğunu kontrol edin
- SQL şemasını doğru şekilde çalıştırdığınızdan emin olun

### Sayfa yüklenmiyor
- Terminal'de hata mesajlarını kontrol edin
- `node_modules` klasörünü silip tekrar `npm install` yapın
- Tarayıcı cache'ini temizleyin

## 📚 Kullanılan Teknolojiler

- **Next.js 15** - React framework
- **TypeScript** - Tip güvenliği
- **Supabase** - Backend as a Service
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible UI bileşenleri
- **Lucide React** - İkonlar

## 💡 İpuçları

1. **Geliştirme sırasında**: `npm run dev` ile hot-reload aktif
2. **Production build**: `npm run build` ve `npm start`
3. **Linting**: `npm run lint` ile kod kontrolü
4. **Supabase Studio**: Yerel geliştirme için Supabase CLI kullanabilirsiniz

## 🤝 Yardım

Sorun yaşıyorsanız:
1. Terminal çıktılarını kontrol edin
2. Tarayıcı console'unu inceleyin
3. Supabase Dashboard'da logları kontrol edin
