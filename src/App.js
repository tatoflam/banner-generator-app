import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import BannerGenerator from './components/BannerGenerator';
import BannerPreview from './components/BannerPreview';
import AIRefiner from './components/AIRefiner';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.25rem;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TwoColumnRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
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
    subtitleOffsetX: 0,
    subtitleOffsetY: 0,
    backgroundColor: '#fab4b4',
    shape: 'none',
    shapeColor: '#cccccc',
    shapeImage: null,
    shapeSize: 80,
    backgroundImage: `${process.env.PUBLIC_URL}/assets/image/bg/nogawa.png`,
    backgroundSize: 100,
    customBackgroundDimensions: true,
    backgroundWidth: 360,
    backgroundHeight: 120,
    bannerScale: 100,
    bannerOffsetX: 0,
    bannerOffsetY: 0,
    refinedImageUrl: null,
    showTextOnBackground: true,
    useBannerImage: true,
    bannerImage: `${process.env.PUBLIC_URL}/assets/image/title/すっぱくろ題字_01.png`,
    bannerImageScale: 100,
    bannerImageOffsetX: 0,
    bannerImageOffsetY: 0
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
        <Row>
          <BannerPreview 
            settings={bannerSettings} 
            bannerRef={bannerRef}
          />
        </Row>
        <TwoColumnRow>
          <BannerGenerator 
            settings={bannerSettings} 
            onSettingsChange={handleSettingsChange} 
          />
          <AIRefiner 
            bannerRef={bannerRef} 
            onRefinementComplete={handleRefinementComplete} 
            settings={bannerSettings}
          />
        </TwoColumnRow>
      </MainContent>
    </AppContainer>
  );
}

export default App;
