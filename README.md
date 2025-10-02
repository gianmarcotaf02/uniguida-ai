# 🎓 UniGuida AI

<div align="center">

![UniGuida AI Logo](https://img.shields.io/badge/UniGuida-AI-blue?style=for-the-badge&logo=graduation-cap)

**Orientamento Universitario Intelligente per gli Studenti Italiani**

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-Grok_4-FF6B6B?style=flat&logo=openai)](https://openrouter.ai/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat&logo=vercel)](https://vercel.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)

[🚀 Demo Live](https://uniguida-ai.vercel.app) • [📚 Documentazione](#come-iniziare) • [🐛 Report Bug](https://github.com/your-repo/issues) • [💡 Richiedi Feature](https://github.com/your-repo/issues)

</div>

---

## ✨ Descrizione

**UniGuida AI** è una piattaforma innovativa di orientamento universitario che sfrutta l'intelligenza artificiale per guidare gli studenti italiani nella scelta del percorso universitario ideale. Attraverso un sistema di analisi personalizzata e consulenza AI, offre consigli mirati basati su background, interessi e aspirazioni individuali.

## 🚀 Funzionalità Principali

### 🧠 **Intelligenza Artificiale Avanzata**
- **Questionario Personalizzato**: Quiz interattivo per mappare inclinazioni accademiche e professionali
- **Analisi AI Dettagliata**: Powered by OpenRouter con modello **Grok-4 Fast Free** per suggerimenti universitari accurati
- **Chat AI Consultiva**: Assistente virtuale con reasoning avanzato per domande specifiche e guidance personalizzata
- **Reasoning Engine**: Sistema di ragionamento per analisi approfondite e consigli strutturati

### 👤 **Esperienza Utente**
- **Profilo Personalizzato**: Gestione completa di informazioni personali e preferenze
- **Persistenza Cloud**: Salvataggio sicuro dei dati con Supabase Database
- **Sincronizzazione**: Accesso ai tuoi dati da qualsiasi dispositivo
- **Design Responsivo**: Interfaccia moderna e accessibile su tutti i dispositivi

### 🎯 **Funzionalità Specializzate**
- **Analisi delle Scuole Superiori**: Considerazione del background educativo
- **Consigli Geografici**: Suggerimenti basati sulla città di origine
- **Tracciamento Interessi**: Sistema di categorizzazione delle preferenze

## 🛠️ Stack Tecnologico

<div align="center">

| Categoria | Tecnologie |
|-----------|------------|
| **Frontend** | ![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) |
| **Styling** | ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=flat&logo=css3&logoColor=white) ![Custom Design](https://img.shields.io/badge/-Custom_Design-FF6B6B?style=flat) |
| **Build Tool** | ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat&logo=vite&logoColor=white) |
| **AI/ML** | ![OpenRouter](https://img.shields.io/badge/-OpenRouter-FF6B6B?style=flat&logo=openai&logoColor=white) ![Grok-4](https://img.shields.io/badge/-Grok_4-000000?style=flat) |
| **Database** | ![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white) |
| **Deployment** | ![Vercel](https://img.shields.io/badge/-Vercel-000000?style=flat&logo=vercel&logoColor=white) |

</div>

## 📁 Struttura del Progetto

```
uniguida-ai/
├── 📁 components/          # Componenti React riutilizzabili
│   ├── ChatMessage.tsx     # Componente per messaggi chat
│   ├── Footer.tsx          # Footer dell'applicazione
│   ├── Header.tsx          # Header con navigazione
│   ├── icons.tsx           # Icone SVG personalizzate
│   ├── LoadingSpinner.tsx  # Indicatore di caricamento
│   └── QuestionCard.tsx    # Card per domande del quiz
├── 📁 pages/               # Componenti a livello di pagina
│   ├── ChatPage.tsx        # Interfaccia chat AI
│   ├── HomePage.tsx        # Pagina principale
│   ├── ProfilePage.tsx     # Gestione profilo utente
│   ├── QuestionnairePage.tsx # Quiz di orientamento
│   └── ResultsPage.tsx     # Risultati e analisi
├── 📁 services/            # Servizi e API
│   └── geminiService.ts    # Integrazione Google Gemini AI
├── 📁 utils/               # Funzioni di utilità
│   └── storage.ts          # Gestione localStorage
├── 📄 types.ts             # Definizioni TypeScript
├── 📄 constants.ts         # Costanti dell'applicazione
├── 📄 App.tsx              # Componente principale e routing
├── 📄 index.tsx            # Entry point React
├── 📄 index.html           # Template HTML
├── 📄 vite.config.ts       # Configurazione Vite
├── 📄 tsconfig.json        # Configurazione TypeScript
├── 📄 package.json         # Dipendenze e script
└── 📄 README.md            # Documentazione (questo file)
```

## 🚀 Come Iniziare

### 📋 Prerequisiti

Assicurati di avere installato:

- **Node.js** (versione 18+ raccomandata) 📦
- **npm** o **yarn** per la gestione dei pacchetti 📦
- **Chiave API OpenRouter** 🔑
- **Account Supabase** (opzionale per cloud sync) ☁️

### ⚡ Installazione Rapida

1. **📥 Clona il repository**
   ```bash
   git clone https://github.com/your-username/uniguida-ai.git
   cd uniguida-ai
   ```

2. **📦 Installa le dipendenze**
   ```bash
   npm install
   # oppure
   yarn install
   ```

3. **🔐 Configura le variabili d'ambiente**

   Crea un file `.env` nella root del progetto:
   ```env
   # 🔑 OpenRouter API (obbligatorio)
   OPENROUTER_API_KEY=your_openrouter_api_key_here

   # ☁️ Supabase (opzionale - per cloud sync)
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # 🤖 AI Configuration
   OPENROUTER_MODEL=x-ai/grok-4-fast-free
   OPENROUTER_ENABLE_REASONING=true
   ```

   > 💡 **Come ottenere le chiavi API:**
   >
   > **🤖 OpenRouter (Obbligatorio):**
   > 1. Visita [OpenRouter](https://openrouter.ai/keys)
   > 2. Crea un account e vai alla sezione Keys
   > 3. Genera una nuova API key
   > 4. Copia la chiave nel file `.env`
   >
   > **☁️ Supabase (Opzionale):**
   > 1. Vai su [Supabase](https://supabase.com/) e crea un progetto
   > 2. Nel dashboard, vai su Settings > API
   > 3. Copia Project URL e anon public key
   > 4. Esegui lo script SQL: copia il contenuto di `supabase-setup.sql` nell'SQL Editor4. **🚀 Avvia il server di sviluppo**
   ```bash
   npm run dev
   # oppure
   yarn dev
   ```

5. **🌐 Apri l'applicazione**

   Naviga su [http://localhost:3000](http://localhost:3000) nel tuo browser

### 🏗️ Script Disponibili

| Comando | Descrizione |
|---------|-------------|
| `npm run dev` | 🔥 Avvia il server di sviluppo con hot reload |
| `npm run build` | 📦 Costruisce l'app per la produzione |
| `npm run preview` | 👀 Preview della build di produzione |

## 🎯 Funzionalità Dettagliate

### 🧪 Sistema di Quiz Personalizzato

Il questionario è progettato per valutare:
- **Interessi Accademici**: Materie preferite e aree di studio
- **Stile di Apprendimento**: Preferenze metodologiche
- **Obiettivi Professionali**: Aspirazioni di carriera
- **Competenze Attuali**: Background e skills esistenti

### 🤖 Integrazione AI Avanzata

- **Modello**: Google Gemini 2.5 Flash
- **Personalizzazione**: Analisi basata su profilo e risultati quiz
- **Memoria Conversazionale**: Chat context-aware
- **Risposte Localizzate**: Specifiche per il sistema universitario italiano

### 💾 Gestione Dati Locale

- **Persistenza**: Tutti i dati vengono salvati localmente nel browser
- **Privacy**: Nessun dato personale viene inviato a server esterni
- **Backup**: Possibilità di esportare/importare configurazioni

## 🎨 Design System

### 🌈 Palette Colori
- **Primario**: Blu università `#1E40AF`
- **Secondario**: Verde accademico `#059669`
- **Accento**: Oro `#F59E0B`
- **Neutro**: Scale di grigi moderne

### 📱 Responsive Design
- **Mobile First**: Design ottimizzato per dispositivi mobili
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Accessibilità**: WCAG 2.1 compliant

## 🧪 Testing e Qualità

```bash
# Lint del codice
npm run lint

# Type checking
npm run type-check

# Test suite (se configurata)
npm run test
```

## 🚀 Deployment

### 📦 Build per Produzione

```bash
# Crea build ottimizzata
npm run build

# Preview della build
npm run preview
```

### 🌐 Opzioni di Deploy

| Piattaforma | Status | Link |
|-------------|---------|------|
| **Vercel** | ✅ Raccomandata | [Deploy to Vercel](https://vercel.com/new) |
| **Netlify** | ✅ Supportata | [Deploy to Netlify](https://netlify.com) |
| **GitHub Pages** | ✅ Supportata | [GitHub Pages Guide](https://pages.github.com/) |

## 🤝 Contribuzioni

Contributi, issues e feature requests sono benvenuti! 🎉

1. **🍴 Fork del progetto**
2. **🌿 Crea un branch per la feature** (`git checkout -b feature/AmazingFeature`)
3. **💾 Commit delle modifiche** (`git commit -m 'Add some AmazingFeature'`)
4. **📤 Push al branch** (`git push origin feature/AmazingFeature`)
5. **🔃 Apri una Pull Request**

### 🏷️ Convenzioni di Commit

Utilizziamo [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: aggiunge nuova funzionalità
fix: corregge un bug
docs: aggiorna documentazione
style: migliora styling
refactor: refactoring del codice
test: aggiunge o modifica test
```

## 📄 Licenza

Questo progetto è distribuito sotto licenza MIT. Vedi il file `LICENSE` per maggiori dettagli.

## 🌟 Riconoscimenti

- **Google AI**: Per l'API Gemini che alimenta l'intelligenza artificiale
- **React Team**: Per il framework frontend
- **Vite**: Per il tooling di build velocissimo
- **Tailwind CSS**: Per il sistema di design utility-first
- **Icone**: [Heroicons](https://heroicons.com/) e [Phosphor Icons](https://phosphoricons.com/)

## 📊 Statistiche del Progetto

<div align="center">

![GitHub last commit](https://img.shields.io/github/last-commit/your-username/uniguida-ai)
![GitHub issues](https://img.shields.io/github/issues/your-username/uniguida-ai)
![GitHub pull requests](https://img.shields.io/github/issues-pr/your-username/uniguida-ai)
![GitHub stars](https://img.shields.io/github/stars/your-username/uniguida-ai)

</div>

## 📞 Supporto

Hai domande o problemi? Contattaci!

- 📧 **Email**: support@uniguida-ai.com
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/uniguida-ai/discussions)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/your-username/uniguida-ai/issues)

---

<div align="center">

**Realizzato con ❤️ per gli studenti italiani**

[⬆️ Torna all'inizio](#-uniguida-ai)

</div>

