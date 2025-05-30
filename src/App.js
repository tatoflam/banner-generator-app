import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import BannerGenerator from './components/BannerGenerator';
import BannerPreview from './components/BannerPreview';
import AIRefiner from './components/AIRefiner';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const MainContent = styled.main`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

function App() {
  const [bannerSettings, setBannerSettings] = useState({
    text: 'スッパクロ',
    fontFamily: "'KHongo', sans-serif",
    fontSize: 65,
    fontColor: '#fff1ff',
    subtitle: 'VOL.2',
    subtitleFontSize: 16,
    subtitleVisible: true,
    backgroundColor: '#fab4b4',
    shape: 'none',
    shapeColor: '#cccccc',
    shapeImage: null,
    shapeSize: 80,
    backgroundImage: `${process.env.PUBLIC_URL}/assets/nogawa.png`,
    backgroundSize: 100,
    customBackgroundDimensions: true,
    backgroundWidth: 360,
    backgroundHeight: 120,
    bannerScale: 100,
    bannerOffsetX: 0,
    bannerOffsetY: 0,
    refinedImageUrl: null,
    showTextOnBackground: true
  });
  
  const bannerRef = useRef(null);

  const handleSettingsChange = (newSettings) => {
    setBannerSettings({ ...bannerSettings, ...newSettings });
  };
  
  const handleRefinementComplete = (refinedImageUrl) => {
    setBannerSettings({ ...bannerSettings, refinedImageUrl });
  };

  return (
    <AppContainer>
      <Header>
        <h1>Suppakuro Generator</h1>
        <p>Create your custom banner in seconds</p>
      </Header>
      <MainContent>
        <BannerGenerator 
          settings={bannerSettings} 
          onSettingsChange={handleSettingsChange} 
        />
        <RightColumn>
          <BannerPreview 
            settings={bannerSettings} 
            bannerRef={bannerRef}
          />
          <AIRefiner 
            bannerRef={bannerRef} 
            onRefinementComplete={handleRefinementComplete} 
            settings={bannerSettings}
          />
        </RightColumn>
      </MainContent>
    </AppContainer>
  );
}

export default App;
