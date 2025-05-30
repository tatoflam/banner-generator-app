import React, { useRef } from 'react';
import styled from 'styled-components';
import { toPng } from 'html-to-image';

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
  object-fit: contain;
  z-index: 10; /* Ensure it's above other elements */
`;

function BannerPreview({ settings, bannerRef }) {
  const previewRef = useRef(null);
  
  const handleDownload = async () => {
    if (!previewRef.current) return;
    
    try {
      // Use html-to-image to directly capture the preview area exactly as it appears
      // This ensures all CSS styling, cropping, and positioning is preserved
      console.log('Capturing banner preview for download');
      
      // Configure the capture options to ensure we get the exact visual representation
      // Set skipFonts to true to avoid font loading errors
      const captureOptions = {
        quality: 1.0,
        pixelRatio: window.devicePixelRatio,
        skipFonts: true, // Skip loading fonts to prevent resource errors
        // Ensure background images and colors are captured
        backgroundColor: settings.backgroundColor || '#ffffff',
        style: {
          backgroundSize: settings.backgroundSize ? `${settings.backgroundSize}%` : 'cover',
          backgroundPosition: 'center',
          margin: '0',
          padding: '0'
        },
        // Suppress console errors during capture
        onclone: (clonedDoc) => {
          // Get the preview element in the cloned document
          const previewElement = clonedDoc.querySelector('.preview-area');
          
          if (previewElement) {
            // Remove any margins or padding that might cause shifting
            previewElement.style.margin = '0';
            previewElement.style.padding = '0';
            
            // Ensure content is centered
            previewElement.style.display = 'flex';
            previewElement.style.justifyContent = 'center';
            previewElement.style.alignItems = 'center';
            
            // Ensure text is properly centered
            const textElement = previewElement.querySelector('div');
            if (textElement) {
              textElement.style.margin = '0';
              textElement.style.padding = '0';
              textElement.style.textAlign = 'center';
            }
            
            // Ensure refined image is properly positioned
            const imgElement = previewElement.querySelector('img');
            if (imgElement) {
              imgElement.style.margin = '0';
              imgElement.style.padding = '0';
              imgElement.style.objectFit = 'contain';
              imgElement.style.width = '100%';
              imgElement.style.height = '100%';
            }
          }
          
          // Add a style to ensure text renders correctly even with skipFonts: true
          const style = clonedDoc.createElement('style');
          style.innerHTML = `
            * {
              font-family: ${settings.fontFamily || 'Arial, sans-serif'} !important;
              box-sizing: border-box;
            }
            .preview-area {
              margin: 0 !important;
              padding: 0 !important;
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      };
      
      // Import html-to-image dynamically
      const { toPng } = await import('html-to-image');
      
      // Temporarily suppress console errors
      const originalConsoleError = console.error;
      console.error = (msg) => {
        // Only log errors that aren't related to font loading
        if (!msg || (typeof msg === 'string' && !msg.includes('fonts.gstatic.com'))) {
          originalConsoleError(msg);
        }
      };
      
      let dataUrl;
      try {
        // Capture the preview area exactly as it appears
        dataUrl = await toPng(previewRef.current, captureOptions);
        console.log('Banner preview captured successfully');
      } finally {
        // Restore console.error
        console.error = originalConsoleError;
      }
      
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
        {settings.refinedImageUrl ? (
          <RefinedImage src={settings.refinedImageUrl} alt="Refined Banner" />
        ) : (
          <BannerText
            ref={bannerRef}
            $fontFamily={settings.fontFamily}
            $fontSize={settings.fontSize}
            $fontColor={settings.fontColor}
            $shape={settings.shape}
            $shapeColor={settings.shapeColor}
            $shapeImage={settings.shapeImage}
            $shapeSize={settings.shapeSize}
            $bannerScale={settings.bannerScale}
            $bannerOffsetX={settings.bannerOffsetX}
            $bannerOffsetY={settings.bannerOffsetY}
          >
            {settings.text}
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
