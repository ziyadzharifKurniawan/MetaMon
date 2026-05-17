<div align="center">

<img width="465" height="375" alt="2-removebg-preview-removebg-preview" src="https://github.com/user-attachments/assets/683de63e-c998-48ed-9624-c64826e7f6e9" />

# MetaMon

By:
2406369053	Ziyadzharif Alfarabi Kurniawan
2406450390	Lando Akmalkane Airell Muhammad
2406450352	Evandra Rasya Fadhillah
2406450466	Raul Fadila Bagus Sumaryada

### Competitive Pokémon Team Builder

Modern Pokémon teambuilder engineered for competitive VGC play.

Built with Next.js, TypeScript, TailwindCSS, and Neon PostgreSQL.

<br />

<img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/Neon-00E699?style=for-the-badge" />
<img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />

<br />
<br />

<img src="https://img.shields.io/badge/Normal-A8A77A?style=for-the-badge" /> <img src="https://img.shields.io/badge/Fire-EE8130?style=for-the-badge" /> <img src="https://img.shields.io/badge/Water-6390F0?style=for-the-badge" /> <img src="https://img.shields.io/badge/Electric-F7D02C?style=for-the-badge&logoColor=black" /> <img src="https://img.shields.io/badge/Grass-7AC74C?style=for-the-badge" /> <img src="https://img.shields.io/badge/Ice-96D9D6?style=for-the-badge&logoColor=black" /> <img src="https://img.shields.io/badge/Fighting-C22E28?style=for-the-badge" /> <img src="https://img.shields.io/badge/Poison-A33EA1?style=for-the-badge" /> <img src="https://img.shields.io/badge/Ground-E2BF65?style=for-the-badge&logoColor=black" /> <img src="https://img.shields.io/badge/Flying-A98FF3?style=for-the-badge" /> <img src="https://img.shields.io/badge/Psychic-F95587?style=for-the-badge" /> <img src="https://img.shields.io/badge/Bug-A6B91A?style=for-the-badge" /> <img src="https://img.shields.io/badge/Rock-B6A136?style=for-the-badge" /> <img src="https://img.shields.io/badge/Ghost-735797?style=for-the-badge" /> <img src="https://img.shields.io/badge/Dragon-6F35FC?style=for-the-badge" /> <img src="https://img.shields.io/badge/Dark-705746?style=for-the-badge" /> <img src="https://img.shields.io/badge/Steel-B7B7CE?style=for-the-badge&logoColor=black" /> <img src="https://img.shields.io/badge/Fairy-D685AD?style=for-the-badge" />

<br />
<br />

<img src="./public/screenshots/banner.png" />

</div>

---

## Overview

MetaMon is a modern competitive Pokémon teambuilder inspired by Pokémon Showdown and Pokémon Champions.  
The platform focuses on advanced team construction, fast search systems, and competitive set engineering for high-level VGC formats.

---

## Features

- Full Pokémon database integration
- Mega Evolutions and alternate forms
- Competitive VGC teambuilder workflow
- Real-time Pokémon search
- Dynamic API architecture
- Relational PostgreSQL backend
- Modern esports-inspired interface
- Team slot management
- Move, ability, and item systems
- Stat visualization

---

## Screenshots

### Builder Main Interface

<img width="2867" height="1601" alt="image" src="https://github.com/user-attachments/assets/a98fc4ec-615d-41e0-89c5-983c89b11364" />

---

### Pokémon Moves Editor

<img width="2365" height="1428" alt="image" src="https://github.com/user-attachments/assets/8181a314-1933-49a7-8810-3856f8c04ac0" />

---

### Pokémon Items Editor

<img width="2879" height="1676" alt="image" src="https://github.com/user-attachments/assets/7e557525-c96f-4f89-9fa6-1d2f1f50b46b" />

---

### Pokémon Stats Editor

<img width="1876" height="1023" alt="image" src="https://github.com/user-attachments/assets/9fa37947-f20f-407f-86d5-bdf1c3941bd9" />

---

### Team Overview

<img width="462" height="778" alt="image" src="https://github.com/user-attachments/assets/8480df5b-b2b5-4806-b93b-b555af9d1208" />

---

### Team Verification

<img width="875" height="401" alt="image" src="https://github.com/user-attachments/assets/dc23b7e1-c862-446c-b5c1-d220532be5db" />

---

## Technology Stack

| Technology | Usage |
|---|---|
| Next.js App Router | Frontend and API |
| TypeScript | Fullstack typing |
| TailwindCSS | Styling |
| Neon PostgreSQL | Database hosting |
| PostgreSQL | Relational database |
| Vercel | Deployment |

---

## Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/metamon.git
cd metamon
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create:

```env
.env.local
```

Add:

```env
DATABASE_URL=your_neon_database_url
```

### Start Development Server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## Project Structure

```bash
src/
├── app/
│   ├── api/
│   ├── builder/
│   └── page.tsx
│
├── components/
├── lib/
└── types/
```

---

## Roadmap

- Team builder system
- EV and IV editor
- Nature selection
- Move legality validation
- Team export/import
- Damage calculator
- Team sharing
- Usage statistics

---

## Disclaimer

MetaMon is an independent fan-made project and is not affiliated with, endorsed by, or sponsored by Nintendo, Game Freak, Creatures Inc., The Pokémon Company, or Pokémon Showdown.

All Pokémon names, sprites, artwork, moves, abilities, items, and related media are property of their respective owners.

This project is intended for educational and non-commercial purposes only.

---

## License

Licensed under the [MIT License](./LICENSE).
