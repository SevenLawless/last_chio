import styled from 'styled-components';

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
  background: ${props => props.primary ? props.theme.colors.primary.main : 'transparent'};
  color: ${props => props.primary ? '#FFFFFF' : props.theme.colors.primary.main};
  border: ${props => props.primary ? 'none' : `1px solid ${props.theme.colors.primary.main}`};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSizes.body};
  font-family: ${props => props.theme.typography.fontFamilies.body};
  line-height: ${props => props.theme.typography.lineHeights.tight};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  border-radius: ${props => props.theme.borderRadius.sm};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover:not(:disabled) {
    ${props => props.primary 
      ? `background: ${props.theme.colors.primary.light}; box-shadow: 0 4px 12px ${props.theme.colors.primary.main}4D;` 
      : `background: ${props.theme.colors.background.surface}; border-color: ${props.theme.colors.primary.light};`}
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    ${props => props.primary ? `background: ${props.theme.colors.primary.dark};` : ''}
  }
`;

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;

