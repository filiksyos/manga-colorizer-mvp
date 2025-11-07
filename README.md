# AI Manga Colorizer MVP

Transform black & white manga panels into vibrant colored images using AI.

## Features

- 🎨 **AI-Powered Colorization** - Uses Gemini 2.0 Flash via OpenRouter to colorize manga panels
- 📤 **Easy Upload** - Drag & drop or click to upload manga panels
- 🖼️ **Image Processing** - Client-side image optimization and validation
- 💾 **Download Results** - Save colorized images in PNG or JPEG format
- ⚡ **Real-time Progress** - Track colorization progress with loading stages
- 🎯 **Error Handling** - Comprehensive error handling with retry mechanisms
- 🌓 **Dark Mode** - Beautiful UI with dark mode support
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

## Tech Stack

- **Framework**: Next.js 15.5.2 with App Router
- **UI**: React 19.1.0 + TypeScript
- **Styling**: Tailwind CSS 4
- **AI Integration**: Vercel AI SDK + OpenRouter (Gemini 2.0 Flash)
- **Build Tool**: Turbopack

## Getting Started

### Prerequisites

- Node.js 18+ or pnpm/yarn/bun
- OpenRouter API key ([Get one here](https://openrouter.ai/))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/filiksyos/manga-colorizer-mvp.git
cd manga-colorizer-mvp
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Upload a Manga Panel**: Drag and drop or click to upload a black & white manga panel (JPEG, PNG, or WebP, max 5MB)
2. **Click "Colorize Manga Panel"**: The AI will process your image
3. **Wait for Processing**: Watch the progress indicators as AI colorizes your manga
4. **Download Result**: Choose PNG or JPEG format and download your colorized image
5. **Try Another**: Upload and colorize more panels!

## Project Structure

```
manga-colorizer-mvp/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── colorize-manga/
│   │   │       └── route.ts          # API endpoint for colorization
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Main page component
│   ├── components/
│   │   ├── ImageUpload.tsx           # Image upload component
│   │   ├── ResultDisplay.tsx         # Result display component
│   │   ├── ErrorDisplay.tsx          # Error handling component
│   │   ├── LoadingDisplay.tsx        # Loading state component
│   │   └── index.ts                  # Component exports
│   ├── lib/
│   │   └── utils.ts                  # Utility functions
│   └── types/
│       └── index.ts                  # TypeScript type definitions
├── .env.local                        # Environment variables (create this)
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies and scripts
├── postcss.config.mjs                # PostCSS configuration
├── tailwind.config.ts                # Tailwind CSS configuration (auto-generated)
└── tsconfig.json                     # TypeScript configuration
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | Yes |

## API Integration

This MVP uses:
- **OpenRouter** as the AI provider gateway
- **Gemini 2.0 Flash** model for manga colorization
- **Vercel AI SDK** for streamlined AI integration

> **Note**: The current implementation uses Gemini 2.0 Flash, which is primarily a text model. For production use with actual image generation, you may want to integrate specialized image generation models like:
> - Stable Diffusion (via Replicate or Hugging Face)
> - DALL-E (via OpenAI)
> - Midjourney API
> - Custom fine-tuned models for manga colorization

## Building for Production

```bash
npm run build
npm run start
```

## Deployment

This app can be deployed to:
- **Vercel** (recommended) - One-click deployment
- **Netlify**
- **Railway**
- Any Node.js hosting platform

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/filiksyos/manga-colorizer-mvp)

Remember to add your `OPENROUTER_API_KEY` to the environment variables in your deployment platform.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

- Based on the architecture from [filiksyos/ai_outfit_app](https://github.com/filiksyos/ai_outfit_app)
- Powered by [OpenRouter](https://openrouter.ai/)
- Built with [Next.js](https://nextjs.org/) and [Vercel AI SDK](https://sdk.vercel.ai/)

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/filiksyos/manga-colorizer-mvp/issues) on GitHub.

---

**Happy Colorizing! 🎨✨**
