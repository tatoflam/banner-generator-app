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

### Environment Variables and Secrets

The application uses the following environment variables and secrets:

- `REACT_APP_STABILITY_API_KEY`: Your [Stability AI API key](https://platform.stability.ai/) for AI banner refinement <- This is invalid in usual operation. Please fill this at `Stability AI API Key` field in application by yourself.  
- `GH_PAGES_TOKEN`: A GitHub Personal Access Token with repo permissions for GitHub Pages deployment

To set up environment variables and secrets:

1. For local development, create a `.env` file in the root directory:
   ```
   REACT_APP_STABILITY_API_KEY=your_api_key_here
   ```

2. For GitHub Actions deployment, add the following secrets in your GitHub repository settings (Settings > Secrets and variables > Actions > New repository secret):
   - `REACT_APP_STABILITY_API_KEY`: Your Stability AI API key
   - `GH_PAGES_TOKEN`: A GitHub Personal Access Token with repo permissions
   
   To create a Personal Access Token:
   1. Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
   2. Click "Generate new token" and select "Classic"
   3. Give it a name, set an expiration, and select the "repo" scope
   4. Copy the generated token and add it as a secret in your repository settings

## Github Pages

1. Github Repository > Settings > Pages > Build and Deployment  > Set Branch to `gh-pages`  
2. After few minutes, access to 
https://tatoflam.github.io/banner-generator-app


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

## Custom Fonts

The application includes several custom Japanese fonts:

1. Oshigo: `assets/font/oshigo.otf`
2. Nagino: `assets/font/nagino.otf`
3. Aomemo Font: `assets/font/AomemoFont-Regular.otf` - [Download from Booth](https://booth.pm/ja/items/118072)
4. Gisshiri: `assets/font/Gisshiri.ttf`
5. Migikataagari: `assets/font/migikataagari.ttf`
6. 玉ねぎ楷書激無料版v7改: `assets/font/玉ねぎ楷書激無料版v7改.ttf`
7. AkazukiPop: `assets/font/AkazukiPOP.ttf`
8. Karakaze-R: `assets/font/karakaze-R.otf`
9. ZeroGothic: `assets/font/ZeroGothic.otf`
10. IoEI: `assets/font/IoEI.ttf`
11. 筆達筆: `assets/font/g_brushtappitsu_freeB.ttf`
12. April Gothic: `assets/font/AprilGothicOne-R.ttf`
13. ミシミシブロック: `assets/font/MISHIMISHI-BLOCK.otf`
14. K戦隊: `assets/font/KSENTAI.ttf`
15. 麒麟: `assets/font/kirin-Regular.ttf`
16. KEEE!: `assets/font/KEEE!.ttf`
17. K小太郎: `assets/font/KKOTARO.ttf`
18. K本合: `assets/font/KHONGO.ttf`
19. ポテジフェイス: `assets/font/Potejiface-Regular.otf`
20. AstroZ: `assets/font/AstroZ-KtD.otf`

## License
Copyright@ emile, inc.
