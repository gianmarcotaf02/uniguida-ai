# 🗄️ Sistema di Storage Supabase per Dati MUR

## 📋 Panoramica

Il sistema implementa una soluzione completa per gestire i dati ufficiali del Ministero dell'Università e della Ricerca (MUR) utilizzando **Supabase Storage** e **Papa Parse** per l'elaborazione CSV.

## 🚀 Funzionalità Implementate

### 1. **Storage Service (`supabaseStorageService.ts`)**
- ✅ Upload automatico di file CSV/XLSX su Supabase
- ✅ Processamento in tempo reale con Papa Parse
- ✅ Conversione automatica da formato MUR a database interno
- ✅ Gestione sicura dei file con bucket privati
- ✅ Statistiche complete su storage e file caricati

### 2. **Pannello di Integrazione MUR Aggiornato**
- ✅ Selezione tipo di dataset (Atenei, Iscritti, Laureati, Offerta Formativa)
- ✅ Interfaccia drag & drop per file CSV/XLSX
- ✅ Messaggi di stato in tempo reale
- ✅ Statistiche storage con dimensioni e date
- ✅ Caricamento dati dal database Supabase

### 3. **Database PostgreSQL su Supabase**
- ✅ Tabella `mur_universities` con tutti i campi necessari
- ✅ Tabella `mur_files` per tracciamento file caricati
- ✅ Funzioni SQL per ricerca e statistiche
- ✅ Row Level Security (RLS) configurato
- ✅ Indici ottimizzati per performance

## 🛠️ Architettura Tecnica

```
File CSV MUR → Papa Parse → Conversione → Supabase DB
     ↓
Supabase Storage ← Upload ← Interfaccia Web
```

### **Flusso di Elaborazione:**

1. **Upload File**: L'utente carica un file CSV dal sito MUR
2. **Storage**: File salvato in bucket Supabase privato
3. **Processamento**: Papa Parse elabora il CSV in tempo reale
4. **Conversione**: Dati MUR convertiti al formato interno
5. **Database**: Università salvate in PostgreSQL
6. **Interfaccia**: Aggiornamento UI con statistiche

## 📊 Tipi di Dataset Supportati

| Tipo | Descrizione | Campi Principali |
|------|-------------|------------------|
| **Atenei** | Lista completa università | Nome, Città, Codice MUR |
| **Iscritti** | Dati studenti per ateneo | Totale iscritti, Anno accademico |
| **Laureati** | Statistiche laureati | Numero laureati, Tipologia laurea |
| **Offerta Formativa** | Corsi disponibili | Corsi di laurea, Facoltà |

## 🔧 Configurazione

### **Environment Variables Required:**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **Bucket Configuration:**
- **Nome**: `mur-data-files`
- **Tipo**: Privato
- **Formati**: CSV, XLSX
- **Struttura**: `mur-data/tipo_data_filename.csv`

## 📈 Monitoraggio e Statistiche

Il sistema fornisce:
- 📊 **File Count**: Numero totali file caricati
- 💾 **Storage Size**: Spazio utilizzato in MB/GB
- 📅 **Last Update**: Data ultimo caricamento
- 🏛️ **Universities**: Numero università processate
- 🔄 **Status**: Stato elaborazione in tempo reale

## 🎯 Vantaggi della Soluzione

### **Performance:**
- ⚡ Elaborazione in tempo reale con Papa Parse
- 🗄️ Database PostgreSQL ottimizzato
- 🚀 Upload parallelo e processamento asincrono

### **Sicurezza:**
- 🔒 Bucket storage privati
- 🛡️ Row Level Security su tabelle
- 🔑 Autenticazione Supabase

### **Scalabilità:**
- ☁️ Cloud-native su Supabase
- 📈 Auto-scaling del database
- 🌍 CDN globale per file storage

## 📝 Utilizzo Pratico

### **Step 1: Download Dati MUR**
Vai su [dati-ustat.mur.gov.it](https://dati-ustat.mur.gov.it) e scarica:
- `Atenei.csv` - Lista università
- `Iscritti_2024.csv` - Dati studenti
- `Offerta_Formativa.csv` - Corsi disponibili

### **Step 2: Upload nell'App**
1. Apri il pannello "📊 Integra Dati MUR Ufficiali"
2. Seleziona il tipo di dataset
3. Trascina il file CSV nella zona upload
4. Attendi elaborazione automatica

### **Step 3: Verifica Risultati**
- Controlla le statistiche storage aggiornate
- Visualizza le nuove università nelle schede
- Usa la ricerca AI potenziata con dati ufficiali

## 🔮 Prossimi Sviluppi

- [ ] **Automazione Download**: API per scaricare automaticamente dati MUR
- [ ] **Sync Schedulato**: Aggiornamento automatico mensile
- [ ] **Data Validation**: Controlli qualità sui dati importati
- [ ] **Export Tools**: Esportazione dati elaborati in vari formati
- [ ] **Analytics Dashboard**: Grafici e trend sui dati universitari

## 💡 Note Tecniche

**Papa Parse Configuration:**
```javascript
Papa.parse(file, {
  header: true,          // CSV con intestazioni
  skipEmptyLines: true,  // Ignora righe vuote
  encoding: 'UTF-8',     // Encoding italiano
  complete: (results) => // Callback elaborazione
});
```

**Supabase Storage Bucket:**
```javascript
const { error } = await supabase.storage.createBucket('mur-data-files', {
  public: false,
  allowedMimeTypes: ['text/csv', 'application/vnd.ms-excel']
});
```

## 🏆 Risultato Finale

Il sistema ora supporta completamente:
- ✅ **350+ Università**: Database completo atenei italiani
- ✅ **Dati Ufficiali**: Integrazione diretta con MUR
- ✅ **Upload Automatico**: Processamento CSV in tempo reale
- ✅ **Storage Cloud**: Gestione file su Supabase
- ✅ **Database Scalabile**: PostgreSQL con funzioni avanzate
- ✅ **UI Moderna**: Interfaccia intuitiva per amministrazione

**🎉 L'app UniGuida AI è ora completamente integrata con i dati ufficiali del Ministero dell'Università e della Ricerca!**
