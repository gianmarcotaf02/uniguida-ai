# 🚀 Deploy UniGuida AI su Vercel

Questa guida ti aiuterà a deployare UniGuida AI su Vercel con tutte le integrazioni.

## 📋 Pre-requisiti

- ✅ Account [Vercel](https://vercel.com/)
- ✅ Account [OpenRouter](https://openrouter.ai/) con API key
- ✅ Account [Supabase](https://supabase.com/) con progetto configurato
- ✅ Repository GitHub con il codice

## 🚀 Step 1: Setup Vercel

### Opzione A: Deploy via Dashboard

1. **Vai su [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Clicca "New Project"**
3. **Importa il repository da GitHub**
4. **Configura il progetto:**
   - Framework Preset: **Vite**
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Opzione B: Deploy via CLI

```bash
# Installa Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy dalla root del progetto
vercel

# Segui le prompts:
# ? Set up and deploy "./uniguida-ai"? [Y/n] Y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] N
# ? What's your project's name? uniguida-ai
# ? In which directory is your code located? ./
```

## 🔧 Step 2: Variabili d'Ambiente

Nel **Vercel Dashboard**, vai su **Settings > Environment Variables** e aggiungi:

### 🔑 Variabili Obbligatorie

```env
# OpenRouter API Key
OPENROUTER_API_KEY=sk-or-v1-xxxxx

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI Configuration
OPENROUTER_MODEL=x-ai/grok-4-fast-free
OPENROUTER_ENABLE_REASONING=true

# App Configuration
VITE_APP_NAME=UniGuida AI
VITE_APP_VERSION=1.0.0
VITE_APP_URL=https://your-app.vercel.app
```

### 🛠️ Variabili Opzionali

```env
# Development/Production
NODE_ENV=production

# Analytics (se usi servizi come Google Analytics)
VITE_GA_ID=G-XXXXXXXXXX
```

## 📊 Step 3: Setup Supabase

### 1. Crea il Database

1. **Vai su [Supabase Dashboard](https://supabase.com/dashboard)**
2. **Apri il tuo progetto > SQL Editor**
3. **Copia e incolla il contenuto di `supabase-setup.sql`**
4. **Esegui la query** per creare tabelle e policies

### 2. Verifica la Configurazione

```sql
-- Verifica che le tabelle siano state create
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- Dovrebbe restituire:
-- user_profiles
-- quiz_sessions
-- chat_history
-- user_analytics
```

### 3. Configura le Policies (Sicurezza)

Le policies sono già incluse nel setup SQL, ma per produzione considera:

```sql
-- Per production, potresti voler aggiungere autenticazione
-- Esempio: solo utenti autenticati possono accedere ai propri dati
CREATE POLICY "Users can only access their own data"
    ON public.user_profiles FOR ALL
    USING (auth.uid()::text = user_id);
```

## 🔧 Step 4: Configurazione OpenRouter

### 1. Ottieni la API Key

1. **Vai su [OpenRouter Keys](https://openrouter.ai/keys)**
2. **Crea una nuova API key**
3. **Copia la key** (inizia con `sk-or-v1-`)

### 2. Configura i Crediti

1. **Vai su [OpenRouter Credits](https://openrouter.ai/credits)**
2. **Aggiungi crediti** per l'utilizzo del modello Grok-4
3. **Monitoraggio**: Controlla l'uso nella dashboard

### 3. Modelli Disponibili

Il progetto è configurato per usare:
- **Modello Primario**: `x-ai/grok-4-fast-free`
- **Reasoning**: Abilitato per analisi approfondite
- **Alternative**: Puoi cambiare modello nella variabile `OPENROUTER_MODEL`

## 🌐 Step 5: Deploy e Test

### 1. Triggera il Deploy

```bash
# Opzione A: Push su GitHub (auto-deploy attivo)
git add .
git commit -m "feat: setup production environment"
git push origin main

# Opzione B: Deploy manuale
vercel --prod
```

### 2. Verifica il Deploy

1. **Vai al URL fornito da Vercel**
2. **Testa le funzionalità principali:**
   - ✅ Homepage carica correttamente
   - ✅ Questionario funziona e salva risultati
   - ✅ Chat AI risponde (test con OpenRouter)
   - ✅ Profilo utente si salva (test con Supabase)
   - ✅ Design responsivo funziona

### 3. Monitoring e Debug

```bash
# Visualizza i logs in tempo reale
vercel logs --follow

# Verifica le variabili d'ambiente
vercel env ls
```

## 📈 Step 6: Ottimizzazioni Post-Deploy

### 1. Performance

- **CDN**: Vercel gestisce automaticamente il CDN globale
- **Caching**: Headers ottimizzati per asset statici
- **Compression**: Gzip/Brotli abilitati automaticamente

### 2. SEO e Meta Tags

Aggiungi nel `index.html`:

```html
<meta name="description" content="Orientamento universitario intelligente con AI per studenti italiani">
<meta property="og:title" content="UniGuida AI - Orientamento Universitario">
<meta property="og:description" content="Trova il tuo percorso universitario ideale con l'intelligenza artificiale">
<meta property="og:url" content="https://your-app.vercel.app">
<meta property="og:image" content="https://your-app.vercel.app/og-image.png">
```

### 3. Analytics e Monitoring

Considera l'integrazione di:
- **Vercel Analytics** per performance
- **Google Analytics** per user tracking
- **Sentry** per error monitoring

## 🔒 Step 7: Sicurezza e Best Practices

### 1. Ambiente Variabili

- ✅ **Mai committare** chiavi API nel codice
- ✅ **Usa prefisso VITE_** per variabili client-side
- ✅ **Variabili sensibili** solo server-side quando possibile

### 2. Supabase Security

```sql
-- Abilita RLS su tutte le tabelle
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies più restrittive per produzione
CREATE POLICY "Authenticated users only"
    ON public.user_profiles FOR ALL
    USING (auth.role() = 'authenticated');
```

### 3. Rate Limiting

OpenRouter ha rate limits automatici, ma monitora l'utilizzo:

```javascript
// Nel service, aggiungi retry logic
const maxRetries = 3;
const retryDelay = 1000; // 1 secondo

async function callWithRetry(apiCall, retries = maxRetries) {
  try {
    return await apiCall();
  } catch (error) {
    if (retries > 0 && error.status === 429) {
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return callWithRetry(apiCall, retries - 1);
    }
    throw error;
  }
}
```

## 🎯 URL e Domini

### URL di Default
- **Vercel URL**: `https://uniguida-ai.vercel.app`
- **Custom Domain**: Configura in Vercel Dashboard > Settings > Domains

### DNS Setup per Dominio Personalizzato
```
# CNAME Record
CNAME    www    uniguida-ai.vercel.app

# A Record per apex domain
A        @      76.76.19.61
```

## 🚨 Troubleshooting

### Problemi Comuni

#### 1. Build Fallisce
```bash
# Verifica locally
npm run build

# Check logs
vercel logs
```

#### 2. Variabili d'Ambiente Non Funzionano
- Verifica prefisso `VITE_` per client-side
- Re-deploy dopo modifiche env vars
- Controlla typos nei nomi

#### 3. Supabase Connection Error
- Verifica URL e keys
- Controlla policies RLS
- Verifica network/firewall

#### 4. OpenRouter API Errors
- Controlla crediti disponibili
- Verifica API key validity
- Monitor rate limits

## 📞 Supporto

- **Vercel**: [Documentazione](https://vercel.com/docs)
- **Supabase**: [Docs](https://supabase.com/docs)
- **OpenRouter**: [API Docs](https://openrouter.ai/docs)

---

**🎉 Congratulazioni! UniGuida AI è ora live e pronto per aiutare gli studenti italiani!**
