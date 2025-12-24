import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
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
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background.base};
`;

const FormCard = styled.div`
  background: ${theme.colors.background.surface};
  border: 1px solid ${theme.colors.border.default};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xl};
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 16px rgba(90, 154, 168, 0.2);
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSizes.h2};
  font-family: ${theme.typography.fontFamilies.heading};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
  font-weight: 600;
  line-height: ${theme.typography.lineHeights.tight};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.status.error};
  font-size: ${theme.typography.fontSizes.small};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: rgba(200, 122, 106, 0.15);
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid rgba(200, 122, 106, 0.3);
`;

const LinkText = styled.div`
  text-align: center;
  margin-top: ${theme.spacing.md};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSizes.body};

  a {
    color: ${theme.colors.primary.main};
    transition: color 0.2s ease;

    &:hover {
      color: ${theme.colors.primary.light};
    }
  }
`;

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(username, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormCard>
        <Title>Register</Title>
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
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
          />
          <Button type="submit" primary fullWidth disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Form>
        <LinkText>
          Already have an account? <Link to="/login">Login</Link>
        </LinkText>
      </FormCard>
    </FormContainer>
  );
};

export default RegisterForm;

