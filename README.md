# Bracket Builder Frontend

A SvelteKit frontend for the Bracket Builder application. Create and manage tournament-style brackets with a beautiful, intuitive interface.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Make sure the backend is running:**
   - The frontend expects the backend API at `http://localhost:3000`
   - If your backend is on a different port, update `src/lib/api.ts` with the correct URL

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - The app will be available at `http://localhost:5173` (or the port shown in the terminal)

## Features

- **Home Page**: View all created brackets
- **Create Bracket**: Simple form to create new brackets with any number of items
- **Bracket View**: Visual bracket display with interactive match voting
- **Real-time Updates**: See bracket progress as you select winners

## Project Structure

```
src/
  lib/
    api.ts          # API client functions
  routes/
    +page.svelte    # Home page (bracket list)
    create/
      +page.svelte  # Create bracket page
    bracket/
      [id]/
        +page.svelte # Individual bracket view
  app.css           # Global styles
  app.html          # HTML template
```

## Building for Production

```bash
npm run build
npm run preview
```

