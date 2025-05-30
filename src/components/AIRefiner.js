import React, { useState } from 'react';
import styled from 'styled-components';
import OpenAI from 'openai';

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

function AIRefiner({ logoRef, onRefinementComplete }) {
  const [apiKey, setApiKey] = useState('');
  const [userPrompt, setUserPrompt] = useState('Enhance this image by making it more professional and polished. Maintain the original style and colors but improve the overall quality and visual appeal. Keep the text and its effect.');
  const [isRefining, setIsRefining] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const refineWithAI = async () => {
    if (!apiKey) {
      setMessage('Please enter your OpenAI API key');
      setMessageType('error');
      return;
    }

    try {
      setIsRefining(true);
      setMessage('Refining your logo with AI...');
      setMessageType('info');

      // Get the logo element - either from the ref or from the preview container
      let logoElement = logoRef.current;
      
      // If logoRef is not available (which happens when a refined image is already displayed),
      // we need to get the preview container instead
      if (!logoElement) {
        // Find the preview container by its class or structure
        const previewContainer = document.querySelector('.preview-area');
        if (previewContainer) {
          logoElement = previewContainer;
        } else {
          throw new Error('Logo element not found');
        }
      }

      // Import html-to-image dynamically
      const htmlToImage = await import('html-to-image');
      
      // Capture the logo as a data URL
      const dataUrl = await htmlToImage.toPng(logoElement);
      
      // Get the dimensions of the logo element
      const width = logoElement.clientWidth;
      const height = logoElement.clientHeight;
      
      // Analyze the logo to extract key characteristics
      // This will help us generate a similar logo with the same style
      const logoText = logoElement.innerText || 'Your Logo';
      const computedStyle = window.getComputedStyle(logoElement);
      const fontFamily = computedStyle.fontFamily || 'Arial';
      const fontSize = computedStyle.fontSize || '48px';
      const fontColor = computedStyle.color || 'black';
      const backgroundColor = computedStyle.backgroundColor || 'transparent';
      
      // Create a detailed description of the current logo for the AI
      const logoDescription = `
        The current logo has text "${logoText}" with font family "${fontFamily}" 
        at size "${fontSize}" and color "${fontColor}" on a "${backgroundColor}" background.
        The logo dimensions are ${width}x${height} pixels.
        Please create an enhanced version of this image that maintains the same text and overall style,
        but with improved visual quality, better typography, and more attractive appearance.
      `;
      
      // Initialize OpenAI client
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Note: In production, you should use a backend proxy
      });

      // System prompt to guide the AI behavior
      const systemPrompt = "You are an expert illust designer. Edit the provided image according to the user's instructions while preserving the original style and dimensions. Focus on enhancing the existing design rather than creating something completely new except the text and its effect.";
      
      // Combine system prompt with user prompt
      const fullPrompt = `${systemPrompt}\n\nUser request: ${userPrompt}`;
      
      // Determine the appropriate size for the API
      // OpenAI API requires specific sizes
      let apiSize;
      if (Math.max(width, height) <= 512) {
        apiSize = "512x512";
      } else {
        apiSize = "1024x1024";
      }
      
      console.log('Sending request to OpenAI with:', {
        logoDescription,
        apiSize,
        promptLength: fullPrompt.length
      });
      
      // Call OpenAI API to generate a new logo based on the description and user prompt
      try {
        // Combine the system prompt, user prompt, and logo description
        const enhancedPrompt = `${fullPrompt}\n\nLogo details: ${logoDescription}`;
        
        // Function to make API request with retry logic
        const makeRequestWithRetry = async (retries = 3, delay = 2000) => {
          // Add a timeout promise to handle potential hanging requests
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), 30000); // 30 second timeout
          });
          
          for (let attempt = 0; attempt < retries; attempt++) {
            try {
              // Use the OpenAI SDK to generate a new image with timeout
              const generateImagePromise = openai.images.generate({
                prompt: enhancedPrompt,
                n: 1,
                size: apiSize,
                response_format: "url",
              });
              
              // Race the API call against the timeout
              return await Promise.race([generateImagePromise, timeoutPromise]);
            } catch (error) {
              // If this is the last attempt, throw the error
              if (attempt === retries - 1) {
                throw error;
              }
              
              // If the error is due to insufficient resources, wait and retry
              if (error.message && error.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
                const retryMessage = `Attempt ${attempt + 1} failed with insufficient resources. Retrying in ${delay/1000} seconds...`;
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
        
        console.log('OpenAI API response:', response);
        
        // Get the refined image URL
        const refinedImageUrl = response.data[0].url;
        
        // Pass the refined image URL to the parent component
        onRefinementComplete(refinedImageUrl);
        
        setMessage('Logo successfully refined!');
        setMessageType('success');
      } catch (apiError) {
        console.error('OpenAI API Error:', apiError);
        let errorMessage = apiError.message || 'Failed to refine logo';
        
        // Check for specific API errors
        if (apiError.response) {
          errorMessage = `API Error: ${apiError.response.status} - ${JSON.stringify(apiError.response.data)}`;
        }
        
        // Handle specific error types
        if (apiError.message && apiError.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
          errorMessage = 'Insufficient resources error. This may be due to high server load or rate limiting. Please try again later.';
        } else if (apiError.message && apiError.message.includes('timeout')) {
          errorMessage = 'The request timed out. Please check your internet connection and try again.';
        } else if (apiError.message && apiError.message.includes('network')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        }
        
        setMessage(`Error: ${errorMessage}`);
        setMessageType('error');
        console.error('Detailed error:', apiError);
      }

    } catch (error) {
      console.error('Error refining logo:', error);
      setMessage(`Error: ${error.message || 'Failed to refine logo'}`);
      setMessageType('error');
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <RefinerContainer>
      <h2>AI Logo Refinement</h2>
      <p>Use OpenAI to enhance and refine your logo design.</p>
      
      <Label htmlFor="apiKey">OpenAI API Key</Label>
      <ApiKeyInput
        id="apiKey"
        type="password"
        placeholder="Enter your OpenAI API key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      
      <Label htmlFor="userPrompt">Refinement Instructions</Label>
      <PromptTextarea
        id="userPrompt"
        placeholder="Describe how you want the AI to refine your logo..."
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
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
