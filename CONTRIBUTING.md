# 🤝 Guida alla Contribuzione

Grazie per il tuo interesse nel contribuire a **UniGuida AI**! 🎉

Questo documento ti guiderà attraverso il processo di contribuzione al progetto.

## 📋 Codice di Condotta

Ci impegniamo a mantenere un ambiente accogliente e rispettoso per tutti. Contribuendo a questo progetto, accetti di rispettare il nostro codice di condotta.

## 🚀 Come Iniziare

### 1. 🍴 Fork del Repository

1. Vai alla pagina del repository su GitHub
2. Clicca sul pulsante "Fork" in alto a destra
3. Clona il tuo fork localmente:

```bash
git clone https://github.com/YOUR_USERNAME/uniguida-ai.git
cd uniguida-ai
```

### 2. 🛠️ Setup dell'Ambiente di Sviluppo

```bash
# Installa le dipendenze
npm install

# Crea il file .env
cp .env.example .env
# Aggiungi la tua GEMINI_API_KEY nel file .env

# Avvia il server di sviluppo
npm run dev
```

### 3. 🌿 Crea un Branch

```bash
git checkout -b feature/amazing-feature
# oppure
git checkout -b fix/bug-description
```

## 📝 Tipi di Contribuzione

### 🆕 Nuove Funzionalità
- Miglioramenti all'interfaccia utente
- Nuove funzionalità AI
- Integrazione di nuovi servizi
- Ottimizzazioni delle prestazioni

### 🐛 Bug Fix
- Correzione di errori
- Miglioramenti alla stabilità
- Fix di compatibilità

### 📚 Documentazione
- Miglioramenti al README
- Documentazione del codice
- Guide per gli utenti
- Traduzioni

### 🎨 Design
- Miglioramenti UI/UX
- Nuovi componenti
- Accessibilità
- Responsive design

## 🏷️ Convenzioni di Commit

Utilizziamo [Conventional Commits](https://www.conventionalcommits.org/) per mantenere un history pulito:

```bash
# Formato
<tipo>[scope opzionale]: <descrizione>

# Esempi
feat: aggiunge supporto per export PDF dei risultati
fix: corregge bug nella validazione del form
docs: aggiorna README con nuove istruzioni
style: migliora spacing nei componenti card
refactor: ottimizza gestione dello stato globale
test: aggiunge test per il componente QuestionCard
chore: aggiorna dipendenze
```

### Tipi di Commit

| Tipo | Descrizione |
|------|-------------|
| `feat` | Nuova funzionalità |
| `fix` | Correzione di bug |
| `docs` | Modifiche alla documentazione |
| `style` | Modifiche al codice che non influiscono sulla logica |
| `refactor` | Refactoring del codice |
| `test` | Aggiunta o modifica di test |
| `chore` | Aggiornamenti di build, dipendenze, config |

## 🔍 Linee Guida per il Codice

### React/TypeScript
- Usa TypeScript per tutto il nuovo codice
- Componenti funzionali con hooks
- Props interfaces sempre tipizzate
- Usa `React.FC` per i componenti

### Styling
- Usa Tailwind CSS per gli stili
- Preferisci classi utility invece di CSS personalizzato
- Usa le classi personalizzate definite in `globals.css`
- Mantieni la coerenza con il design system

### Struttura File
```
components/     # Componenti riutilizzabili
pages/         # Pagine dell'applicazione
services/      # Logica di business e API
utils/         # Utility functions
types.ts       # Definizioni TypeScript
constants.ts   # Costanti dell'app
```

## 🧪 Testing

Prima di fare il commit:

```bash
# Type checking
npm run type-check

# Build del progetto
npm run build

# Lint (quando configurato)
npm run lint
```

## 📤 Processo di Pull Request

### 1. 🔍 Prima di Inviare

- [ ] Il codice è stato testato localmente
- [ ] Hai aggiornato la documentazione se necessario
- [ ] I commit seguono le convenzioni
- [ ] Il branch è aggiornato con main

### 2. 📋 Template PR

Quando crei una PR, includi:

```markdown
## 📝 Descrizione
Breve descrizione delle modifiche

## 🔧 Tipo di Modifica
- [ ] Bug fix
- [ ] Nuova funzionalità
- [ ] Breaking change
- [ ] Documentazione

## 🧪 Testing
- [ ] Testato localmente
- [ ] Aggiornati i test esistenti
- [ ] Aggiunti nuovi test

## 📷 Screenshot (se applicabile)
<!-- Aggiungi screenshot per modifiche UI -->

## ✅ Checklist
- [ ] Il codice segue le linee guida del progetto
- [ ] Ho effettuato il self-review del codice
- [ ] Ho commentato il codice complesso
- [ ] Ho aggiornato la documentazione
```

### 3. 🔄 Review Process

1. Il team revisionerà la tua PR
2. Potrebbero essere richieste modifiche
3. Una volta approvata, la PR verrà mergiata

## 🐛 Segnalazione Bug

Usa il template per gli issue:

```markdown
**🐛 Descrizione del Bug**
Descrizione chiara del problema

**🔄 Steps per Riprodurre**
1. Vai a '...'
2. Clicca su '....'
3. Vedi l'errore

**✅ Comportamento Atteso**
Cosa dovrebbe succedere

**📷 Screenshot**
Se applicabile

**🖥️ Ambiente**
- OS: [es. Windows 11]
- Browser: [es. Chrome 120]
- Versione Node: [es. 18.17.0]
```

## 💡 Richiesta Feature

```markdown
**🚀 Descrizione della Feature**
Descrizione chiara della funzionalità proposta

**🎯 Problema da Risolvere**
Quale problema risolverebbe questa feature?

**💭 Soluzione Proposta**
Come implementeresti questa funzionalità?

**🔄 Alternative Considerate**
Altre soluzioni che hai considerato?

**📋 Informazioni Aggiuntive**
Ulteriori dettagli o contesto
```

## 🌟 Riconoscimenti

Tutti i contributori verranno riconosciuti nel README e nella sezione Contributors di GitHub.

## 📞 Supporto

Hai domande? Contattaci:

- 💬 [GitHub Discussions](https://github.com/your-repo/discussions)
- 📧 Email: developers@uniguida-ai.com
- 🐛 [GitHub Issues](https://github.com/your-repo/issues)

---

**Grazie per contribuire a UniGuida AI! 🎓✨**
