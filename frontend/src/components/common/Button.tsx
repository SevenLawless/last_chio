import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface ButtonProps {
  primary?: boolean;
  secondary?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children: React.ReactNode;
}

const StyledButton = styled.button<ButtonProps>`
  background: ${props => props.primary ? theme.colors.primary.main : 'transparent'};
  color: ${props => props.primary ? '#FFFFFF' : theme.colors.primary.main};
  border: ${props => props.primary ? 'none' : `1px solid ${theme.colors.primary.main}`};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSizes.body};
  font-family: ${theme.typography.fontFamilies.body};
  line-height: ${theme.typography.lineHeights.tight};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  border-radius: ${theme.borderRadius.sm};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover:not(:disabled) {
    ${props => props.primary 
      ? `background: ${theme.colors.primary.light}; box-shadow: 0 4px 12px rgba(90, 154, 168, 0.3);` 
      : `background: ${theme.colors.background.surface}; border-color: ${theme.colors.primary.light};`}
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    ${props => props.primary ? `background: ${theme.colors.primary.dark};` : ''}
  }
`;

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;

