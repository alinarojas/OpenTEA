# 🐿️ OpenTEA

**The Open Source Directory for Neurodiversity Tools**

OpenTEA is a community-driven platform dedicated to curating, rating and categorizing applications that assist individuals with Autism Spectrum Disorder (ASD/TEA) and other neurodivergent conditions.

Our goal is to help families, therapists and users find the right digital tools by focusing on accessibility metrics like sensory load, cognitive load and ease of use.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)  ![License](https://img.shields.io/badge/License-MIT-yellow) [![Ko-Fi](https://img.shields.io/badge/Ko--fi-F16061?style=flat&logo=ko-fi&logoColor=white)](https://ko-fi.com/opentea)

## 🚀 Tech stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Database:** [Supabase](https://supabase.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Font Awesome](https://fontawesome.com/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Deployment:** [Vercel](https://vercel.com/)
- **Language:** TypeScript

## ✨ Features

- **Specialized categorization:** AAC (Augmentative and Alternative Communication), Routines, Social Skills and more
- **Accessibility ratings:** Unique rating system for Ease of Use, Cognitive Load and Sensory Load
- **Multilingual support:** Native support for English and Spanish (Expandable)
- **Advanced filtering:** Filter by price (Free/Paid), platform (iOS/Android) and specific needs

## 🛠️ Getting started

### Prerequisites

- Node.js 20+
- A Supabase project (Free tier works perfectly)

### 1. Clone the repository

```bash
git clone https://github.com/alinarojas/opentea.git
cd opentea
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment variables

Create a `.env` file in the root directory and add your Supabase credentials. You can find these in your Supabase Project Settings -> API.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Database setup

To run this project locally, you need the database schema.

1. Go to your Supabase SQL Editor
2. Run the initialization scripts found in `/src/lib/schema.sql` to create the tables and policies

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.


## 🤝 Contributing

Any contributions you make are **greatly appreciated**.

1. **Fork the project**
2. **Create your feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a pull request**

### Adding new apps

Currently, apps are added via the database. If you want to suggest an app, please open an Issue with the "App Request" label.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Built with ❤️ for the neurodivergent community.*
