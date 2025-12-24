import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import ColorPicker from './ColorPicker';
import Button from '../common/Button';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PreviewSection = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.background.base};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border.default};
`;

const PreviewTitle = styled.h3`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
  margin: 0 0 12px 0;
  font-weight: 500;
`;

const PreviewCard = styled.div`
  background: ${props => props.theme.colors.background.surface};
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
`;

const PreviewButton = styled.button`
  background: ${props => props.theme.colors.primary.main};
  color: ${props => props.theme.colors.text.onOrange};
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary.dark};
  }
`;

const PreviewAccentButton = styled(PreviewButton)`
  background: ${props => props.theme.colors.accent.orange};
  
  &:hover {
    background: ${props => props.theme.colors.accent.orangeDark};
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.status.error};
  font-size: 13px;
  padding: 8px;
  background: rgba(200, 122, 106, 0.15);
  border-radius: 6px;
  border: 1px solid rgba(200, 122, 106, 0.3);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const ThemeSettings: React.FC = () => {
  const { theme, userColors, updateColors } = useTheme();
  const [primaryColor, setPrimaryColor] = useState(userColors?.primary_color || '#5A9AA8');
  const [backgroundBaseColor, setBackgroundBaseColor] = useState(userColors?.background_base_color || '#C4DDE0');
  const [backgroundSurfaceColor, setBackgroundSurfaceColor] = useState(userColors?.background_surface_color || '#F5E6D3');
  const [accentColor, setAccentColor] = useState(userColors?.accent_color || '#D4A574');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Update local state when userColors change
  useEffect(() => {
    if (userColors) {
      setPrimaryColor(userColors.primary_color);
      setBackgroundBaseColor(userColors.background_base_color);
      setBackgroundSurfaceColor(userColors.background_surface_color);
      setAccentColor(userColors.accent_color);
    }
  }, [userColors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await updateColors({
        primary_color: primaryColor,
        background_base_color: backgroundBaseColor,
        background_surface_color: backgroundSurfaceColor,
        accent_color: accentColor
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update theme');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setPrimaryColor('#5A9AA8');
    setBackgroundBaseColor('#C4DDE0');
    setBackgroundSurfaceColor('#F5E6D3');
    setAccentColor('#D4A574');
    setError('');
  };

  // Generate preview theme
  const previewTheme = {
    colors: {
      primary: { main: primaryColor, dark: primaryColor, light: primaryColor },
      background: { base: backgroundBaseColor, surface: backgroundSurfaceColor, elevated: backgroundSurfaceColor },
      accent: { orange: accentColor, orangeDark: accentColor, orangeLight: accentColor },
      text: { primary: '#2C4A52', secondary: '#5A7A85', onOrange: '#FFFFFF' },
      border: { default: `${primaryColor}33` },
      status: { error: '#C87A6A' }
    },
    typography: theme.typography
  };

  return (
    <Form onSubmit={handleSubmit}>
      <ColorPicker
        label="Primary Color"
        value={primaryColor}
        onChange={setPrimaryColor}
      />
      <ColorPicker
        label="Background Base Color"
        value={backgroundBaseColor}
        onChange={setBackgroundBaseColor}
      />
      <ColorPicker
        label="Background Surface Color"
        value={backgroundSurfaceColor}
        onChange={setBackgroundSurfaceColor}
      />
      <ColorPicker
        label="Accent Color"
        value={accentColor}
        onChange={setAccentColor}
      />

      <PreviewSection style={{ background: previewTheme.colors.background.base }}>
        <PreviewTitle>Preview</PreviewTitle>
        <PreviewCard style={{ 
          background: previewTheme.colors.background.surface,
          borderColor: previewTheme.colors.border.default 
        }}>
          <PreviewButton style={{ background: previewTheme.colors.primary.main }}>
            Primary Button
          </PreviewButton>
          <PreviewAccentButton style={{ background: previewTheme.colors.accent.orange }}>
            Accent Button
          </PreviewAccentButton>
        </PreviewCard>
      </PreviewSection>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ButtonGroup>
        <Button onClick={handleReset} type="button">Reset</Button>
        <Button type="submit" primary disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default ThemeSettings;

