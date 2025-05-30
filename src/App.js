import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import LogoGenerator from './components/LogoGenerator';
import LogoPreview from './components/LogoPreview';
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
  const [logoSettings, setLogoSettings] = useState({
    text: 'すっぱくろ',
    fontFamily: 'Zen Maru Gothic',
    fontSize: 56,
    fontColor: '#fff1ff',
    backgroundColor: '#fab4b4',
    shape: 'none',
    shapeColor: '#cccccc',
    shapeImage: null,
    shapeSize: 80,
    backgroundImage: null,
    backgroundSize: 100,
    customBackgroundDimensions: true,
    backgroundWidth: 360,
    backgroundHeight: 120,
    logoScale: 100,
    logoOffsetX: 0,
    logoOffsetY: 0,
    refinedImageUrl: null
  });
  
  const logoRef = useRef(null);

  const handleSettingsChange = (newSettings) => {
    setLogoSettings({ ...logoSettings, ...newSettings });
  };
  
  const handleRefinementComplete = (refinedImageUrl) => {
    setLogoSettings({ ...logoSettings, refinedImageUrl });
  };

  return (
    <AppContainer>
      <Header>
        <h1>Suppakuro Generator</h1>
        <p>Create your custom banner in seconds</p>
      </Header>
      <MainContent>
        <LogoGenerator 
          settings={logoSettings} 
          onSettingsChange={handleSettingsChange} 
        />
        <RightColumn>
          <LogoPreview 
            settings={logoSettings} 
            logoRef={logoRef}
          />
          <AIRefiner 
            logoRef={logoRef} 
            onRefinementComplete={handleRefinementComplete} 
          />
        </RightColumn>
      </MainContent>
    </AppContainer>
  );
}

export default App;
