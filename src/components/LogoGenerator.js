import React from 'react';
import styled from 'styled-components';

const GeneratorContainer = styled.div`
  background-color: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
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

function LogoGenerator({ settings, onSettingsChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onSettingsChange({ [name]: value });
  };

  return (
    <GeneratorContainer>
      <h2>Logo Settings</h2>
      
      <FormGroup>
        <Label htmlFor="text">Logo Text</Label>
        <Input
          type="text"
          id="text"
          name="text"
          value={settings.text}
          onChange={handleChange}
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="fontFamily">Font Family</Label>
        <Select
          id="fontFamily"
          name="fontFamily"
          value={settings.fontFamily}
          onChange={handleChange}
        >
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
        </Select>
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="fontSize">Font Size</Label>
        <Input
          type="range"
          id="fontSize"
          name="fontSize"
          min="12"
          max="72"
          value={settings.fontSize}
          onChange={handleChange}
        />
        <span>{settings.fontSize}px</span>
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
        <Label htmlFor="shapeColor">Shape Color</Label>
        <ColorInput
          type="color"
          id="shapeColor"
          name="shapeColor"
          value={settings.shapeColor}
          onChange={handleChange}
        />
      </FormGroup>
    </GeneratorContainer>
  );
}

export default LogoGenerator;
