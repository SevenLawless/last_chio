import styled from 'styled-components';

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
  background: ${props => props.theme.colors.input.background};
  color: ${props => props.theme.colors.input.textColor};
  border: 1px solid ${props => props.theme.colors.border.default};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSizes.body};
  font-family: ${props => props.theme.typography.fontFamilies.body};
  line-height: ${props => props.theme.typography.lineHeights.normal};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  border-radius: ${props => props.theme.borderRadius.sm};
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary.main}26;
    background: rgba(255, 255, 255, 0.7);
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.tertiary};
    opacity: 0.6;
  }
`;

const Input: React.FC<InputProps> = (props) => {
  return <StyledInput {...props} />;
};

export default Input;

