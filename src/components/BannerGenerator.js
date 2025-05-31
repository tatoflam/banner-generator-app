import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const GeneratorContainer = styled.div`
  background-color: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    margin: 0;
    border-radius: 4px;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const FormSection = styled.div`
  margin-bottom: 0.75rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.25rem;
  width: 100%;
  
  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 0;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const SectionTitle = styled.div`
  margin-top: 0;
  margin-bottom: 0;
  color: #333;
  
  &.h2 {
    font-size: 1.4rem;
    font-weight: bold;
  }
  
  &.h3 {
    font-size: 1.2rem;
    font-weight: bold;
    margin-left: 0.5rem;
  }
  
  &.h4 {
    font-size: 1.1rem;
    font-weight: normal;
    margin-left: 1rem;
  }
  
  &.h5 {
    font-size: 1rem;
    font-weight: normal;
    margin-left: 1.5rem;
    font-style: italic;
  }
`;

const SectionContent = styled.div`
  display: ${props => props.$isExpanded ? 'block' : 'none'};
  margin-top: 0.5rem;
  padding-bottom: 1rem;
`;

const ChevronIcon = styled.span`
  font-size: 1rem;
  color: #666;
`;

const BackgroundPreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const BackgroundPreview = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background-image: ${props => props.src ? `url(${props.src})` : 'none'};
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid ${props => props.selected ? '#4CAF50' : 'transparent'};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    opacity: 0.9;
    transform: scale(1.05);
    transition: all 0.2s ease;
  }
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SliderValue = styled.span`
  min-width: 40px;
  text-align: right;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ColorInput = styled.input`
  width: 100%;
  height: 40px;
  cursor: pointer;
