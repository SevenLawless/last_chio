import { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background.base};
`;

const FormCard = styled.div`
  background: ${props => props.theme.colors.background.surface};
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.xl};
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 16px ${props => props.theme.colors.primary.main}33;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes.h2};
  font-family: ${props => props.theme.typography.fontFamilies.heading};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
  font-weight: 600;
  line-height: ${props => props.theme.typography.lineHeights.tight};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.status.error};
  font-size: ${props => props.theme.typography.fontSizes.small};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: rgba(200, 122, 106, 0.15);
  border-radius: ${props => props.theme.borderRadius.sm};
  border: 1px solid rgba(200, 122, 106, 0.3);
`;

const LinkText = styled.div`
  text-align: center;
  margin-top: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSizes.body};

  a {
    color: ${props => props.theme.colors.primary.main};
    transition: color 0.2s ease;

    &:hover {
      color: ${props => props.theme.colors.primary.light};
    }
  }
`;

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormCard>
        <Title>Login</Title>
        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            autoFocus
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <Button type="submit" primary fullWidth disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
        <LinkText>
          Don't have an account? <Link to="/register">Register</Link>
        </LinkText>
      </FormCard>
    </FormContainer>
  );
};

export default LoginForm;

