import React, { useRef } from 'react';
import styles from '../styles/BannerPreview.module.css';
// Import html-to-image dynamically when needed instead of at the top level

function BannerPreview({ settings, bannerRef }) {
  const previewRef = useRef(null);
  
  const handleDownload = async () => {
    if (!previewRef.current) return;
    
    try {
      console.log('Downloading banner...');
      
      // Show loading message
      const loadingMessage = document.createElement('div');
      loadingMessage.textContent = 'Preparing download...';
      loadingMessage.style.position = 'fixed';
      loadingMessage.style.top = '50%';
      loadingMessage.style.left = '50%';
      loadingMessage.style.transform = 'translate(-50%, -50%)';
      loadingMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      loadingMessage.style.color = 'white';
      loadingMessage.style.padding = '20px';
      loadingMessage.style.borderRadius = '5px';
      loadingMessage.style.zIndex = '9999';
      document.body.appendChild(loadingMessage);
      
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      // Use html2canvas to capture the preview area directly
      const canvas = await html2canvas(previewRef.current, {
        scale: window.devicePixelRatio, // Use device pixel ratio for higher quality
        useCORS: true, // Allow cross-origin images
        allowTaint: true, // Allow tainted canvas
        backgroundColor: settings.backgroundColor || '#ffffff',
        logging: false, // Disable logging
      });
      
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.download = `banner-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
      
      // Remove loading message
      document.body.removeChild(loadingMessage);
      
      console.log('Download complete!');
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  return (
    <div className={styles.previewContainer}>
      <h2>Banner Preview</h2>
      <div 
        ref={previewRef}
        className={`${styles.previewArea} preview-area`}
        style={{
          width: settings.customBackgroundDimensions ? `${settings.backgroundWidth}px` : '100%',
          height: settings.customBackgroundDimensions ? `${settings.backgroundHeight}px` : 'auto',
          aspectRatio: settings.customBackgroundDimensions ? `${settings.backgroundWidth} / ${settings.backgroundHeight}` : '1',
          backgroundColor: settings.backgroundColor,
          backgroundImage: settings.backgroundImage ? `url(${settings.backgroundImage})` : 'none',
          backgroundSize: settings.backgroundSize ? `${settings.backgroundSize}%` : 'cover',
          backgroundPosition: 'center',
          maxWidth: '100%'
        }}
      >
        {/* Always show the refined image if available */}
        {settings.refinedImageUrl && (
          <img className={styles.refinedImage} src={settings.refinedImageUrl} alt="Refined Banner" />
        )}
        
        {/* Show banner image if useBannerImage is true */}
        {settings.showTextOnBackground !== false && settings.useBannerImage && (
          <>
            <div
              className={styles.bannerImageContainer}
              style={{
                position: settings.refinedImageUrl ? 'absolute' : 'relative',
                transform: `scale(${settings.bannerImageScale / 100}) translate(${settings.bannerImageOffsetX}%, ${settings.bannerImageOffsetY}%)`
              }}
            >
              <img 
                className={styles.bannerImage}
                src={settings.bannerImage}
                alt="Banner Title"
              />
            </div>
            
            {/* Show subtitle with banner image if enabled - now outside the banner image container */}
            {settings.subtitleVisible && settings.subtitle && (
              <div 
                className={styles.subtitle}
                style={{
                  fontSize: `${settings.subtitleFontSize}px`,
                  fontFamily: settings.subtitleFontFamily || settings.fontFamily || "'KHongo', sans-serif",
                  color: settings.subtitleFontColor || settings.fontColor || '#000000',
                  position: 'absolute',
                  transform: `scale(${(settings.subtitleBannerScale || 100) / 100}) translate(${settings.subtitleOffsetX || 0}%, ${settings.subtitleOffsetY || 0}%)`,
                  textShadow: settings.refinedImageUrl ? '1px 1px 2px rgba(0,0,0,0.7)' : 'none'
                }}
              >
                {settings.subtitle}
              </div>
            )}
          </>
        )}
        
        {/* Always show text if enabled and useBannerImage is false */}
        {settings.showTextOnBackground !== false && !settings.useBannerImage && (
          <div
            ref={bannerRef}
            className={`${styles.bannerText} banner-text`}
            style={{ 
              fontFamily: settings.fontFamily,
              fontSize: `${settings.fontSize}px`,
              color: settings.fontColor,
              zIndex: 20,
              position: settings.refinedImageUrl ? 'absolute' : 'relative',
              ...(settings.shape === 'circle' && !settings.refinedImageUrl && {
                borderRadius: '50%',
                width: `${settings.shapeSize || 80}%`,
                height: `${settings.shapeSize || 80}%`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }),
              ...(settings.shape === 'square' && !settings.refinedImageUrl && {
                width: `${settings.shapeSize || 80}%`,
                height: `${settings.shapeSize || 80}%`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }),
              ...(settings.shape === 'rectangle' && !settings.refinedImageUrl && {
                width: `${settings.shapeSize || 80}%`,
                height: `${Math.floor((settings.shapeSize || 80) * 0.6)}%`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }),
              ...(settings.shapeImage && !settings.refinedImageUrl && {
                backgroundImage: `url(${settings.shapeImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }),
              ...(settings.shape !== 'none' && !settings.shapeImage && !settings.refinedImageUrl && {
                backgroundColor: settings.shapeColor
              })
            }}
          >
            <div className={styles.textContainer}>
              <div 
                className={styles.mainText}
                style={{ 
                  textShadow: settings.refinedImageUrl ? '1px 1px 2px rgba(0,0,0,0.7)' : 'none',
                  transform: `scale(${(settings.bannerScale || 100) / 100}) translate(${settings.bannerOffsetX || 0}%, ${settings.bannerOffsetY || -20}%)`
                }}
              >
                {settings.text}
              </div>
              
              {settings.subtitleVisible && settings.subtitle && (
                <div 
                  className={styles.subtitleText}
                  style={{
                    fontSize: `${settings.subtitleFontSize}px`,
                    fontFamily: settings.subtitleFontFamily || settings.fontFamily,
                    color: settings.subtitleFontColor || settings.fontColor,
                    transform: `scale(${(settings.subtitleBannerScale || 100) / 100}) translate(${settings.subtitleOffsetX || 0}%, ${settings.subtitleOffsetY || 50}%)`,
                    textShadow: settings.refinedImageUrl ? '1px 1px 2px rgba(0,0,0,0.7)' : 'none'
                  }}
                >
                  {settings.subtitle}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className={styles.buttonContainer}>
        <button className={styles.downloadButton} onClick={handleDownload}>
          Download Banner
        </button>
        <button 
          className={`${styles.downloadButton} ${styles.debugButton}`}
          onClick={() => {
            console.log('Current settings:', settings);
            console.log('Refined Image URL:', settings.refinedImageUrl);
            
            if (settings.refinedImageUrl) {
              // Create a new window with just the image
              const imageWindow = window.open('', '_blank');
              if (imageWindow) {
                imageWindow.document.write(`
                  <html>
                    <head>
                      <title>Debug Image</title>
                      <style>
                        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                        img { max-width: 100%; border: 1px solid #ccc; }
                        .info { margin-bottom: 20px; }
                      </style>
                    </head>
                    <body>
                      <div class="info">
                        <h3>Debug Information</h3>
                        <p>Image URL type: ${settings.refinedImageUrl.substring(0, 30)}...</p>
                        <p>Image URL length: ${settings.refinedImageUrl.length} characters</p>
                      </div>
                      <img src="${settings.refinedImageUrl}" alt="Refined Image" />
                    </body>
                  </html>
                `);
                imageWindow.document.close();
              } else {
                alert('Failed to open debug window. Please check your popup blocker settings.');
              }
            } else {
              console.log('No refined image URL available');
              alert('No refined image URL available');
            }
          }}
        >
          Debug Image
        </button>
      </div>
    </div>
  );
}

export default BannerPreview;