`;

function BannerGenerator({ settings, onSettingsChange }) {
  const [imageOptions, setImageOptions] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    background: false,
    position: false,
    text: true,
    shape: false
  });
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  useEffect(() => {
    // Load images from public/assets with PUBLIC_URL prefix for GitHub Pages compatibility
    const images = [
      { name: 'None', path: null },
      { name: 'Spring', path: `${process.env.PUBLIC_URL}/assets/image/bg/spring.png` },
      { name: 'Summer', path: `${process.env.PUBLIC_URL}/assets/image/bg/summer.png` },
      { name: 'Autumn', path: `${process.env.PUBLIC_URL}/assets/image/bg/autumn.png` },
      { name: 'Winter', path: `${process.env.PUBLIC_URL}/assets/image/bg/winter.png` },
      { name: 'Nogawa', path: `${process.env.PUBLIC_URL}/assets/image/bg/nogawa.png` }
    ];
    
    setImageOptions(images);
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    onSettingsChange({ [name]: value });
  };
  
  const handleBackgroundSelect = (imagePath) => {
    onSettingsChange({ backgroundImage: imagePath });
  };
  
  const handleShapeImageSelect = (imagePath) => {
    onSettingsChange({ shapeImage: imagePath });
  };

  return (
    <GeneratorContainer>
      <h2>Banner Settings</h2>
      
      {/* 1. Background */}
      <FormSection>
        <SectionHeader onClick={() => toggleSection('background')}>
          <SectionTitle>Background</SectionTitle>
          <ChevronIcon>
            {expandedSections.background ? <FaChevronUp /> : <FaChevronDown />}
          </ChevronIcon>
        </SectionHeader>
        
        <SectionContent $isExpanded={expandedSections.background}>
          <FormGroup>
            <Label htmlFor="backgroundColor">Background Color</Label>
            <ColorInput
              type="color"
              id="backgroundColor"
              name="backgroundColor"
              value={settings.backgroundColor}
              onChange={handleChange}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Background Image</Label>
            <BackgroundPreviewContainer>
              {imageOptions.map((image, index) => (
                <BackgroundPreview 
                  key={index}
                  src={image.path || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%23f5f5f5"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="%23999" text-anchor="middle" dominant-baseline="middle">None</text></svg>'}
                  selected={settings.backgroundImage === image.path}
                  onClick={() => handleBackgroundSelect(image.path)}
                  title={image.name}
                />
              ))}
            </BackgroundPreviewContainer>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="backgroundSize">Background Size (Crop)</Label>
            <SliderContainer>
              <Input
                type="range"
                id="backgroundSize"
                name="backgroundSize"
                min="100"
                max="200"
                value={settings.backgroundSize || 100}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  onSettingsChange({ backgroundSize: value });
                }}
              />
              <SliderValue>{settings.backgroundSize || 100}%</SliderValue>
            </SliderContainer>
          </FormGroup>
          
          <FormGroup>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                id="showTextOnBackground"
                name="showTextOnBackground"
                checked={settings.showTextOnBackground !== false}
                onChange={(e) => {
                  onSettingsChange({ showTextOnBackground: e.target.checked });
                }}
                style={{ marginRight: '0.5rem' }}
              />
              <Label htmlFor="showTextOnBackground">Show Text on Background</Label>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666', marginLeft: '1.5rem' }}>
              Uncheck to create a background without text, then add text later
            </div>
          </FormGroup>
          
          <FormGroup>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                id="customBackgroundDimensions"
                name="customBackgroundDimensions"
                checked={settings.customBackgroundDimensions || false}
                onChange={(e) => {
                  // When enabling custom dimensions, reset background size to 100%
                  if (e.target.checked) {
                    onSettingsChange({ 
                      customBackgroundDimensions: e.target.checked,
                      backgroundSize: 100
                    });
                  } else {
                    onSettingsChange({ customBackgroundDimensions: e.target.checked });
                  }
                }}
                style={{ marginRight: '0.5rem' }}
              />
              <Label htmlFor="customBackgroundDimensions">Custom Background Dimensions</Label>
            </div>
            
            {settings.customBackgroundDimensions && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label 
                    htmlFor="backgroundWidth" 
                    style={{ display: 'block', marginBottom: '0.5rem' }}
                  >
                    Width (px): {settings.backgroundWidth || 400}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="range"
                      id="backgroundWidth"
                      name="backgroundWidth"
                      min="200"
                      max="650"
                      value={settings.backgroundWidth || 400}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        onSettingsChange({ backgroundWidth: value });
                      }}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label 
                    htmlFor="backgroundHeight" 
                    style={{ display: 'block', marginBottom: '0.5rem' }}
                  >
                    Height (px): {settings.backgroundHeight || 400}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="range"
                      id="backgroundHeight"
                      name="backgroundHeight"
                      min="120"
                      max="650"
                      value={settings.backgroundHeight || 400}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        onSettingsChange({ backgroundHeight: value });
                      }}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </FormGroup>
        </SectionContent>
      </FormSection>

      {/* 2. Banner Title */}
      <FormSection>
        <SectionHeader onClick={() => toggleSection('text')}>
          <SectionTitle>Banner Title</SectionTitle>
          <ChevronIcon>
            {expandedSections.text ? <FaChevronUp /> : <FaChevronDown />}
          </ChevronIcon>
        </SectionHeader>
        <SectionContent $isExpanded={expandedSections.text}>
          <FormGroup>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                id="useBannerImage"
                name="useBannerImage"
                checked={settings.useBannerImage}
                onChange={(e) => {
                  onSettingsChange({ useBannerImage: e.target.checked });
                }}
                style={{ marginRight: '0.5rem' }}
              />
              <Label htmlFor="useBannerImage">Use Banner Image Instead of Text</Label>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666', marginLeft: '1.5rem', marginBottom: '1rem' }}>
              Check to use a banner image instead of text
            </div>
          </FormGroup>
          
          {/* Banner Text - only shown when not using banner image */}
          {!settings.useBannerImage && (
            <FormGroup>
              <Label htmlFor="text">Banner Text</Label>
              <Input
                type="text"
                id="text"
                name="text"
                value={settings.text}
                onChange={handleChange}
              />
            </FormGroup>
          )}
          
          {/* Subtitle - always shown, regardless of banner image setting */}
          <FormGroup>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                id="subtitleVisible"
                name="subtitleVisible"
                checked={settings.subtitleVisible}
                onChange={(e) => {
                  onSettingsChange({ subtitleVisible: e.target.checked });
                }}
                style={{ marginRight: '0.5rem' }}
              />
              <Label htmlFor="subtitleVisible">Show Subtitle</Label>
            </div>
            
            {settings.subtitleVisible && (
              <>
                <Label htmlFor="subtitle">Subtitle Text (e.g., 第n回)</Label>
                <Input
                  type="text"
                  id="subtitle"
                  name="subtitle"
                  value={settings.subtitle}
                  onChange={handleChange}
                  placeholder="第1回"
                />
                
                <Label htmlFor="subtitleFontSize" style={{ marginTop: '0.5rem' }}>Subtitle Font Size</Label>
                <SliderContainer>
                  <Input
                    type="range"
                    id="subtitleFontSize"
                    name="subtitleFontSize"
                    min="8"
                    max="36"
                    value={settings.subtitleFontSize}
                    onChange={handleChange}
                  />
                  <SliderValue>{settings.subtitleFontSize}px</SliderValue>
                </SliderContainer>
                
                <Label htmlFor="subtitleOffsetX" style={{ marginTop: '0.5rem' }}>Subtitle Horizontal Position</Label>
                <SliderContainer>
                  <Input
                    type="range"
                    id="subtitleOffsetX"
                    name="subtitleOffsetX"
                    min="-50"
                    max="50"
                    value={settings.subtitleOffsetX || 0}
                    onChange={handleChange}
                  />
                  <SliderValue>{settings.subtitleOffsetX || 0}</SliderValue>
                </SliderContainer>
                
                <Label htmlFor="subtitleOffsetY" style={{ marginTop: '0.5rem' }}>Subtitle Vertical Position</Label>
                <SliderContainer>
                  <Input
                    type="range"
                    id="subtitleOffsetY"
                    name="subtitleOffsetY"
                    min="-50"
                    max="50"
                    value={settings.subtitleOffsetY || 0}
                    onChange={handleChange}
                  />
                  <SliderValue>{settings.subtitleOffsetY || 0}</SliderValue>
                </SliderContainer>
              </>
            )}
          </FormGroup>
          
          {/* Font settings - only shown when not using banner image */}
          {!settings.useBannerImage && (
            <>
              <FormGroup>
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select
                  id="fontFamily"
                  name="fontFamily"
                  value={settings.fontFamily || "'KHongo', sans-serif"}
                  onChange={handleChange}
                >
                  {/* Western Fonts */}
                  <optgroup label="Western Fonts">
                    <option value="Arial">Arial</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                  </optgroup>
                  
                  {/* Custom Japanese Fonts */}
                  <optgroup label="Custom Japanese Fonts">
                    <option value="'Oshigo', sans-serif">Oshigo</option>
                    <option value="'Nagino', sans-serif">Nagino</option>
                    <option value="'Aomemo', sans-serif">Aomemo</option>
                    <option value="'Gisshiri', sans-serif">Gisshiri</option>
                    <option value="'Migikataagari', sans-serif">Migikataagari</option>
                    <option value="'Tamanegi', sans-serif">玉ねぎ楷書</option>
                    <option value="'AkazukiPop', sans-serif">AkazukiPop</option>
                    <option value="'Karakaze', sans-serif">Karakaze</option>
                    <option value="'ZeroGothic', sans-serif">ZeroGothic</option>
                    <option value="'IoEI', sans-serif">IoEI</option>
                    <option value="'BrushTappitsu', sans-serif">筆達筆</option>
                    <option value="'AprilGothic', sans-serif">April Gothic</option>
                    <option value="'MishimishiBlock', sans-serif">ミシミシブロック</option>
                    <option value="'KSentai', sans-serif">K戦隊</option>
                    <option value="'Kirin', sans-serif">麒麟</option>
                    <option value="'Keee', sans-serif">KEEE!</option>
                    <option value="'KKotaro', sans-serif">K小太郎</option>
                    <option value="'KHongo', sans-serif">K本郷</option>
                    <option value="'Potejiface', sans-serif">ポテジフェイス</option>
                    <option value="'AstroZ', sans-serif">AstroZ</option>
                  </optgroup>
                  
                  {/* Google Japanese Fonts */}
                  <optgroup label="Google Japanese Fonts">
                    <option value="'Kasei Decol', sans-serif">Kasei Decol</option>
                    <option value="'Noto Sans JP', sans-serif">Noto Sans JP</option>
                    <option value="'Noto Serif JP', serif">Noto Serif JP</option>
                    <option value="'M PLUS 1p', sans-serif">M PLUS 1p</option>
                    <option value="'M PLUS Rounded 1c', sans-serif">M PLUS Rounded 1c</option>
                    <option value="'Kosugi Maru', sans-serif">Kosugi Maru</option>
                    <option value="'Sawarabi Mincho', serif">Sawarabi Mincho</option>
                    <option value="'Sawarabi Gothic', sans-serif">Sawarabi Gothic</option>
                    <option value="'Shippori Mincho', serif">Shippori Mincho</option>
                    <option value="'Yuji Syuku', serif">Yuji Syuku</option>
                    <option value="'Zen Kaku Gothic New', sans-serif">Zen Kaku Gothic</option>
                    <option value="'Zen Maru Gothic', sans-serif">Zen Maru Gothic</option>
                    <option value="'Zen Old Mincho', serif">Zen Old Mincho</option>
                  </optgroup>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="fontSize">Font Size</Label>
                <SliderContainer>
                  <Input
                    type="range"
                    id="fontSize"
                    name="fontSize"
                    min="12"
                    max="72"
                    value={settings.fontSize}
                    onChange={handleChange}
                  />
                  <SliderValue>{settings.fontSize}px</SliderValue>
                </SliderContainer>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="fontColor">Font Color</Label>
                <ColorInput
                  type="color"
                  id="fontColor"
                  name="fontColor"
                  value={settings.fontColor}
                  onChange={handleChange}
                />
              </FormGroup>
            </>
          )}
        </SectionContent>
      </FormSection>

      {/* 3. Banner Title Position & Size */}
      <FormSection>
        <SectionHeader onClick={() => toggleSection('position')}>
          <SectionTitle>Banner Title Position & Size</SectionTitle>
          <ChevronIcon>
            {expandedSections.position ? <FaChevronUp /> : <FaChevronDown />}
          </ChevronIcon>
        </SectionHeader>
        <SectionContent $isExpanded={expandedSections.position}>
          <FormGroup>
            <Label htmlFor="bannerScale">Banner Scale</Label>
            <SliderContainer>
              <Input
                type="range"
                id="bannerScale"
                name="bannerScale"
                min="50"
                max="150"
                value={settings.bannerScale || 100}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  // Update both bannerScale (for text) and bannerImageScale (for image)
                  onSettingsChange({ 
                    bannerScale: value,
                    bannerImageScale: value 
                  });
                }}
              />
              <SliderValue>{settings.bannerScale || 100}%</SliderValue>
            </SliderContainer>
          </FormGroup>
        
          <FormGroup>
            <Label htmlFor="bannerOffsetX">Horizontal Position</Label>
            <SliderContainer>
              <Input
                type="range"
                id="bannerOffsetX"
                name="bannerOffsetX"
                min="-50"
                max="50"
                value={settings.bannerOffsetX || 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  // Update both bannerOffsetX (for text) and bannerImageOffsetX (for image)
                  onSettingsChange({ 
                    bannerOffsetX: value,
                    bannerImageOffsetX: value 
                  });
                }}
              />
              <SliderValue>{settings.bannerOffsetX || 0}</SliderValue>
            </SliderContainer>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="bannerOffsetY">Vertical Position</Label>
            <SliderContainer>
              <Input
                type="range"
                id="bannerOffsetY"
                name="bannerOffsetY"
                min="-50"
                max="50"
                value={settings.bannerOffsetY || 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  // Update both bannerOffsetY (for text) and bannerImageOffsetY (for image)
                  onSettingsChange({ 
                    bannerOffsetY: value,
                    bannerImageOffsetY: value 
                  });
                }}
              />
              <SliderValue>{settings.bannerOffsetY || 0}</SliderValue>
            </SliderContainer>
          </FormGroup>
        </SectionContent>
      </FormSection>


      {/* 4. Banner Title Background Shape */}
      <FormSection>
        <SectionHeader onClick={() => toggleSection('shape')}>
          <SectionTitle>Banner Title Background Shape</SectionTitle>
          <ChevronIcon>
            {expandedSections.shape ? <FaChevronUp /> : <FaChevronDown />}
          </ChevronIcon>
        </SectionHeader>
        <SectionContent $isExpanded={expandedSections.shape}>
          <FormGroup>
            <Label htmlFor="shape">Background Shape</Label>
            <Select
              id="shape"
              name="shape"
              value={settings.shape}
              onChange={handleChange}
            >
              <option value="none">None</option>
              <option value="circle">Circle</option>
              <option value="square">Square</option>
              <option value="rectangle">Rectangle</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Shape Image</Label>
            <BackgroundPreviewContainer>
              {imageOptions.map((image, index) => (
                <BackgroundPreview 
                  key={index}
                  src={image.path || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%23f5f5f5"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="%23999" text-anchor="middle" dominant-baseline="middle">None</text></svg>'}
                  selected={settings.shapeImage === image.path}
                  onClick={() => handleShapeImageSelect(image.path)}
                  title={image.name}
                />
              ))}
            </BackgroundPreviewContainer>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="shapeColor">Shape Color (when no image)</Label>
            <ColorInput
              type="color"
              id="shapeColor"
              name="shapeColor"
              value={settings.shapeColor}
              onChange={handleChange}
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="shapeSize">Shape Size</Label>
            <SliderContainer>
              <Input
                type="range"
                id="shapeSize"
                name="shapeSize"
                min="30"
                max="100"
                value={settings.shapeSize || 80}
                onChange={handleChange}
              />
              <SliderValue>{settings.shapeSize || 80}%</SliderValue>
            </SliderContainer>
          </FormGroup>
        </SectionContent>
      </FormSection>
    </GeneratorContainer>
  );
}

export default BannerGenerator;
