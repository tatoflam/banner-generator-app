import React, { useState } from 'react';
import styled from 'styled-components';

const RefinerContainer = styled.div`
  background-color: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  
  &:hover {
    background-color: #45a049;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
  background-color: ${props => props.type === 'error' ? '#ffebee' : '#e8f5e9'};
  color: ${props => props.type === 'error' ? '#c62828' : '#2e7d32'};
  display: ${props => props.message ? 'block' : 'none'};
`;

const ApiKeyInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  background-color: ${props => props.$error ? '#fab4b4' : 'white'};
`;

const PromptTextarea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: Arial, sans-serif;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

// Helper function to resize an image to the required dimensions
const resizeImage = (dataUrl, targetWidth, targetHeight) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Create a canvas with the target dimensions
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      
      // Fill the canvas with the background color (white)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      
      // Calculate dimensions to maintain aspect ratio
      const originalAspect = img.width / img.height;
      const targetAspect = targetWidth / targetHeight;
      
      let drawWidth, drawHeight, offsetX, offsetY;
      
      if (originalAspect > targetAspect) {
        // Original image is wider than target
        drawWidth = targetWidth;
        drawHeight = targetWidth / originalAspect;
        offsetX = 0;
        offsetY = (targetHeight - drawHeight) / 2;
      } else {
        // Original image is taller than target
        drawHeight = targetHeight;
        drawWidth = targetHeight * originalAspect;
        offsetX = (targetWidth - drawWidth) / 2;
        offsetY = 0;
      }
      
      // Draw the image centered on the canvas
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      
      // Convert canvas to data URL
      const resizedDataUrl = canvas.toDataURL('image/png');
      resolve(resizedDataUrl);
    };
    
    img.onerror = (error) => {
      reject(error);
    };
    
    img.src = dataUrl;
  });
};

const StylePresetSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-family: Arial, sans-serif;
`;

const StylePresetOption = styled.option`
  padding: 0.5rem;
`;

