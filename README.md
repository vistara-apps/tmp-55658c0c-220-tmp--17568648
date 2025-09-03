# VibeFinder

![VibeFinder Logo](https://via.placeholder.com/200x60?text=VibeFinder)

> Stop doomscrolling, start discovering: Your AI guide to trending local spots.

VibeFinder is an AI-powered web application that curates and displays trending local experiences and events based on real-time social media video analysis, presented visually on a map.

## Features

- **AI-Powered Social Curation**: Scans Instagram and TikTok videos in real-time to identify trending venues, events, and experiences.
- **Interactive Map View**: Displays curated recommendations on an interactive map for easy visualization.
- **Real-time Trend Insights**: Shows why a place is trending by integrating short video clips, user sentiment, and key activity highlights.
- **Personalized 'Vibe' Matching**: Learns user preferences for atmosphere, crowd, and activity to tailor recommendations.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Authentication**: Web3 authentication via Coinbase OnchainKit
- **Database**: Supabase (PostgreSQL)
- **APIs**: OpenAI, EnsembleData, SocialKit, Google Maps
- **Caching**: Upstash Redis

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account
- API keys for external services

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vistara-apps/vibefinder.git
   cd vibefinder
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your API keys and configuration.

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
vibefinder/
├── actions/            # Server actions
├── app/                # Next.js app directory
├── components/         # React components
├── docs/               # Documentation
├── lib/                # Utility functions and API clients
├── public/             # Static assets
└── styles/             # Global styles
```

## Documentation

- [Technical Specifications](./docs/TECHNICAL_SPECIFICATIONS.md)
- [API Documentation](./docs/API_DOCUMENTATION.md)
- [UI/UX Requirements](./docs/UI_UX_REQUIREMENTS.md)
- [Business Logic](./docs/BUSINESS_LOGIC.md)

## Deployment

The application is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. Deploy the application

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Coinbase OnchainKit](https://github.com/coinbase/onchainkit)
- [Leaflet](https://leafletjs.com/)
- [OpenAI](https://openai.com/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)

