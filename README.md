# 🛠️ ToolManager – Angular & Node.js alkalmazás Microsoft Lists integrációval

Ez az alkalmazás egy belső eszközkezelő felület, amely a Microsoft Lists-ben tárolt adatok alapján jeleníti meg az eszközöket. A frontend Angular és TypeScript segítségével készült, a backend Node.js alapú, és a Graph API-t használja az adatok lekérésére Microsoft 365 környezetből.

---

## ⚙️ Technológiák

### Frontend
- **Angular**
- **TypeScript**
- **HTML + CSS (SCSS)**
- **Bootstrap**

### Backend
- **Node.js**
- **Express**
- **Microsoft Graph API**
- **OAuth 2.0 (Access Token kezelés)**

---

## 🔐 Autentikáció & Jogosultság

- A backend oldalról Graph API-hívásokhoz **Microsoft Identity platformon** keresztül generált **access token** kerül felhasználásra.
- Az access tokennel a Node.js szerver autentikált Graph API kéréseket küld, így lekérdezheti vagy módosíthatja a Microsoft Lists adatait.

---

## 🗂️ Adatkezelés

- A **Microsoft Lists** egy előre definiált szerkezettel rendelkezik (pl.: eszköz neve, állapota, felelős személy, stb.)
- A backend REST API lekéri az adatokat a Microsoft Lists-ből és továbbítja az Angular frontend felé JSON formátumban.
- A frontend ezeket az adatokat táblázatos és kártyás formában jeleníti meg, interaktív szűrési és keresési lehetőségekkel.

---

## 🧪 Fő funkciók

- 🔍 Listázás: Eszközök és állapotuk megtekintése Microsoft Lists alapján
- 🔄 Frissítés: Listaadatok módosítása backend híváson keresztül
- 🔐 Token alapú hitelesített Graph API integráció
- 📊 Interaktív UI Angular frontenddel

---

## 🚀 Indítás fejlesztői környezetben

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
ng serve
```

## 🌐 Fontos tudnivalók
- A projekt futtatásához szükséges egy Microsoft Azure alkalmazásregisztráció, amely jogosult a Graph API elérésére.
- Az access tokenek megszerzése automatikusan történik backend oldalról, szükséges konfigurálni a client_id, client_secret, tenant_id értékeket.
- A Microsoft Lists URL-je és az adott lista azonosítója konfigurálható .env fájlban vagy config fájlban.
