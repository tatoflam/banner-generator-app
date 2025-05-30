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

function AIRefiner({ bannerRef, onRefinementComplete, settings }) {
  const [apiKey, setApiKey] = useState('');
  const [userPrompt, setUserPrompt] = useState('Enhance this image by making it more artistic. Maintain the original style and colors but dramatically improve the overall quality and visual appeal. Keep the text with some modifications.');
  const [isRefining, setIsRefining] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const refineWithAI = async () => {
    if (!apiKey) {
      setMessage('Please enter your Stability AI API key');
      setMessageType('error');
      return;
    }

    try {
      setIsRefining(true);
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
      const fontFamily = computedStyle.fontFamily || 'Arial';
      const fontSize = computedStyle.fontSize || '48px';
      const fontColor = computedStyle.color || 'black';
      const backgroundColor = computedStyle.backgroundColor || 'transparent';
      
      // Create a detailed description of the current banner for the AI
      const bannerDescription = `
        The current banner has text "${bannerText}" with font family "${fontFamily}" 
        at size "${fontSize}" and color "${fontColor}" on a "${backgroundColor}" background.
        The banner dimensions are ${width}x${height} pixels.
        Please create an enhanced version of this image that maintains the same text and overall style,
        but with improved visual quality, better typography, and more attractive appearance.
      `;
      console.log('Banner description:', bannerDescription);
      
      // Combine the user prompt and banner description
      const enhancedPrompt = `${userPrompt}\n\nBanner details: ${bannerDescription}`;
      console.log('Enhanced prompt:', enhancedPrompt);
      console.log('User prompt being used:', userPrompt);
      
      // Convert data URL to Blob
      const fetchResponse = await fetch(dataUrl);
      const blob = await fetchResponse.blob();
      
      // Create a File object from the Blob
      const imageFile = new File([blob], 'banner.png', { type: 'image/png' });
      console.log('Created image file from data URL:', imageFile);
      
      // Function to make API request with retry logic
      const makeRequestWithRetry = async (retries = 3, delay = 2000) => {
        // Add a timeout promise to handle potential hanging requests
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timed out')), 30000); // 30 second timeout
        });
        
        for (let attempt = 0; attempt < retries; attempt++) {
          try {
            // Create FormData for the API request
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('text_prompts[0][text]', enhancedPrompt);
            formData.append('text_prompts[0][weight]', '1.0');
            
            // Log the form data being sent
            console.log('Form data being sent to API:');
            console.log('- text_prompts[0][text]:', enhancedPrompt);
            console.log('- text_prompts[0][weight]:', '1.0');
            
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
            const fetchPromise = fetch('https://api.stability.ai/v2beta/stable-image/edit/erase', requestOptions)
              .then(response => {
                if (!response.ok) {
                  return response.text().then(text => {
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
              const retryMessage = `Attempt ${attempt + 1} failed. Retrying in ${delay/1000} seconds...`;
              console.log(retryMessage);
              // Update the status message to inform the user about the retry
              setMessage(`Retrying... ${retryMessage}`);
              await new Promise(resolve => setTimeout(resolve, delay));
              // Exponential backoff - double the delay for the next attempt
              delay *= 2;
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
        // Only update the state if the image loads successfully
        onRefinementComplete(refinedImageUrl);
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
      
      <Label htmlFor="apiKey">Stability AI API Key</Label>
      <ApiKeyInput
        id="apiKey"
        type="password"
        placeholder="Enter your Stability AI API key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
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
