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
  transform: scale(${props => (props.$bannerScale || 100) / 100}) 
             translate(${props => props.$bannerOffsetX || 0}%, ${props => props.$bannerOffsetY || 0}%);
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
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
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
      console.log('Capturing banner preview for download');
      
      // Create a canvas element to draw the preview
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions to match the preview area
      const width = previewRef.current.clientWidth;
      const height = previewRef.current.clientHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      // Fill background
      ctx.fillStyle = settings.backgroundColor || '#ffffff';
      ctx.fillRect(0, 0, width, height);
      
      // Draw background image if available
      if (settings.backgroundImage || settings.refinedImageUrl) {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        
        // Create a promise to wait for the image to load
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = settings.refinedImageUrl || settings.backgroundImage;
        });
        
        // Calculate dimensions to maintain aspect ratio and cover the area
        const imgAspect = img.width / img.height;
        const canvasAspect = width / height;
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (imgAspect > canvasAspect) {
          // Image is wider than canvas
          drawHeight = height;
          drawWidth = height * imgAspect;
          offsetX = (width - drawWidth) / 2;
          offsetY = 0;
        } else {
          // Image is taller than canvas
          drawWidth = width;
          drawHeight = width / imgAspect;
          offsetX = 0;
          offsetY = (height - drawHeight) / 2;
        }
        
        // Apply background size scaling if specified
        if (settings.backgroundSize && settings.backgroundSize > 100) {
          const scale = settings.backgroundSize / 100;
          drawWidth *= scale;
          drawHeight *= scale;
          offsetX -= (drawWidth - width) / 2;
          offsetY -= (drawHeight - height) / 2;
        }
        
        // Draw the image
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
      
      // Draw text if enabled
      if (settings.showTextOnBackground !== false) {
        // Set font for main text
        ctx.font = `${settings.fontSize}px ${settings.fontFamily || 'Arial, sans-serif'}`;
        ctx.fillStyle = settings.fontColor || '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add shadow if there's a background image
        if (settings.refinedImageUrl) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
          ctx.shadowBlur = 2;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;
        }
        
        // Draw main text
        const textY = height / 2 - (settings.subtitleVisible ? settings.fontSize / 4 : 0);
        ctx.fillText(settings.text, width / 2, textY);
        
        // Draw subtitle if enabled
        if (settings.subtitleVisible && settings.subtitle) {
          ctx.font = `${settings.subtitleFontSize}px ${settings.fontFamily || 'Arial, sans-serif'}`;
          
          // Calculate position for subtitle (right-aligned)
          const subtitleWidth = ctx.measureText(settings.subtitle).width;
          const subtitleX = width / 2 + subtitleWidth / 2;
          // Reduce the vertical spacing to match the CSS changes
          const subtitleY = textY + settings.fontSize / 2 + settings.subtitleFontSize / 2 + 2;
          
          ctx.fillText(settings.subtitle, subtitleX, subtitleY);
        }
      }
      
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/png');
      console.log('Banner preview captured successfully');
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.download = `banner-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
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
        
        {/* Always show text if enabled, regardless of whether there's a refined image */}
        {settings.showTextOnBackground !== false && (
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
                textShadow: settings.refinedImageUrl ? '1px 1px 2px rgba(0,0,0,0.7)' : 'none' // Add shadow for better visibility on images
              }}>
                {settings.text}
              </div>
              
              {settings.subtitleVisible && settings.subtitle && (
                <div style={{
                  fontSize: `${settings.subtitleFontSize}px`,
                  marginTop: `0.1rem`, // Further reduce space between title and subtitle
                  marginBottom: '0.75rem', // Add margin between subtitle and bottom
                  padding: 0,
                  lineHeight: 1.1, // Reduce line height to tighten spacing
                  alignSelf: 'flex-end',
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
