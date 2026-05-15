<![CDATA[<div align="center">

# 🏥 R3AIA – رعاية

### منصة الرعاية الصحية الخيرية | Charitable Healthcare Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

**R3AIA (رعاية)** is a charitable healthcare platform built to provide free medical services to underserved communities in Egypt. The platform connects patients with volunteer doctors, facilitates medicine delivery, and enables charitable donations — all through a modern, accessible web interface.

<br/>

[🌐 Live Demo](#) · [📖 API Docs](#) · [🐛 Report Bug](https://github.com/Youssef7assan/r3aia-frontend/issues)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🩺 **Free Medical Consultations** | Patients can book discounted or free consultations with volunteer doctors |
| 💊 **Medicine Delivery** | Request and track medicine deliveries to your doorstep |
| 📋 **Prescription Management** | Upload and manage medical prescriptions digitally |
| 🤝 **Volunteer System** | Volunteer as a delivery person or medical professional |
| 💰 **Donations** | Accept and manage charitable donations for healthcare |
| 🤖 **AI Chatbot** | Integrated chatbot for patient assistance and guidance |
| 🎫 **Support Tickets** | Built-in ticketing system for user support |
| 🔔 **Notifications** | Real-time notification system for updates |
| 👨‍⚕️ **Doctor Profiles** | Browse doctors by specialty, view profiles and book appointments |
| 🛡️ **Role-Based Dashboards** | Separate dashboards for Admin, Doctor, Patient, Pharmacist & Volunteer |

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/)
- **Smooth Scroll:** [Lenis](https://lenis.darkroom.engineering/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) + [Lucide Icons](https://lucide.dev/)
- **Particles:** [tsParticles](https://particles.js.org/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Notifications:** [React Toastify](https://fkhadra.github.io/react-toastify/)
- **Fonts:** Cairo & Tajawal (Arabic-optimized)

### Backend (Separate Repository)
- **Runtime:** ASP.NET Core (.NET 9)
- **Database:** SQL Server
- **Auth:** JWT + ASP.NET Identity
- **ORM:** Entity Framework Core 9

---

## 📁 Project Structure

```
front/
├── app/                        # Next.js App Router pages
│   ├── about/                  # About page
│   ├── admin/                  # Admin dashboard
│   ├── api/chat/               # AI Chatbot API route
│   ├── contact/                # Contact page
│   ├── doctor/                 # Doctor dashboard
│   ├── doctors/                # Browse & view doctors
│   ├── login/                  # Login page
│   ├── register/               # Registration page
│   ├── patient/                # Patient dashboard
│   ├── pharmacist/             # Pharmacist dashboard
│   ├── volunteer/              # Volunteer dashboard & registration
│   ├── services/               # Services page
│   ├── globals.css             # Global styles
│   ├── layout.js               # Root layout (RTL, Arabic fonts)
│   └── page.js                 # Landing page
│
├── components/
│   ├── auth/                   # Registration steps (multi-step form)
│   ├── dashboard/              # Dashboard components (ChatBot, Tickets, Profile...)
│   ├── layout/                 # Navbar, Footer, Preloader, ScrollToTop
│   ├── providers/              # Lenis smooth scroll provider
│   ├── sections/               # Landing page sections (Hero, CTA, FAQ...)
│   └── ui/                     # Reusable UI components (Particles, Aceternity)
│
├── hooks/                      # Custom React hooks (useGsap)
├── lib/                        # Utilities (axios config, JWT helper)
├── assets/images/              # Static images (3D illustrations)
└── public/                     # Public assets (logo, icons)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Youssef7assan/r3aia-frontend.git

# 2. Navigate to the project
cd r3aia-frontend

# 3. Install dependencies
npm install

# 4. Create environment file
cp .env.example .env.local
# Then add your API keys to .env.local

# 5. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server on `localhost:3000` |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🎨 Design Highlights

- 🌙 **Dark Theme** — Modern dark UI with glassmorphism effects
- 🇪🇬 **RTL Support** — Full right-to-left layout for Arabic content
- ✨ **Micro-Animations** — Smooth transitions powered by Framer Motion & GSAP
- 📱 **Fully Responsive** — Optimized for all screen sizes
- 🎯 **Particle Effects** — Interactive background particles on the landing page
- 🔤 **Arabic Typography** — Cairo & Tajawal fonts for optimal readability

---

## 👥 User Roles

| Role | Access |
|---|---|
| **Patient** | Book consultations, request medicines, donate, chat with AI |
| **Doctor** | Manage appointments, view patient requests |
| **Pharmacist** | Manage medicine inventory and prescriptions |
| **Volunteer** | Accept and complete delivery tasks |
| **Admin** | Full system management, user approval, analytics |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ for Egypt's healthcare community**

رعاية — لأن الصحة حق للجميع

</div>
]]>
