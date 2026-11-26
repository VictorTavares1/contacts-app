# Contacts App

Vue.js web application to manage contacts, built for the Alfasoft technical exercise.

## Features

- **Contact list** (landing page) showing each contact as a card with picture and details — public.
- **Add contact** page with validation.
- **Edit contact**, reusing the add contact view.
- **Delete contact** with a confirmation modal.
- **Contact details** page showing all fields.
- **Authentication** (additional requirement): the list is public; adding, editing, deleting and viewing details require login.

### Validation rules

- Name: more than 5 characters.
- Contact: exactly 9 digits.
- Email: valid email format.
- Picture: required.
- Contact and email must be unique across all contacts.

## Tech stack

- Vue 3 (Composition API, `<script setup>`)
- Vue Router 4
- Vite
- localStorage for persistence

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Build

```bash
npm run build
```

The compiled app is generated in `dist/`. Its contents are meant to be copied into the server's `html` folder — no Node.js process is needed to serve it.

## Login (demo)

- Username: `admin`
- Password: `admin123`

## Technical decisions

- **Hash history routing** (`/#/contacts/1`): the app is deployed as static files, so deep links and page refreshes work without server rewrite rules.
- **Relative base path** (`base: './'`): the build works from any folder on the server.
- **Service layer** (`src/services/contacts.js`): the only module that touches localStorage, so storage could be replaced by an API without changing the views.
- **Image resizing** (`src/utils/image.js`): pictures are downscaled with a native `<canvas>` before saving, to stay within localStorage's ~5MB limit.
- **Native `<dialog>`** for the delete confirmation modal — no UI library was used for the features required by the exercise.
- **Simulated authentication**: there is no backend, so login is handled client-side with demo credentials. It demonstrates route protection with Vue Router guards, but it is not real security — in production, authentication must be validated by a server.

## Deployment note

During the exercise, the provided environment returned `403 Forbidden` (website and CloudCMD) and the SFTP credentials were rejected. This was reported by email. The application was developed and tested locally, and is ready to be deployed by copying the contents of `dist/` into the `html` folder.