import styled from 'styled-components';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  color: ${props => props.theme.colors.text.primary};
  font-weight: 500;
`;

const ColorInputContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ColorInput = styled.input`
  width: 60px;
  height: 40px;
  border: 2px solid ${props => props.theme.colors.border.default};
  border-radius: 8px;
  cursor: pointer;
  background: none;
  padding: 0;
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  &::-webkit-color-swatch {
    border: none;
    border-radius: 6px;
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.primary.main};
  }
`;

const HexInput = styled.input`
  flex: 1;
  background: ${props => props.theme.colors.input.background};
  color: ${props => props.theme.colors.input.textColor};
  border: 1px solid ${props => props.theme.colors.border.default};
  padding: 8px 12px;
  font-size: 14px;
  font-family: ${props => props.theme.typography.fontFamilies.body};
  border-radius: 8px;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary.main}22;
  }
`;

const PresetColors = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 4px;
`;

const PresetColor = styled.button<{ color: string; isSelected: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 2px solid ${props => props.isSelected ? props.theme.colors.primary.main : props.theme.colors.border.default};
  background: ${props => props.color};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    border-color: ${props => props.theme.colors.primary.main};
  }
`;

const PRESET_COLORS = [
  '#5A9AA8', '#C4DDE0', '#F5E6D3', '#D4A574', // Default
  '#6B8E23', '#98D8C8', '#F7DC6F', '#F1948A', // Green
  '#5B4B8A', '#9B59B6', '#E74C3C', '#F39C12', // Purple/Red
  '#3498DB', '#1ABC9C', '#E67E22', '#95A5A6', // Blue/Teal
  '#2C3E50', '#34495E', '#7F8C8D', '#BDC3C7', // Dark
];

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      onChange(hex);
    }
  };

  return (
    <Container>
      <Label>{label}</Label>
      <ColorInputContainer>
        <ColorInput
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <HexInput
          type="text"
          value={value}
          onChange={handleHexChange}
          placeholder="#5A9AA8"
          maxLength={7}
        />
      </ColorInputContainer>
      <PresetColors>
        {PRESET_COLORS.map((color) => (
          <PresetColor
            key={color}
            color={color}
            isSelected={value.toUpperCase() === color.toUpperCase()}
            onClick={() => onChange(color)}
            title={color}
          />
        ))}
      </PresetColors>
    </Container>
  );
};

export default ColorPicker;

