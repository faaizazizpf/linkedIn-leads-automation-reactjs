# LinkedIn Leads Automation — React UI

This repository contains the React frontend for the LinkedIn Leads Automation tool. It provides the user interface for authenticating via LinkedIn, starting campaigns, viewing and managing leads, and interacting with the API backend.

> Backend API: https://github.com/faaizazizpf/linkedIn-leads-automation-api

## Table of contents
- Features
- Prerequisites
- Environment variables
- Installation
- Running locally
- Building for production
- Connecting to the API
- Common UI flows
- Troubleshooting
- Contributing
- License

## Features
- Login with LinkedIn (starts OAuth flow via the backend)
- Dashboard showing leads and campaign status
- Create and manage campaigns
- Manual lead ingestion and bulk import
- Settings and account management

## Prerequisites
- Node.js (>= 16)
- npm or yarn
- Running API server (see backend repo)

## Environment variables
Create a `.env` in the project root with these variables:

REACT_APP_API_URL=http://localhost:4000
REACT_APP_LINKEDIN_CLIENT_ID=your_linkedin_client_id
REACT_APP_REDIRECT_URI=http://localhost:4000/api/auth/linkedin/callback
# Optional:
REACT_APP_ENV=development

Notes:
- REACT_APP_API_URL should point to the running backend API.
- REACT_APP_REDIRECT_URI needs to be a URL that the backend accepts for LinkedIn OAuth callback.

## Installation
1. Clone the repo:
   git clone https://github.com/faaizazizpf/linkedIn-leads-automation-reactjs.git
   cd linkedIn-leads-automation-reactjs

2. Install dependencies:
   npm install
   # or
   yarn install

3. Create `.env` with values above.

## Running locally
Start the dev server:
npm start
# or
yarn start

The app runs by default on http://localhost:3000.

## Build for production
npm run build
# or
yarn build

Serve the `build/` folder with a static server or integrate with your deployment pipeline.

## Connecting to the API
The UI starts the OAuth flow by redirecting the user to:
<REACT_APP_API_URL>/api/auth/linkedin
The backend will handle the OAuth handshake and redirect back to its redirect URI, then issue session tokens (JWT) or set a secure cookie. After authentication the UI can call the protected API endpoints (leads, campaigns, settings) using the returned JWT.

Example API requests:
fetch(`${process.env.REACT_APP_API_URL}/api/leads`, {
  headers: { Authorization: `Bearer ${token}` }
})

## Common UI flows
- Login:
  1. User clicks "Sign in with LinkedIn"
  2. Browser opens backend `/api/auth/linkedin`
  3. After LinkedIn consent and backend callback, user is authorized and returned to the UI

- View leads:
  - UI calls `/api/leads` to fetch paginated leads.

- Create campaign:
  - UI POSTs to `/api/campaigns` with campaign details.

## Troubleshooting
- Blank page: check console for runtime errors and ensure REACT_APP_API_URL is set.
- OAuth issues: ensure the LinkedIn app has the correct redirect URI configured and the backend LINKEDIN_CLIENT_ID matches REACT_APP_LINKEDIN_CLIENT_ID if needed.
- CORS: backend must allow the frontend origin (e.g., http://localhost:3000) or set proper CORS headers.

## Contributing
- Open an issue to discuss major changes.
- Branch from `main` and open a PR when ready.
- Run linting/tests in CI before merging.

## License
Specify your license here (e.g., MIT). Update LICENSE file accordingly.
