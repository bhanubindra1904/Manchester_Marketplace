## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a Supabase project at https://supabase.com

3. Create a `.env.local` file in the root directory with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Create an API key for Gemini at https://ai.google.dev/gemini-api

5. Create a `.env.local` file in the root directory with your Gemini API key:
```
GEMINI_API_KEY=your-gemini-api-key
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.\
Use the [CORS Unblock](https://chromewebstore.google.com/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino?hl=en) Chrome extension to mitigate misconfigured response headers from CAS.


## Environment Variables

Create a `.env.local` file in the root directory and add the following:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-api-key
```