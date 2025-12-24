import styled from 'styled-components';
import { theme } from '../styles/theme';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import TwoPanelLayout from './layout/TwoPanelLayout';
import MissionList from './tasks/MissionList';
import SelectedTasksPanel from './tasks/SelectedTasksPanel';
import CategoryManager from './categories/CategoryManager';
import Button from './common/Button';

const Header = styled.header`
  background: ${theme.colors.background.elevated};
  border-bottom: 1px solid ${theme.colors.border.default};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(90, 154, 168, 0.1);
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSizes.h3};
  font-family: ${theme.typography.fontFamilies.heading};
  color: ${theme.colors.text.primary};
  margin: 0;
  font-weight: 600;
  line-height: ${theme.typography.lineHeights.tight};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSizes.body};
`;

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { loading } = useTasks();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: theme.colors.background.base,
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSizes.body
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <Header>
        <Title>Task Manager</Title>
        <UserInfo>
          <span>{user?.username}</span>
          <Button onClick={logout}>Logout</Button>
        </UserInfo>
      </Header>
      <TwoPanelLayout
        leftPanel={<MissionList />}
        rightPanel={<SelectedTasksPanel />}
      />
      <CategoryManager />
    </>
  );
};

export default Dashboard;

