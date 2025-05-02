# Happy Birthday Generator (hbdgen)

A full-stack web application to create and share personalized birthday pages for your friends and family.

## Features

- **Create Custom Birthday Pages**: Design personalized birthday pages with different themes, styles, and customization options.
- **Multiple Themes**: Choose from pink, blue, purple, gold, or rainbow themes.
- **Animation Styles**: Add balloons or confetti animations to make the birthday page more festive.
- **Photo Upload**: Include a personal photo of the birthday person.
- **Background Music**: Option to add birthday music to enhance the celebration.
- **Shareable Links**: Generate unique URLs to share with the birthday person and others.
- **Management Dashboard**: Create, edit, and delete birthday pages from a simple dashboard.

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- FontAwesome and React Icons for icons

### Backend
- Node.js and Express
- MongoDB with Mongoose for data storage
- Multer for file uploads

## Project Structure

```
/
├── backend/               # Node.js/Express backend
│   ├── controllers/       # Request handlers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── uploads/           # Photo uploads storage
│
└── frontend/              # React/TypeScript frontend
    ├── public/            # Static assets
    └── src/
        ├── components/    # React components
        ├── services/      # API services
        └── assets/        # Images and other assets
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/happybirthday.git
   cd happybirthday
   ```

2. Install backend dependencies
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend development server
   ```
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Navigate to the home page
2. Click "Create a Birthday Page" to go to the management page
3. Fill out the form with the birthday person's details
4. Customize the theme, style, and add optional elements
5. Submit the form to create the birthday page
6. Share the generated link with friends and family
