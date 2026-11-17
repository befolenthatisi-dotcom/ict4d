# AgriVision

AgriVision is a responsive Lesotho agriculture and cooperative platform built with React, Vite, Vercel serverless functions, and MongoDB Atlas.

## Live deployment

The production site is available at [agriconnect-lesotho.vercel.app](https://agriconnect-lesotho.vercel.app). The frontend and Open-Meteo weather endpoint are deployed; farmer accounts and cooperative data require the production environment variables below before they can be used.

## What is connected

- Farmer email/password registration and farmer sign-in require an `@gmail.com` address. Administrator sign-in and bootstrap can use other valid email domains. Authentication uses MongoDB accounts, scrypt password hashes, rate limits, and an eight-hour signed `HttpOnly`, `SameSite=Lax` session cookie.
- Public navigation provides separate farmer and administrator sign-in options. The login API checks the requested audience against the stored role; public registration always creates a farmer account.
- Farmer account and animal records, cooperative membership, produce listings, and announcements are stored in MongoDB. Farmers may change or remove their own records; cooperative administrators may publish announcements and suspend farmer accounts.
- Initial administrator creation is a separate, one-time bootstrap action protected by `ADMIN_BOOTSTRAP_KEY`. It cannot be selected in public farmer registration.
- The weather dashboard requests a live seven-day district forecast from Open-Meteo. Weather data is not an official severe-weather warning service.
- The Market prices page uses the WFP Price Database for Lesotho, sourced from the Lesotho Bureau of Statistics via FAO GIEWS and distributed by HDX. It shows actual retail observations from the last 90 days in Lesotho maloti; retail prices are not farm-gate offers. The source is updated periodically, not live.

## Required Vercel environment variables

Add these as **encrypted Production environment variables** in the AgriVision Vercel project's Settings. Never commit actual values or paste database credentials into source code. The current production deployment still needs `MONGODB_URI` and `ADMIN_BOOTSTRAP_KEY`; the configured session secret alone cannot enable persistent sign-in without the database.

| Variable | Required value |
| --- | --- |
| `MONGODB_URI` | A MongoDB Atlas connection string. Restrict its database user to the application's database and configure Atlas network access for the deployment. |
| `MONGODB_DATABASE` | `agriconnect` (optional; this is the default). |
| `SESSION_SECRET` | A cryptographically random secret with at least 32 characters. |
| `ADMIN_BOOTSTRAP_KEY` | A separate cryptographically random secret with at least 32 characters, used once to create the initial administrator. |

Use the **Environment Variables** page in Vercel; do not enter these values in a browser URL. Redeploy after setting or changing environment variables. Once the first admin is created, remove `ADMIN_BOOTSTRAP_KEY` from Vercel.

Open the deployed app, choose **Sign in**, then **Initial cooperative administrator setup**. Enter the one-time setup key and the administrator's credentials. The bootstrap endpoint accepts only the first administrator; all further administrators must be provisioned by an existing account owner outside public signup.

Farmers create their own accounts using **Sign in → Create a farmer account** and must use an `@gmail.com` address. Public sign-up always creates a farmer role; the submitted request cannot assign itself administrator privileges.

## Local development

1. Copy `.env.example` to `.env` and set your MongoDB connection string and development-only random secrets.
2. Run `npm install`.
3. In one terminal run `npm run dev:api`.
4. In another terminal run `npm run dev`.

Vite proxies `/api/*` to the local API process on port 3001. `npm run build` creates the production frontend.

## Data-source limitations

Weather is currently live through Open-Meteo. Prices intentionally remain sample-only until a verified agricultural source is identified. Email verification, password recovery, outbound email notifications, and an official severe-weather alert feed require additional provider configuration and are not represented as working features.
