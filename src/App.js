import React, { useState } from 'react';
import styled from 'styled-components';
import LogoGenerator from './components/LogoGenerator';
import LogoPreview from './components/LogoPreview';

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

function App() {
  const [logoSettings, setLogoSettings] = useState({
    text: 'Your Logo',
    fontFamily: 'Arial',
    fontSize: 48,
    fontColor: '#000000',
    backgroundColor: '#ffffff',
    shape: 'none',
    shapeColor: '#cccccc'
  });

  const handleSettingsChange = (newSettings) => {
    setLogoSettings({ ...logoSettings, ...newSettings });
  };

  return (
    <AppContainer>
      <Header>
        <h1>Logo Generator App</h1>
        <p>Create custom logos in seconds</p>
      </Header>
      <MainContent>
        <LogoGenerator 
          settings={logoSettings} 
          onSettingsChange={handleSettingsChange} 
        />
        <LogoPreview settings={logoSettings} />
      </MainContent>
    </AppContainer>
  );
}

export default App;
