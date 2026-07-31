# GitHub Actions Secrets

Add these secrets in your GitHub repository under Settings → Secrets and variables → Actions:

## App secrets
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY
- REDIS_URL

## Vercel deployment secrets
- VERCEL_TOKEN
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID

If your Firebase private key contains newlines, store it as a single-line value with \n escapes or use the GitHub UI multiline secret support.
