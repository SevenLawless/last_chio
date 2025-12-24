import { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import TwoPanelLayout from './layout/TwoPanelLayout';
import MissionList from './tasks/MissionList';
import SelectedTasksPanel from './tasks/SelectedTasksPanel';
import CategoryManager from './categories/CategoryManager';
import Button from './common/Button';
import Modal from './common/Modal';
import ThemeSettings from './settings/ThemeSettings';

const Header = styled.header<{ theme: any }>`
  background: ${props => props.theme.colors.background.elevated};
  border-bottom: 1px solid ${props => props.theme.colors.border.default};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px ${props => props.theme.colors.primary.main}1A;
`;

const Title = styled.h1<{ theme: any }>`
  font-size: ${props => props.theme.typography.fontSizes.h3};
  font-family: ${props => props.theme.typography.fontFamilies.heading};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
  font-weight: 600;
  line-height: ${props => props.theme.typography.lineHeights.tight};
`;

const UserInfo = styled.div<{ theme: any }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSizes.body};
`;

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { loading } = useTasks();
  const { theme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

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
      <Header theme={theme}>
        <Title theme={theme}>Chio</Title>
        <UserInfo theme={theme}>
          <span>{user?.username}</span>
          <Button onClick={() => setShowSettings(true)} secondary>Settings</Button>
          <Button onClick={logout}>Logout</Button>
        </UserInfo>
      </Header>
      <TwoPanelLayout
        leftPanel={<MissionList />}
        rightPanel={<SelectedTasksPanel />}
      />
      <CategoryManager />
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Theme Settings"
      >
        <ThemeSettings />
      </Modal>
    </>
  );
};

export default Dashboard;

