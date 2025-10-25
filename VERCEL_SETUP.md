# Vercel Deployment Setup

## Required Environment Variables

Add these environment variables in your Vercel dashboard:

```
NEXTAUTH_URL=https://tapper-one.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
```

## Optional OAuth Providers

If you want to enable Google/GitHub login:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Steps

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add the required variables above
4. Redeploy your project

## Demo Mode

The app works in demo mode without OAuth providers - users can sign in with any email/password combination.
