# Notes Frontend (Qwik)

A minimalistic, light-themed notes app built with Qwik + QwikCity. It includes:
- Header with search, layout toggle, and New Note button
- Sidebar with All Notes, inferred Tags, and placeholder Folders
- Main content area with grid/list Notes view
- Modal editor for creating and editing notes
- Ready to call the backend `notes_database` via REST

## Running

- Development: npm start
- Build: npm run build
- Preview: npm run preview

## API Configuration

Set the base URL for the backend REST API using the PUBLIC_NOTES_API environment variable at build/runtime:

- Vite/Qwik convention: define it as an env exposed to the client (e.g. via your hosting/platform config).
- Example values:
  - PUBLIC_NOTES_API=/api
  - PUBLIC_NOTES_API=https://your-notes-backend.example.com

The app will fallback to "/api" if the environment variable is not provided.

## REST Endpoints Expected

- GET    {PUBLIC_NOTES_API}/notes?search=&tag=&folder=
- GET    {PUBLIC_NOTES_API}/notes/:id
- POST   {PUBLIC_NOTES_API}/notes           (body: { title, content, tags? })
- PUT    {PUBLIC_NOTES_API}/notes/:id       (body: { title, content, tags? })
- DELETE {PUBLIC_NOTES_API}/notes/:id
