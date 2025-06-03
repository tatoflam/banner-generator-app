import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styles from '../styles/BannerGenerator.module.css';

function BannerGenerator({ settings, onSettingsChange }) {
  const [imageOptions, setImageOptions] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    background: false,
    position: false,
    text: true,
    subtitle: false,
    subtitlePosition: false,
    shape: false
  });
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Known image files that exist in the directory
  const knownFiles = [
    'spring.png',
    'summer.png',
    'autumn.png',
    'winter.png',
    'nogawa.png',
    'ignore_2025koryukai.png'
  ];
  
  useEffect(() => {
    // Start with 'None' option
    const images = [{ name: 'None', path: null }];
    
    // Function to format the display name from a filename
    const formatDisplayName = (filename) => {
      // Remove file extension
      let name = filename.replace(/\.[^/.]+$/, '');
            
      // Replace hyphens and underscores with spaces
      name = name.replace(/[-_]/g, ' ');
      
      // Capitalize each word
      return name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    // Dynamically fetch and process background images
    const fetchBackgroundImages = async () => {
      try {
        // The directory path where background images are stored
        const bgDirPath = `${process.env.PUBLIC_URL}/assets/image/bg`;
        
        // Try to fetch the directory to see what files are available
        const response = await fetch(bgDirPath);
        
        // If we can't access the directory directly, use a fallback approach
        if (!response.ok) {
          // Process each known file
          const imagePromises = knownFiles.map(async (filename) => {
            try {
              // Check if the file exists by trying to fetch it
              const fileResponse = await fetch(`${bgDirPath}/${filename}`);
              if (fileResponse.ok) {
                return {
                  name: formatDisplayName(filename),
                  path: `${bgDirPath}/${filename}`
                };
              }
              return null;
            } catch (error) {
              console.warn(`Failed to check file ${filename}:`, error);
              return null;
            }
          });
          
          // Wait for all file checks to complete
          const validImages = (await Promise.all(imagePromises))
            .filter(img => img !== null);
          
          // Update state with the valid images
          setImageOptions([...images, ...validImages]);
        } else {
          // If we can access the directory (unlikely in browser), parse the response
          // This would require server-side support or a directory listing
          console.warn('Directory listing not supported in browser. Using fallback method.');
          
          const fallbackImages = knownFiles.map(filename => ({
            name: formatDisplayName(filename),
            path: `${bgDirPath}/${filename}`
          }));
          
          setImageOptions([...images, ...fallbackImages]);
        }
      } catch (error) {
        console.error('Error fetching background images:', error);
        
        // Fallback to known files if there's an error
        const bgDirPath = `${process.env.PUBLIC_URL}/assets/image/bg`;
        
        const fallbackImages = knownFiles.map(filename => ({
          name: formatDisplayName(filename),
          path: `${bgDirPath}/${filename}`
        }));
        
        setImageOptions([...images, ...fallbackImages]);
      }
    };
    
    // Execute the fetch function
    fetchBackgroundImages();
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
    <div className={styles.generatorContainer}>
      <h2>Banner Settings</h2>
      
      {/* 1. Background */}
      <div className={styles.formSection}>
        <div className={styles.sectionHeader} onClick={() => toggleSection('background')}>
          <div className={styles.sectionTitle}>Background</div>
          <span className={styles.chevronIcon}>
            {expandedSections.background ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </div>
        
        <div className={expandedSections.background ? styles.sectionContent : styles.sectionContentHidden}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="backgroundColor">Background Color</label>
            <input
              className={styles.colorInput}
              type="color"
              id="backgroundColor"
              name="backgroundColor"
              value={settings.backgroundColor}
              onChange={handleChange}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Background Image</label>
            <div className={styles.backgroundPreviewContainer}>
              {imageOptions.map((image, index) => (
                <div 
                  key={index}
                  className={`${styles.backgroundPreview} ${settings.backgroundImage === image.path ? styles.backgroundPreviewSelected : ''}`}
                  style={{
                    backgroundImage: image.path ? `url(${image.path})` : 'url(data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%23f5f5f5"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="%23999" text-anchor="middle" dominant-baseline="middle">None</text></svg>)'
                  }}
                  onClick={() => handleBackgroundSelect(image.path)}
                  title={image.name}
                />
              ))}
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="backgroundSize">Background Size (Crop)</label>
            <div className={styles.sliderContainer}>
              <input
                className={styles.input}
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
              <span className={styles.sliderValue}>{settings.backgroundSize || 100}%</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <div className={styles.checkboxContainer}>
              <input
                className={styles.checkbox}
                type="checkbox"
                id="showTextOnBackground"
                name="showTextOnBackground"
                checked={settings.showTextOnBackground !== false}
                onChange={(e) => {
                  onSettingsChange({ showTextOnBackground: e.target.checked });
                }}
              />
              <label className={styles.checkboxLabel} htmlFor="showTextOnBackground">Show Text on Background</label>
            </div>
            <div className={styles.checkboxDescription}>
              Uncheck to create a background without text, then add text later
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <div className={styles.checkboxContainer}>
              <input
                className={styles.checkbox}
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
              />
              <label className={styles.checkboxLabel} htmlFor="customBackgroundDimensions">Custom Background Dimensions</label>
            </div>
            
            {settings.customBackgroundDimensions && (
              <div className={styles.customDimensionsContainer}>
                <div className={styles.dimensionControl}>
                  <label 
                    className={styles.dimensionLabel}
                    htmlFor="backgroundWidth"
                  >
                    Width (px): {settings.backgroundWidth || 400}
                  </label>
                  <div className={styles.dimensionSliderContainer}>
                    <input
                      className={styles.input}
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
                    />
                  </div>
                </div>
                <div className={styles.dimensionControl}>
                  <label 
                    className={styles.dimensionLabel}
                    htmlFor="backgroundHeight"
                  >
                    Height (px): {settings.backgroundHeight || 400}
                  </label>
                  <div className={styles.dimensionSliderContainer}>
                    <input
                      className={styles.input}
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
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Banner Title */}
      <div className={styles.formSection}>
        <div className={styles.sectionHeader} onClick={() => toggleSection('text')}>
          <div className={styles.sectionTitle}>Banner Title</div>
          <span className={styles.chevronIcon}>
            {expandedSections.text ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </div>
        <div className={expandedSections.text ? styles.sectionContent : styles.sectionContentHidden}>
          <div className={styles.formGroup}>
            <div className={styles.checkboxContainer}>
              <input
                className={styles.checkbox}
                type="checkbox"
                id="useBannerImage"
                name="useBannerImage"
                checked={settings.useBannerImage}
                onChange={(e) => {
                  onSettingsChange({ useBannerImage: e.target.checked });
                }}
              />
              <label className={styles.checkboxLabel} htmlFor="useBannerImage">Use Banner Image Instead of Text</label>
            </div>
            <div className={styles.checkboxDescription}>
              Check to use a banner image instead of text
            </div>
          </div>
          
          {/* Banner Text - only shown when not using banner image */}
          {!settings.useBannerImage && (
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="text">Banner Text</label>
              <input
                className={styles.input}
                type="text"
                id="text"
                name="text"
                value={settings.text}
                onChange={handleChange}
              />
            </div>
          )}
          
          
          {/* Font settings - only shown when not using banner image */}
          {!settings.useBannerImage && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="fontFamily">Font Family</label>
                <select
                  className={styles.select}
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
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="fontSize">Font Size</label>
                <div className={styles.sliderContainer}>
                  <input
                    className={styles.input}
                    type="range"
                    id="fontSize"
                    name="fontSize"
                    min="12"
                    max="72"
                    value={settings.fontSize}
                    onChange={handleChange}
                  />
                  <span className={styles.sliderValue}>{settings.fontSize}px</span>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="fontColor">Font Color</label>
                <input
                  className={styles.colorInput}
                  type="color"
                  id="fontColor"
                  name="fontColor"
                  value={settings.fontColor}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3. Banner Title Position & Size */}
      <div className={styles.formSection}>
        <div className={styles.sectionHeader} onClick={() => toggleSection('position')}>
          <div className={styles.sectionTitle}>Banner Title Position & Size</div>
          <span className={styles.chevronIcon}>
            {expandedSections.position ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </div>
        <div className={expandedSections.position ? styles.sectionContent : styles.sectionContentHidden}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="bannerScale">Banner Scale</label>
            <div className={styles.sliderContainer}>
              <input
                className={styles.input}
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
              <span className={styles.sliderValue}>{settings.bannerScale || 100}%</span>
            </div>
          </div>
        
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="bannerOffsetX">Horizontal Position</label>
            <div className={styles.sliderContainer}>
              <input
                className={styles.input}
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
              <span className={styles.sliderValue}>{settings.bannerOffsetX || 0}</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="bannerOffsetY">Vertical Position</label>
            <div className={styles.sliderContainer}>
              <input
                className={styles.input}
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
              <span className={styles.sliderValue}>{settings.bannerOffsetY || 0}</span>
            </div>
          </div>
        </div>
      </div>


      {/* 4. Banner Subtitle */}
      <div className={styles.formSection}>
        <div className={styles.sectionHeader} onClick={() => toggleSection('subtitle')}>
          <div className={styles.sectionTitle}>Banner Subtitle</div>
          <span className={styles.chevronIcon}>
            {expandedSections.subtitle ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </div>
        <div className={expandedSections.subtitle ? styles.sectionContent : styles.sectionContentHidden}>
          <div className={styles.formGroup}>
            <div className={styles.checkboxContainer}>
              <input
                className={styles.checkbox}
                type="checkbox"
                id="subtitleVisible"
                name="subtitleVisible"
                checked={settings.subtitleVisible}
                onChange={(e) => {
                  onSettingsChange({ subtitleVisible: e.target.checked });
                }}
              />
              <label className={styles.checkboxLabel} htmlFor="subtitleVisible">Show Subtitle</label>
            </div>
            
            {settings.subtitleVisible && (
              <>
                <label className={styles.label} htmlFor="subtitle">Subtitle Text (e.g., 第n回)</label>
                <input
                  className={styles.input}
                  type="text"
                  id="subtitle"
                  name="subtitle"
                  value={settings.subtitle}
                  onChange={handleChange}
                  placeholder="第1回"
                />
                
                <label className={styles.label} htmlFor="subtitleFontSize" style={{ marginTop: '0.5rem' }}>Subtitle Font Size</label>
                <div className={styles.sliderContainer}>
                  <input
                    className={styles.input}
                    type="range"
                    id="subtitleFontSize"
                    name="subtitleFontSize"
                    min="8"
                    max="36"
                    value={settings.subtitleFontSize}
                    onChange={handleChange}
                  />
                  <span className={styles.sliderValue}>{settings.subtitleFontSize}px</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 5. Banner Subtitle Position & Size */}
      <div className={styles.formSection}>
        <div className={styles.sectionHeader} onClick={() => toggleSection('subtitlePosition')}>
          <div className={styles.sectionTitle}>Banner Subtitle Position & Size</div>
          <span className={styles.chevronIcon}>
            {expandedSections.subtitlePosition ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </div>
        <div className={expandedSections.subtitlePosition ? styles.sectionContent : styles.sectionContentHidden}>
          {settings.subtitleVisible && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="subtitleOffsetX">Subtitle Horizontal Position</label>
                <div className={styles.sliderContainer}>
                  <input
                    className={styles.input}
                    type="range"
                    id="subtitleOffsetX"
                    name="subtitleOffsetX"
                    min="-50"
                    max="50"
                    value={settings.subtitleOffsetX || 0}
                    onChange={handleChange}
                  />
                  <span className={styles.sliderValue}>{settings.subtitleOffsetX || 0}</span>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="subtitleOffsetY">Subtitle Vertical Position</label>
                <div className={styles.sliderContainer}>
                  <input
                    className={styles.input}
                    type="range"
                    id="subtitleOffsetY"
                    name="subtitleOffsetY"
                    min="-50"
                    max="50"
                    value={settings.subtitleOffsetY || 0}
                    onChange={handleChange}
                  />
                  <span className={styles.sliderValue}>{settings.subtitleOffsetY || 0}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 6. Banner Title Background Shape */}
      <div className={styles.formSection}>
        <div className={styles.sectionHeader} onClick={() => toggleSection('shape')}>
          <div className={styles.sectionTitle}>Banner Title Background Shape</div>
          <span className={styles.chevronIcon}>
            {expandedSections.shape ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </div>
        <div className={expandedSections.shape ? styles.sectionContent : styles.sectionContentHidden}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="shape">Background Shape</label>
            <select
              className={styles.select}
              id="shape"
              name="shape"
              value={settings.shape}
              onChange={handleChange}
            >
              <option value="none">None</option>
              <option value="circle">Circle</option>
              <option value="square">Square</option>
              <option value="rectangle">Rectangle</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Shape Image</label>
            <div className={styles.backgroundPreviewContainer}>
              {imageOptions.map((image, index) => (
                <div 
                  key={index}
                  className={`${styles.backgroundPreview} ${settings.shapeImage === image.path ? styles.backgroundPreviewSelected : ''}`}
                  style={{
                    backgroundImage: image.path ? `url(${image.path})` : 'url(data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%23f5f5f5"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="%23999" text-anchor="middle" dominant-baseline="middle">None</text></svg>)'
                  }}
                  onClick={() => handleShapeImageSelect(image.path)}
                  title={image.name}
                />
              ))}
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="shapeColor">Shape Color (when no image)</label>
            <input
              className={styles.colorInput}
              type="color"
              id="shapeColor"
              name="shapeColor"
              value={settings.shapeColor}
              onChange={handleChange}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="shapeSize">Shape Size</label>
            <div className={styles.sliderContainer}>
              <input
                className={styles.input}
                type="range"
                id="shapeSize"
                name="shapeSize"
                min="30"
                max="100"
                value={settings.shapeSize || 80}
                onChange={handleChange}
              />
              <span className={styles.sliderValue}>{settings.shapeSize || 80}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BannerGenerator;
