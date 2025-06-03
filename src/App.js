import React, { useState, useRef } from 'react';
import BannerGenerator from './components/BannerGenerator';
import BannerPreview from './components/BannerPreview';
import AIRefiner from './components/AIRefiner';
import styles from './styles/App.module.css';

function App() {
  const [bannerSettings, setBannerSettings] = useState({
    text: 'スッパクロ',
    fontFamily: "'KHongo', sans-serif",
    fontSize: 65,
    fontColor: '#fff1ff',
    subtitle: '第１号',
    subtitleFontSize: 32,
    subtitleVisible: true,
    subtitleOffsetX: 130,
    subtitleOffsetY: 60,
    subtitleFontFamily: "'BrushTappitsu', sans-serif",
    subtitleFontColor: '#fff1ff',
    subtitleBannerScale: 100,
    backgroundColor: '#fab4b4',
    shape: 'none',
    shapeColor: '#cccccc',
    shapeImage: null,
    shapeSize: 80,
    backgroundImage: `${process.env.PUBLIC_URL}/assets/image/bg/nogawa.png`,
    backgroundSize: 100,
    customBackgroundDimensions: true,
    backgroundWidth: 600,
    backgroundHeight: 200,
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
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Suppakuro Generator</h1>
        <p className={styles.subtitle}>Create your custom banner in seconds</p>
      </header>
      <main className={styles.content}>
        <div className={styles.previewSection}>
          <BannerPreview 
            settings={bannerSettings} 
            bannerRef={bannerRef}
          />
        </div>
        <div className={styles.controlsSection}>
          <div className={styles.generatorSection}>
            <BannerGenerator 
              settings={bannerSettings} 
              onSettingsChange={handleSettingsChange} 
            />
          </div>
          <div className={styles.refinerSection}>
            <AIRefiner 
              bannerRef={bannerRef} 
              onRefinementComplete={handleRefinementComplete} 
              settings={bannerSettings}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
