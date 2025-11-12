# Environment Variables Setup Guide

## The Error You're Seeing

The error occurs because your environment variables are not being loaded. The application is looking for:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`

But these are not found in your environment.

## How to Fix This

### Step 1: Create Environment File

Create a file called `.env.local` in your project root (same level as `package.json`) with the following content:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_api_key_here
```

### Step 2: Get Your Supabase Values

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the "Project URL" and paste it as `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the "anon public" key and paste it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key or use an existing one
3. Copy the key and paste it as `OPENAI_API_KEY`

### Step 4: Restart Your Development Server

After creating the `.env.local` file:

```bash
# Stop your current server (Ctrl+C)
# Then restart it
npm run dev
```

## File Structure

Your project should look like this:

```
jjchatbot/
├── .env.local          # ← Create this file
├── package.json
├── src/
└── ...
```

## Important Notes

- **Never commit `.env.local`** to version control (it's already in `.gitignore`)
- The `NEXT_PUBLIC_` prefix is required for client-side access in Next.js
- Make sure there are no spaces around the `=` sign
- Don't use quotes around the values unless they contain spaces

## Verification

After setting up the environment variables, you should see:

```
🔧 [SUPABASE] Initializing Supabase client...
🔧 [SUPABASE] URL: ✅ Loaded
🔧 [SUPABASE] Key: ✅ Loaded
🔧 [SUPABASE] Testing connection...
✅ [SUPABASE] Connection test successful
```

Instead of the error you're currently seeing.
