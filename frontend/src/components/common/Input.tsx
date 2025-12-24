import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  autoFocus?: boolean;
  required?: boolean;
}

const StyledInput = styled.input<InputProps>`
  background: ${theme.colors.input.background};
  color: ${theme.colors.input.textColor};
  border: 1px solid ${theme.colors.border.default};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSizes.body};
  font-family: ${theme.typography.fontFamilies.body};
  line-height: ${theme.typography.lineHeights.normal};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  border-radius: ${theme.borderRadius.sm};
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 0 0 3px rgba(90, 154, 168, 0.15);
    background: rgba(255, 255, 255, 0.7);
  }

  &::placeholder {
    color: ${theme.colors.text.tertiary};
    opacity: 0.6;
  }
`;

const Input: React.FC<InputProps> = (props) => {
  return <StyledInput {...props} />;
};

export default Input;