function AIRefiner({ bannerRef, onRefinementComplete, settings }) {
  // Read API key from environment variable if available
  const defaultApiKey = process.env.REACT_APP_STABILITY_API_KEY || '';
  const [apiKey, setApiKey] = useState(defaultApiKey);
  const [apiKeyError, setApiKeyError] = useState(false);
  const [userPrompt, setUserPrompt] = useState('Make the river attractive with extraordinary big fish, frogs, Dinosaur, Japanese children from 6 to 9 years old putting on purple T-shirt. Transform this image into an abstract art style. Use bold colors, geometric shapes, and artistic patterns while maintaining the overall theme. Make it visually striking and modern. Keep the text readable but integrate it artistically into the design.');
  const [negativePrompt, setNegativePrompt] = useState('Do not draw totally different character, maintain the original text and theme, avoid blurry or distorted text, no watermarks, no signatures. If there is no text in the image, do not include any text in generated image.');
  const [stylePreset, setStylePreset] = useState('anime');
  const [strength, setStrength] = useState(39);
  const [isRefining, setIsRefining] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  // Available style presets for Stability AI
  const stylePresets = [
    { value: '3d-model', label: '3D Model' },
    { value: 'analog-film', label: 'Analog Film' },
    { value: 'anime', label: 'Anime' },
    { value: 'cinematic', label: 'Cinematic' },
    { value: 'comic-book', label: 'Comic Book' },
    { value: 'digital-art', label: 'Digital Art' },
    { value: 'enhance', label: 'Enhance' },
    { value: 'fantasy-art', label: 'Fantasy Art' },
    { value: 'isometric', label: 'Isometric' },
    { value: 'line-art', label: 'Line Art' },
    { value: 'low-poly', label: 'Low Poly' },
    { value: 'modeling-compound', label: 'Modeling Compound' },
    { value: 'neon-punk', label: 'Neon Punk' },
    { value: 'origami', label: 'Origami' },
    { value: 'photographic', label: 'Photographic' },
    { value: 'pixel-art', label: 'Pixel Art' },
    { value: 'tile-texture', label: 'Tile Texture' }
  ];

  const refineWithAI = async () => {
    console.log('Refine with AI button clicked');
    console.log('Current API key:', apiKey);
    
    if (!apiKey) {
      console.error('No API key provided');
      setMessage('Please enter your Stability AI API key');
      setMessageType('error');
      setApiKeyError(true);
      alert('Please enter your Stability AI API key');
      return;
    }
    
    // Reset API key error state
    setApiKeyError(false);

    try {
      setIsRefining(true);
      setMessage('Validating API key...');
      setMessageType('info');
      
      // Validate the API key before proceeding
      try {
        // Make a simple request to validate the API key
        const headers = new Headers();
        headers.append('Authorization', `Bearer ${apiKey}`);
        headers.append('Accept', 'application/json');
        
        const validateResponse = await fetch('https://api.stability.ai/v1/user/account', {
          method: 'GET',
          headers: headers
        });
        
        if (!validateResponse.ok) {
          const errorText = await validateResponse.text();
          console.error('API key validation failed:', errorText);
          throw new Error(`API key validation failed: ${validateResponse.status} - ${errorText}`);
        }
        
        // API key is valid, continue with the refinement process
        console.log('API key validated successfully');
      } catch (validationError) {
        console.error('API key validation error:', validationError);
        setMessage('Invalid Stability AI API key');
        setMessageType('error');
        setApiKeyError(true);
        alert('Invalid Stability AI API key. Please check your API key and try again.');
        setIsRefining(false);
        return;
      }
      
      setMessage('Refining your banner with AI...');
      setMessageType('info');

      console.log('Starting AI refinement process');
      console.log('Banner ref:', bannerRef);
      
      // Always get the preview area container for consistent dimensions
      const previewContainer = document.querySelector('.preview-area');
      console.log('Found preview container:', previewContainer);
      
      if (!previewContainer) {
        console.error('Preview container not found');
        throw new Error('Preview container not found');
      }
      
      // Get the actual dimensions from the settings if available
      const customDimensions = previewContainer.getAttribute('style') && 
                              previewContainer.getAttribute('style').includes('width') && 
                              previewContainer.getAttribute('style').includes('height');
      
      console.log('Custom dimensions detected:', customDimensions);
      
      // Use the preview container for capturing
      let bannerElement = previewContainer;
      
      console.log('Using banner element:', bannerElement);
      console.log('Banner element style:', bannerElement.getAttribute('style'));
      console.log('Banner element computed style width:', window.getComputedStyle(bannerElement).width);
      console.log('Banner element computed style height:', window.getComputedStyle(bannerElement).height);
      
      // Now that the API key is validated, ask if we should include text in the refinement
      const includeText = window.confirm('Include text in the refinement? Click OK to include text, or Cancel to refine only the background.');
      
      // Store references to text elements that might be hidden
      const textElements = bannerElement.querySelectorAll('.banner-text');
      
      // If we're not including text, temporarily hide it
      if (!includeText) {
        textElements.forEach(el => {
          el.dataset.originalDisplay = el.style.display || '';
          el.style.display = 'none';
        });
      }

      // Import html-to-image dynamically
      console.log('Importing html-to-image');
      const htmlToImage = await import('html-to-image');
      
      // Capture the banner as a data URL - ensure we capture exactly what's shown in the preview
      console.log('Capturing banner as PNG');
      
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
          backgroundPosition: 'center'
        },
        // Use the exact dimensions of the banner element
        width: bannerElement.clientWidth,
        height: bannerElement.clientHeight,
        // Suppress console errors during capture
        onclone: (clonedDoc) => {
          // Add a style to ensure text renders correctly even with skipFonts: true
          const style = clonedDoc.createElement('style');
          style.innerHTML = `
            * {
              font-family: ${settings.fontFamily || 'Arial, sans-serif'} !important;
              box-sizing: border-box;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      };
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
        dataUrl = await htmlToImage.toPng(bannerElement, captureOptions);
        console.log('Banner captured as data URL:', dataUrl.substring(0, 50) + '...');
      } finally {
        // Restore console.error
        console.error = originalConsoleError;
        
        // Restore any hidden text elements
        if (!includeText) {
          textElements.forEach(el => {
            el.style.display = el.dataset.originalDisplay;
          });
        }
      }
      
      // Debug: Log the banner element and its contents
      console.log('Banner element:', bannerElement);
      console.log('Banner element innerHTML:', bannerElement.innerHTML);
      console.log('Banner element children:', bannerElement.children);
      
      // Get the dimensions of the banner element
      let width, height;
      
      // If settings are available and custom dimensions are enabled, use those dimensions
      if (settings && settings.customBackgroundDimensions) {
        width = settings.backgroundWidth;
        height = settings.backgroundHeight;
        console.log('Using custom dimensions from settings:', width, 'x', height);
      } else {
        // Otherwise use the client dimensions
        width = bannerElement.clientWidth;
        height = bannerElement.clientHeight;
        console.log('Using client dimensions:', width, 'x', height);
      }
      
      console.log('Banner dimensions:', width, 'x', height);
      
      // Analyze the banner to extract key characteristics
      // This will help us generate a similar banner with the same style
      const bannerText = bannerElement.innerText || 'Your Banner';
      const computedStyle = window.getComputedStyle(bannerElement);
      const fontFamily = computedStyle.fontFamily || 'Zen Maru Gothic';
      const fontSize = computedStyle.fontSize || '48px';
      const fontColor = computedStyle.color || 'black';
      const backgroundColor = computedStyle.backgroundColor || 'transparent';
      
      // Create a detailed description of the current banner for the AI
      const bannerDescription = `
        The current banner has text "${bannerText}" with font family "${fontFamily}" 
        at size "${fontSize}" and color "${fontColor}" on a "${backgroundColor}" background.
        The banner dimensions are ${width}x${height} pixels.
        Please create an enhanced version of this image that maintains the same text content and overall style,
        but with improved visual quality, better typography, and more attractive appearance.
        The text should be readable with the specified banner text character with bold style and the image should be visually appealing.
      `;
      console.log('Banner description:', bannerDescription);
      
      // Combine the user prompt and banner description
      const enhancedPrompt = `${userPrompt}\n\nBanner details: ${bannerDescription}`;
      console.log('Enhanced prompt:', enhancedPrompt);
      console.log('User prompt being used:', userPrompt);
      
      // Convert data URL to Blob (not used directly, but kept for reference)
      const fetchResponse = await fetch(dataUrl);
      await fetchResponse.blob(); // We don't need to store this since we're using resizedBlob later
      
      // Calculate dimensions that maintain aspect ratio but meet minimum pixel requirements
      // The API requires at least 262,144 pixels (e.g., 512x512)
      const minTotalPixels = 262144; // 512x512
      const originalAspectRatio = width / height;
      
      let targetWidth, targetHeight;
      
      if (originalAspectRatio >= 1) {
        // Landscape or square image
        targetHeight = Math.sqrt(minTotalPixels / originalAspectRatio);
        targetWidth = targetHeight * originalAspectRatio;
      } else {
        // Portrait image
        targetWidth = Math.sqrt(minTotalPixels * originalAspectRatio);
        targetHeight = targetWidth / originalAspectRatio;
      }
      
      // Ensure dimensions are integers and meet minimum requirements
      targetWidth = Math.max(Math.ceil(targetWidth), 512);
      targetHeight = Math.max(Math.ceil(targetHeight), 512);
      
      console.log(`Resizing image to maintain aspect ratio: ${width}x${height} -> ${targetWidth}x${targetHeight}`);
      const resizedImageUrl = await resizeImage(dataUrl, targetWidth, targetHeight);
      
      // Store the original dimensions for logging purposes
      console.log(`Original dimensions: ${width}x${height}, aspect ratio: ${originalAspectRatio}`);
      
      // Convert resized image to Blob
      const resizedFetchResponse = await fetch(resizedImageUrl);
      const resizedBlob = await resizedFetchResponse.blob();
      
      // Create a File object from the resized Blob
      const imageFile = new File([resizedBlob], 'banner.png', { type: 'image/png' });
      console.log(`Created resized image file from data URL (${targetWidth}x${targetHeight}):`, imageFile);
      
      // Function to make API request with retry logic
      const makeRequestWithRetry = async (retries = 3, initialDelay = 2000) => {
        // Add a timeout promise to handle potential hanging requests
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timed out')), 30000); // 30 second timeout
        });
        
        let currentDelay = initialDelay;
        
        for (let attempt = 0; attempt < retries; attempt++) {
          try {
            // Convert strength percentage to API value (0-1 range)
            const strengthValue = (strength / 100).toFixed(2);
            console.log(`Converting strength slider value ${strength}% to API value ${strengthValue}`);
            
            // Create FormData for the API request
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('prompt', enhancedPrompt);
            formData.append('negative_prompt', negativePrompt);
            formData.append('strength', strengthValue); // Using the value from the slider
            formData.append('cfg_scale', '15'); // Higher value makes the image adhere more to the prompt
            formData.append('style_preset', stylePreset);
            formData.append('steps', '40'); // More steps for higher quality
            
            // Log the form data being sent
            console.log('Form data being sent to API:');
            console.log('- prompt:', enhancedPrompt);
            console.log('- negative_prompt:', negativePrompt);
            console.log('- strength:', strengthValue);
            console.log('- cfg_scale:', '15');
            console.log('- style_preset:', stylePreset);
            console.log('- steps:', '40');
            
            // Create headers with API key
            const headers = new Headers();
            headers.append('Authorization', `Bearer ${apiKey}`);
            headers.append('Accept', 'application/json');
            
            // Create request options
            const requestOptions = {
              method: 'POST',
              headers: headers,
              body: formData,
              redirect: 'follow'
            };
            
            console.log('Sending request to Stability AI API (attempt', attempt + 1, ')');
            
            // Make the fetch request with timeout
            // Use the v2beta stable-image/generate/ultra endpoint for better results
            const fetchPromise = fetch('https://api.stability.ai/v2beta/stable-image/generate/ultra', requestOptions)
              .then(response => {
                if (!response.ok) {
                  return response.text().then(text => {
                    // Check for API key validation errors
                    if (response.status === 401 || text.includes('unauthorized') || text.includes('invalid key')) {
                      setApiKeyError(true);
                      alert('Invalid Stability AI API key. Please check your API key and try again.');
                    }
                    throw new Error(`API Error: ${response.status} - ${text}`);
                  });
                }
                return response.json();
              });
            
            // Race the API call against the timeout
            const response = await Promise.race([fetchPromise, timeoutPromise]);
            console.log('Stability AI API response:', response);
            return response;
          } catch (error) {
            console.error('API request error:', error);
            
            // If this is the last attempt, throw the error
            if (attempt === retries - 1) {
              throw error;
            }
            
            // If the error is due to rate limiting or server issues, wait and retry
            if (error.message && (
                error.message.includes('429') || 
                error.message.includes('rate limit') ||
                error.message.includes('500') ||
                error.message.includes('503')
              )) {
              // Capture the current delay value to avoid the ESLint no-loop-func warning
              const delayForThisAttempt = currentDelay;
              const retryMessage = `Attempt ${attempt + 1} failed. Retrying in ${delayForThisAttempt/1000} seconds...`;
              console.log(retryMessage);
              // Update the status message to inform the user about the retry
              setMessage(`Retrying... ${retryMessage}`);
              await new Promise(resolve => setTimeout(resolve, delayForThisAttempt));
              // Exponential backoff - double the delay for the next attempt
              currentDelay *= 2;
            } else {
              // For other errors, don't retry
              throw error;
            }
          }
        }
      };
      
      // Make the request with retry logic
      const response = await makeRequestWithRetry();
      
      // Get the refined image URL from the response
      // The structure of the response depends on the Stability AI API
      console.log('Parsing Stability AI API response:', JSON.stringify(response));
      
      // Check for different possible response structures
      let refinedImageUrl;
      
      if (response && response.artifacts && response.artifacts.length > 0) {
        // Standard Stability AI v1 response format
        const base64Image = response.artifacts[0].base64;
        refinedImageUrl = `data:image/png;base64,${base64Image}`;
        console.log('Found image in artifacts array (base64 format)');
      } else if (response && response.images && response.images.length > 0) {
        // URL format response
        refinedImageUrl = response.images[0].url;
        console.log('Found image in images array (URL format)');
      } else if (response && response.output && response.output.length > 0) {
        // Another possible format
        refinedImageUrl = response.output[0];
        console.log('Found image in output array');
      } else if (response && response.result && response.result.images && response.result.images.length > 0) {
        // Yet another possible format
        refinedImageUrl = response.result.images[0].url || `data:image/png;base64,${response.result.images[0].base64}`;
        console.log('Found image in result.images array');
      } else if (response && typeof response === 'string' && (response.startsWith('http') || response.startsWith('data:'))) {
        // Direct URL or data URL response
        refinedImageUrl = response;
        console.log('Response is directly a URL or data URL');
      } else if (response && response.image && response.finish_reason) {
        // New Stability AI v2 response format with direct image property
        const base64Image = response.image;
        refinedImageUrl = `data:image/png;base64,${base64Image}`;
        console.log('Found image in direct image property (base64 format)');
      } else {
        console.error('Unexpected API response structure:', response);
        throw new Error('No image data received from Stability AI API. Unexpected response structure.');
      }
      console.log('Received refined image URL:', refinedImageUrl);
      
      // Test if the image can be loaded (to catch CORS issues early)
      try {
        console.log('Testing if refined image can be loaded...');
        const testImg = new Image();
        testImg.crossOrigin = 'Anonymous';
        
        await new Promise((resolve, reject) => {
          testImg.onload = () => {
            console.log('Refined image loaded successfully in test');
            resolve();
          };
          testImg.onerror = (e) => {
            console.error('Error loading refined image in test:', e);
            // We'll still continue even if there's an error, as the actual rendering might work
            resolve();
          };
          testImg.src = refinedImageUrl;
        });
      } catch (testError) {
        console.warn('Test loading of refined image failed, but continuing:', testError);
      }
      
      // Pass the refined image URL to the parent component
      console.log('Calling onRefinementComplete with refined image URL');
      
      // Ensure the refinedImageUrl is properly formatted
      if (refinedImageUrl && !refinedImageUrl.startsWith('data:image/') && !refinedImageUrl.startsWith('http')) {
        // If it's just a base64 string without the data URL prefix, add it
        refinedImageUrl = `data:image/png;base64,${refinedImageUrl}`;
        console.log('Added data URL prefix to refined image URL');
      }
      
      // Create a test image to verify the URL works
      const verifyImg = new Image();
      verifyImg.onload = () => {
        console.log('Verified refined image URL works, updating state');
        
        // Create a canvas to resize the image to match the preview dimensions
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Get the preview area dimensions
        const previewArea = document.querySelector('.preview-area');
        if (!previewArea) {
          console.error('Preview area not found');
          onRefinementComplete(refinedImageUrl);
          return;
        }
        
        const width = previewArea.clientWidth;
        const height = previewArea.clientHeight;
        
        // Set canvas dimensions to match the preview area
        canvas.width = width;
        canvas.height = height;
        
        // Draw the image on the canvas, maintaining aspect ratio
        const imgAspect = verifyImg.width / verifyImg.height;
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
        
        // Fill the canvas with the background color
        ctx.fillStyle = settings.backgroundColor || '#ffffff';
        ctx.fillRect(0, 0, width, height);
        
        // Draw the image centered on the canvas
        ctx.drawImage(verifyImg, offsetX, offsetY, drawWidth, drawHeight);
        
        // Convert canvas to data URL
        const resizedImageUrl = canvas.toDataURL('image/png');
        
        // Only update the state if the image loads successfully
        onRefinementComplete(resizedImageUrl);
      };
      verifyImg.onerror = (e) => {
        console.error('Error verifying refined image URL:', e);
        alert('The refined image could not be loaded. Please try again.');
        setMessage('Error: The refined image could not be loaded. Please try again.');
        setMessageType('error');
      };
      verifyImg.src = refinedImageUrl;
      
      setMessage('Banner successfully refined!');
      setMessageType('success');
    } catch (error) {
      console.error('Error refining banner:', error);
      let errorMessage = error.message || 'Failed to refine banner';
      
      // Handle specific error types
      if (errorMessage.includes('429')) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      } else if (errorMessage.includes('timeout')) {
        errorMessage = 'The request timed out. Please check your internet connection and try again.';
      } else if (errorMessage.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (errorMessage.includes('401') || errorMessage.includes('unauthorized') || errorMessage.includes('invalid key')) {
        errorMessage = 'Invalid API key. Please check your Stability AI API key and try again.';
        setApiKeyError(true);
        alert('Invalid Stability AI API key. Please check your API key and try again.');
      }
      
      setMessage(`Error: ${errorMessage}`);
      setMessageType('error');
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <RefinerContainer>
      <h2>AI Banner Refinement</h2>
      <p>Use Stability AI to enhance and refine your banner design.</p>
      
      <Label htmlFor="apiKey">
        Stability AI API Key{' '}
        <a 
          href="https://platform.stability.ai/" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#2196F3' }}
        >
          Stability AI API?
        </a>
      </Label>
      <ApiKeyInput
        id="apiKey"
        type="password"
        placeholder="Enter your Stability AI API key"
        value={apiKey}
        onChange={(e) => {
          setApiKey(e.target.value);
          if (apiKeyError) setApiKeyError(false);
        }}
        $error={apiKeyError}
      />
      
      <Label htmlFor="userPrompt">Refinement Instructions</Label>
      <PromptTextarea
        id="userPrompt"
        placeholder="Describe how you want the AI to refine your banner..."
        value={userPrompt}
        onChange={(e) => {
          console.log('Updating user prompt to:', e.target.value);
          setUserPrompt(e.target.value);
        }}
      />
      
      <Label htmlFor="negativePrompt">Negative Prompt (what to avoid)</Label>
      <PromptTextarea
        id="negativePrompt"
        placeholder="Describe what you want the AI to avoid in the refinement..."
        value={negativePrompt}
        onChange={(e) => {
          console.log('Updating negative prompt to:', e.target.value);
          setNegativePrompt(e.target.value);
        }}
      />
      
      <Label htmlFor="stylePreset">Style Preset</Label>
      <StylePresetSelect
        id="stylePreset"
        value={stylePreset}
        onChange={(e) => {
          console.log('Updating style preset to:', e.target.value);
          setStylePreset(e.target.value);
        }}
      >
        {stylePresets.map(preset => (
          <StylePresetOption key={preset.value} value={preset.value}>
            {preset.label}
          </StylePresetOption>
        ))}
      </StylePresetSelect>
      
      <Label htmlFor="strength">Transformation Strength: {strength}%</Label>
      <input
        type="range"
        id="strength"
        min="1"
        max="100"
        value={strength}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          console.log('Updating strength to:', value);
          setStrength(value);
        }}
        style={{ width: '100%', marginBottom: '1rem' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.8rem', color: '#666' }}>
        <span>Subtle Changes</span>
        <span>Dramatic Changes</span>
      </div>
      
      <Button 
        onClick={refineWithAI} 
        disabled={isRefining}
      >
        {isRefining ? 'Refining...' : 'Refine with AI'}
      </Button>
      
      {message && (
        <StatusMessage type={messageType}>
          {message}
        </StatusMessage>
      )}
    </RefinerContainer>
  );
}

export default AIRefiner;
