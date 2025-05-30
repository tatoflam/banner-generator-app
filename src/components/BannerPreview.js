import React, { useRef } from 'react';
import styled from 'styled-components';
// Import html-to-image dynamically when needed instead of at the top level

const PreviewContainer = styled.div`
  background-color: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 0.75rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const PreviewArea = styled.div`
  width: ${props => props.$customBackgroundDimensions ? `${props.$backgroundWidth}px` : '100%'};
  height: ${props => props.$customBackgroundDimensions ? `${props.$backgroundHeight}px` : 'auto'};
  aspect-ratio: ${props => props.$customBackgroundDimensions ? 'auto' : '1'};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.$backgroundColor};
  background-image: ${props => props.$backgroundImage ? `url(${props.$backgroundImage})` : 'none'};
  background-size: ${props => {
    // Always apply background size regardless of custom dimensions
    return props.$backgroundSize ? `${props.$backgroundSize}%` : 'cover';
  }};
  background-position: center;
  border: 1px solid #ddd;
  position: relative;
  overflow: hidden;
  max-width: 100%;
  margin: 0 auto 1.5rem;
`;

const BannerText = styled.div`
  font-family: ${props => props.$fontFamily};
  font-size: ${props => props.$fontSize}px;
  color: ${props => props.$fontColor};
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  ${props => {
    const shapeStyles = [];
    
    // Base shape styles
    if (props.$shape === 'circle') {
      shapeStyles.push(`
        border-radius: 50%;
        width: ${props.$shapeSize || 80}%;
        height: ${props.$shapeSize || 80}%;
      `);
    } else if (props.$shape === 'square') {
      shapeStyles.push(`
        width: ${props.$shapeSize || 80}%;
        height: ${props.$shapeSize || 80}%;
      `);
    } else if (props.$shape === 'rectangle') {
      shapeStyles.push(`
        width: ${props.$shapeSize || 80}%;
        height: ${Math.floor((props.$shapeSize || 80) * 0.6)}%;
      `);
    }
    
    // Add background image or color
    if (props.$shapeImage) {
      shapeStyles.push(`
        background-image: url(${props.$shapeImage});
        background-size: cover;
        background-position: center;
      `);
    } else if (props.$shape !== 'none') {
      shapeStyles.push(`
        background-color: ${props.$shapeColor};
      `);
    }
    
    // Common styles for all shapes
    if (props.$shape !== 'none') {
      shapeStyles.push(`
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      `);
    }
    
    return shapeStyles.join('');
  }}
`;

const DownloadButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 0.5rem;
  
  &:hover {
    background-color: #45a049;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    margin-right: 0;
    padding: 0.75rem 0;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  width: 100%;
  justify-content: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const RefinedImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Changed from contain to cover to fill the entire area */
  z-index: 10; /* Ensure it's above other elements */
`;

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
    <PreviewContainer>
      <h2>Banner Preview</h2>
      <PreviewArea 
        ref={previewRef}
        className="preview-area"
        $backgroundColor={settings.backgroundColor}
        $backgroundImage={settings.backgroundImage}
        $backgroundSize={settings.backgroundSize}
        $customBackgroundDimensions={settings.customBackgroundDimensions}
        $backgroundWidth={settings.backgroundWidth}
        $backgroundHeight={settings.backgroundHeight}
      >
        {/* Always show the refined image if available */}
        {settings.refinedImageUrl && (
          <RefinedImage src={settings.refinedImageUrl} alt="Refined Banner" />
        )}
        
        {/* Show banner image if useBannerImage is true */}
        {settings.showTextOnBackground !== false && settings.useBannerImage && (
          <div
            style={{
              position: settings.refinedImageUrl ? 'absolute' : 'relative',
              zIndex: 20,
              transform: `scale(${settings.bannerImageScale / 100}) translate(${settings.bannerImageOffsetX}%, ${settings.bannerImageOffsetY}%)`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%'
            }}
          >
            <img 
              src={settings.bannerImage}
              alt="Banner Title"
              style={{
                maxWidth: '80%',
                maxHeight: '80%',
                objectFit: 'contain'
              }}
            />
            
            {/* Show subtitle with banner image if enabled */}
            {settings.subtitleVisible && settings.subtitle && (
              <div style={{
                fontSize: `${settings.subtitleFontSize}px`,
                fontFamily: settings.fontFamily || "'KHongo', sans-serif",
                color: settings.fontColor || '#000000',
                position: 'absolute',
                bottom: '10%',
                right: '10%',
                transform: `translate(${settings.subtitleOffsetX || 0}%, ${settings.subtitleOffsetY || 0}%)`,
                textShadow: settings.refinedImageUrl ? '1px 1px 2px rgba(0,0,0,0.7)' : 'none'
              }}>
                {settings.subtitle}
              </div>
            )}
          </div>
        )}
        
        {/* Always show text if enabled and useBannerImage is false */}
        {settings.showTextOnBackground !== false && !settings.useBannerImage && (
          <BannerText
            ref={bannerRef}
            className="banner-text" // Add class name for AIRefiner to identify
            $fontFamily={settings.fontFamily}
            $fontSize={settings.fontSize}
            $fontColor={settings.fontColor}
            $shape={settings.shape && !settings.refinedImageUrl ? settings.shape : 'none'} // Only use shape if no refined image
            $shapeColor={settings.shapeColor}
            $shapeImage={settings.shapeImage}
            $shapeSize={settings.shapeSize}
            $bannerScale={settings.bannerScale}
            $bannerOffsetX={settings.bannerOffsetX}
            $bannerOffsetY={settings.bannerOffsetY}
            style={{ 
              zIndex: 20, // Ensure text is above the refined image
              position: settings.refinedImageUrl ? 'absolute' : 'relative'
            }}
          >
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: 0,
              margin: 0
            }}>
              <div style={{ 
                padding: 0, 
                margin: '0.75rem 0 0 0', // Add top margin to the title
                lineHeight: 1.1, // Reduce line height to tighten spacing
                textShadow: settings.refinedImageUrl ? '1px 1px 2px rgba(0,0,0,0.7)' : 'none', // Add shadow for better visibility on images
                transform: `scale(${(settings.bannerScale || 100) / 100}) 
                           translate(${settings.bannerOffsetX || 0}%, ${settings.bannerOffsetY || -20}%)`
              }}>
                {settings.text}
              </div>
              
              {settings.subtitleVisible && settings.subtitle && (
                <div style={{
                  fontSize: `${settings.subtitleFontSize}px`,
                  padding: 0,
                  lineHeight: 1.1, // Reduce line height to tighten spacing
                  position: 'absolute',
                  bottom: '10%',
                  right: '10%',
                  transform: `translate(${settings.subtitleOffsetX || 0}%, ${settings.subtitleOffsetY || 50}%)`,
                  textShadow: settings.refinedImageUrl ? '1px 1px 2px rgba(0,0,0,0.7)' : 'none' // Add shadow for better visibility on images
                }}>
                  {settings.subtitle}
                </div>
              )}
            </div>
          </BannerText>
        )}
      </PreviewArea>
      
      <ButtonContainer>
        <DownloadButton onClick={handleDownload}>
          Download Banner
        </DownloadButton>
        <DownloadButton 
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
          style={{ backgroundColor: '#2196F3' }}
        >
          Debug Image
        </DownloadButton>
      </ButtonContainer>
    </PreviewContainer>
  );
}

export default BannerPreview;
