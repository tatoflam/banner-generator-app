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

const LogoText = styled.div`
  font-family: ${props => props.$fontFamily};
  font-size: ${props => props.$fontSize}px;
  color: ${props => props.$fontColor};
  text-align: center;
  transform: scale(${props => (props.$logoScale || 100) / 100}) 
             translate(${props => props.$logoOffsetX || 0}%, ${props => props.$logoOffsetY || 0}%);
  
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
`;

function LogoPreview({ settings, logoRef }) {
  const previewRef = useRef(null);
  
  const handleDownload = async () => {
    if (!previewRef.current) return;
    
    try {
      // Use html-to-image to convert the DOM node to a PNG
      const dataUrl = await toPng(previewRef.current, { quality: 0.95 });
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.download = `logo-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  return (
    <PreviewContainer>
      <h2>Logo Preview</h2>
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
          <RefinedImage src={settings.refinedImageUrl} alt="Refined Logo" />
        ) : (
          <LogoText
            ref={logoRef}
            $fontFamily={settings.fontFamily}
            $fontSize={settings.fontSize}
            $fontColor={settings.fontColor}
            $shape={settings.shape}
            $shapeColor={settings.shapeColor}
            $shapeImage={settings.shapeImage}
            $shapeSize={settings.shapeSize}
            $logoScale={settings.logoScale}
            $logoOffsetX={settings.logoOffsetX}
            $logoOffsetY={settings.logoOffsetY}
          >
            {settings.text}
          </LogoText>
        )}
      </PreviewArea>
      
      <ButtonContainer>
        <DownloadButton onClick={handleDownload}>
          Download Logo
        </DownloadButton>
      </ButtonContainer>
    </PreviewContainer>
  );
}

export default LogoPreview;
