import React from 'react';
import styled from 'styled-components';

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
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.backgroundColor};
  margin-bottom: 1.5rem;
  border: 1px solid #ddd;
`;

const LogoText = styled.div`
  font-family: ${props => props.fontFamily};
  font-size: ${props => props.fontSize}px;
  color: ${props => props.fontColor};
  text-align: center;
  
  ${props => {
    if (props.shape === 'circle') {
      return `
        background-color: ${props.shapeColor};
        border-radius: 50%;
        width: 80%;
        height: 80%;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
    } else if (props.shape === 'square') {
      return `
        background-color: ${props.shapeColor};
        width: 80%;
        height: 80%;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
    } else if (props.shape === 'rectangle') {
      return `
        background-color: ${props.shapeColor};
        width: 80%;
        height: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
    }
    return '';
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
  
  &:hover {
    background-color: #45a049;
  }
`;

function LogoPreview({ settings }) {
  const handleDownload = () => {
    alert('Download functionality will be implemented in a future version.');
  };

  return (
    <PreviewContainer>
      <h2>Logo Preview</h2>
      <PreviewArea backgroundColor={settings.backgroundColor}>
        <LogoText
          fontFamily={settings.fontFamily}
          fontSize={settings.fontSize}
          fontColor={settings.fontColor}
          shape={settings.shape}
          shapeColor={settings.shapeColor}
        >
          {settings.text}
        </LogoText>
      </PreviewArea>
      <DownloadButton onClick={handleDownload}>
        Download Logo
      </DownloadButton>
    </PreviewContainer>
  );
}

export default LogoPreview;
