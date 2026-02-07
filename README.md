# Wishly

![GitHub Banner](https://i.imgur.com/0dxvo37.png)

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" />
  <img src="https://img.shields.io/badge/Puppeteer-40B5A4?style=for-the-badge&logo=puppeteer&logoColor=white" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" />
</p>

A full-stack web application to create and share immersive, personalized surprise pages for life's special moments.

## Features

- **Surprise Categories**: Create meaningful pages for **Birthdays** and **Valentines**.
- **Dynamic Templates**:
  - **Card Stack**: A beautiful stacking card interaction for multi-message surprises.
  - **Sticky Pixel**: A retro-style, scroll-triggered immersive experience.
  - **Simple Valentine**: A playful "Will you be my Valentine?" interactive flow.
- **AI-Powered Content**: Integrated with **Google Gemini (gemini-2.5-flash-lite)** to generate heartwarming titles and messages based on user prompts.
- **Automated Previews**: Uses **Puppeteer** to capture high-quality screenshots of shared pages, automatically uploaded to **Cloudinary** for social sharing.
- **Smart Slugs**: Clean, readable URLs (e.g., `/birthday/firstname-lastname-suffix`) instead of messy IDs.
- **Music Playback**: Integrated background music options with preview functionality in the creator.
- **Secure Authentication**: Built with **Clerk** for secure user management and dashboard access.
- **Immersive Viewing**: Full-screen, ad-free experience for the recipient.

## Project Structure

```text
hbdgen/
├── backend/
│   ├── controllers/       # Business logic for AI, Birthday, and Valentine cards
│   ├── models/            # Mongoose schemas for data persistence
│   ├── routes/            # Express API endpoints
│   ├── utils/             # Helper utilities (Puppeteer/Cloudinary integration)
│   ├── index.js           # Server entry point
│   └── package.json
└── frontend/
    ├── public/            # Static assets (logos, music files)
    ├── src/
    │   ├── components/    # UI components and templates
    │   │   ├── templates/ # Card designs (CardStack, StickyPixel, etc.)
    │   │   └── Modal.tsx  # Reusable custom modal for AI prompts
    │   ├── services/      # Axios API service definitions
    │   ├── App.tsx        # Routing and layout
    │   └── main.tsx       # Frontend entry point
    ├── vite.config.ts
    └── package.json
```

## Tech Stack

### Frontend

- **Vite + React + TypeScript**
- **Motion (framer-motion)** for smooth animations
- **Tailwind CSS** for modern styling
- **Clerk SDK** for authentication
- **Axios** for API integration

### Backend

- **Node.js & Express**
- **MongoDB + Mongoose** for database management
- **@clerk/express** for secure middleware
- **Puppeteer** for dynamic screenshot generation
- **Google Generative AI (Gemini)** for content creation

## Environment Variables

### Backend (`/backend/.env`)

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_google_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
FRONTEND_URL=your_frontend_url
```

### Frontend (`/frontend/.env`)

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=your_backend_api_url
```

## Usage

1. **Sign Up**: Create an account to start building your surprises.
2. **Create**: Pick a category (Birthday or Valentine) and choose a template style.
3. **Personalize**: Fill in the recipient's name or use **AI Generate** to craft the perfect message.
4. **Music**: Select a background track that fits the vibe (and preview it live).
5. **Generate**: Create your page; the system will auto-generate a screenshot preview.
6. **Share**: Send the link to your special someone and wait for their reaction!
