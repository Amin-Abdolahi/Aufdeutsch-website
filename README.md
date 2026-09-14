# AUF Deutsch 🇩🇪

> A modern German language learning platform for Persian-speaking learners.

**AUF Deutsch** is a real-world German language education website created for online German language training. The platform presents German courses, introduces the instructors, explains the learning approach, and provides a way for learners to get in touch and request a consultation.

## 🌐 Website

**Live:** https://aufdeutsch.ir

## ✨ Highlights

- German language courses from **A1 to C1**
- Course and level presentation
- Instructor introduction
- Personalized learning approach
- Free consultation call-to-action
- Contact section
- Pricing section
- Blog section
- Student testimonials
- Responsive, mobile-first interface
- Full **trilingual** interface: Persian (`/fa`), German (`/de`), English (`/en`)
- Full **RTL** support for Persian content
- Custom visual identity inspired by notebooks, passports, travel, and language learning
- Structured pages suitable for future course registration and online services

## 🧭 Pages

| Route | Description |
|---|---|
| `/` | Landing page and introduction to AUF Deutsch |
| `/about` | About the instructors and teaching approach |
| `/courses` | German courses and language levels |
| `/pricing` | Course pricing and packages |
| `/contact` | Contact and consultation information |
| `/blog` | German-learning articles and educational content |

## 🛠️ Tech Stack

- **Next.js 16**
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Vazirmatn**
- **Git**
- **GitHub**
- **Vercel** for deployment

## 🎨 Design System

The visual language of AUF Deutsch is based on a warm editorial/notebook aesthetic combined with travel and passport-inspired elements.

### Main colors

| Color | Hex |
|---|---|
| Paper | `#F3ECDD` |
| Navy | `#1B2A44` |
| Gold | `#B08D3E` |
| Red | `#B23A2E` |

### Typography

- **Vazirmatn** — Persian / RTL content
- **Space Mono** — English and selected display text

The interface is designed primarily for Persian-speaking users, so RTL behavior is considered throughout the layout and content structure.

## 📁 Project Structure

```text
AUF Deutsch
├── app/
│   ├── [locale]/          # fa | de | en pages
│   │   ├── about/
│   │   ├── contact/
│   │   ├── courses/
│   │   ├── pricing/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   ├── contact/
│   │   └── locale/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── layout/
│   └── ui/
│
├── lib/
│   └── i18n.ts            # dictionaries + locale helpers
│
├── public/
│   ├── robots.txt
│   └── sitemap.xml
│
├── proxy.ts               # locale redirect (Next.js 16)
├── package.json
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js and npm installed.

### Installation

Clone the repository:

```bash
git clone https://github.com/Amin-Abdolahi/Aufdeutsch-website.git
cd Aufdeutsch-website
```

Install dependencies:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Production build

```bash
npm run build
```

To start the production server after building:

```bash
npm start
```

## 🔧 Development Workflow

The project follows a component-based Next.js structure.

Typical workflow:

```text
Idea / Requirement
       ↓
Page or component design
       ↓
Implementation
       ↓
Local development
       ↓
Testing & debugging
       ↓
Git commit
       ↓
GitHub
       ↓
Deployment
```

## 🤖 AI-Assisted Development

This project was developed with the help of AI-assisted development tools.

AI was used extensively during implementation, including code generation, exploration of implementation approaches, debugging assistance, and iteration.

The project owner was responsible for the product idea and requirements, design direction, content decisions, reviewing the generated implementation, testing the website, debugging issues, and making final development decisions.

This project is therefore best described as an **AI-assisted real-world web development project**, rather than a claim of having written every line of code manually.

## 📚 What This Project Demonstrates

AUF Deutsch represents practical work across several parts of the web-development process:

- Translating a real business idea into a web product
- Designing a multi-page website
- Building reusable React components
- Working with Next.js App Router
- Using TypeScript in a real project
- Styling with Tailwind CSS
- Building RTL interfaces
- Handling responsive layouts
- Organizing project structure
- Working with Git and GitHub
- Reviewing and debugging AI-generated code
- Preparing a website for production deployment
- Thinking about UX, conversion, trust, and user experience

## 🔮 Roadmap

Possible future improvements:

- [ ] Real course registration
- [ ] Free consultation booking system
- [ ] Online payment
- [ ] Student dashboard
- [ ] Placement / level test
- [ ] Interactive German-learning exercises
- [ ] Blog content management
- [ ] Better SEO
- [ ] Analytics
- [ ] Newsletter
- [ ] Automated student communication

## 🎯 Project Goal

The long-term goal of AUF Deutsch is to create a practical online environment for learning German, starting with personalized language training and gradually adding digital learning tools and services.

The website is intentionally being developed as a real product that can evolve according to actual learner needs.

## 👨‍💻 Author

**Amin Abdollahi**

German Language Teacher & Web Development Learner

- GitHub: https://github.com/Amin-Abdolahi
- Project: https://github.com/Amin-Abdolahi/Aufdeutsch-website

## 📄 License

This project is a private educational/business project. The source code, design, branding, and content are not licensed for unrestricted reuse or redistribution without permission.
