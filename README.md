# Banner Generator App

A web application that generates custom banners based on user input.

## Features
- Generate banners with customizable text, colors, and shapes
- Preview banners in real-time
- Download banners in PNG format
- AI-powered banner refinement using Stability AI

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/tatoflam/banner-generator-app.git

# Navigate to the project directory
cd banner-generator-app

# Install dependencies
npm install
```

### Development
```bash
# Start the development server
npm start
```

### Deployment
The application is configured to deploy to GitHub Pages using GitHub Actions.

1. Push your changes to the main branch
2. GitHub Actions will automatically build and deploy the application to GitHub Pages

You can also deploy manually using:
```bash
npm run deploy
```

### Environment Variables
The application uses the following environment variables:

- `REACT_APP_STABILITY_API_KEY`: Your Stability AI API key for AI banner refinement

To set up environment variables:

1. For local development, create a `.env` file in the root directory:
   ```
   REACT_APP_STABILITY_API_KEY=your_api_key_here
   ```

2. For GitHub Actions deployment, add the environment variables as secrets in your GitHub repository settings.

## Project Structure
```
banner-generator-app/
├── public/           # Static assets
│   ├── assets/       # Banner background images
│   └── index.html    # HTML template
├── src/              # Source code
│   ├── components/   # React components
│   │   ├── AIRefiner.js        # AI banner refinement component
│   │   ├── BannerGenerator.js  # Banner settings component
│   │   └── BannerPreview.js    # Banner preview component
│   ├── App.js        # Main application component
│   └── index.js      # Application entry point
├── .github/          # GitHub configuration
│   └── workflows/    # GitHub Actions workflows
│       └── deploy.yml # Deployment workflow
├── package.json      # Project dependencies and scripts
└── README.md         # Project documentation
```

## License
Copyright@ emile, inc.
