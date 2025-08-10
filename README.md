This repository implements a multi-user app that uses tool-level auth with Arcade.dev, implementing a [custom user verifier](https://docs.arcade.dev/home/auth/secure-auth-production#build-a-custom-user-verifier).

## Getting Started

### Setup your Arcade account

To get started please [Create an Arcade account, and get an API key](https://docs.arcade.dev/home/api-keys)

### Create a new Google App

This code is intended to run with your own Google App. Please follow the steps outlined in [our docs](https://docs.arcade.dev/home/auth-providers/google#configuring-your-own-google-auth-provider-in-arcade) to create one and add a new Google provider to your Arcade Dashboard

### Create a Supabase project

Follow the steps from [Supabase's docs](https://supabase.com/docs/guides/getting-started) to create a new project and get your credentials.

### Environment Variables

Create a `.env.local` file in the root directory and configure the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=<your supabase url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your supabase anon key>
ARCADE_API_KEY=<your Arcade API key>
# Optional: Set your ngrok domain to allow cross-origin requests during development
NGROK_DOMAIN=<your ngrok domain>
```

### Configure the verifier on your Arcade Dashboard

The verifier in this project will work only if you [configure the verifier route](https://docs.arcade.dev/home/auth/secure-auth-production#add-your-custom-verifier-route-to-arcade) on the Arcade Dashboard.

### Running the Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
