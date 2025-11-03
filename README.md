# Image Gallery Frontend

A modern image gallery application built with React and Vite, featuring image upload capabilities, gallery view, and user authentication.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- npm (comes with Node.js) or [yarn](https://yarnpkg.com/)

## Dependencies

This project uses several key dependencies:
- React 19
- React Router DOM for navigation
- Axios for API requests
- React Dropzone for file uploads
- React Toastify for notifications

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/swetaswami378/image-gallery-frontend.git
   cd image-gallery-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or if you use yarn
   yarn
   ```

## Available Scripts

In the project directory, you can run:

### Development Server

```bash
npm run dev
# or
yarn dev
```

This starts the development server. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### Build for Production

```bash
npm run build
# or
yarn build
```

Builds the app for production to the `dist` folder.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

Preview the production build locally.

### Linting

```bash
npm run lint
# or
yarn lint
```

Run ESLint to check for code quality issues.

## Project Structure

```
src/
  ├── api/          # API integration
  ├── auth/         # Authentication related components
  ├── components/   # Reusable components
  ├── constants/    # Constants and utility functions
  ├── pages/        # Page components
  └── styles/       # CSS styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request