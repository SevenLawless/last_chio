import { useState } from 'react';
import styled from 'styled-components';
import { useTasks } from '../../contexts/TaskContext';
import MissionItem from './MissionItem';
import TaskForm from './TaskForm';
import Button from '../common/Button';
import Modal from '../common/Modal';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.div`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border.default};
  background: ${props => props.theme.colors.background.elevated};
`;

const Title = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.h3};
  font-family: ${props => props.theme.typography.fontFamilies.heading};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  font-weight: 600;
  line-height: ${props => props.theme.typography.lineHeights.tight};
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.base};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSizes.body};
`;

const MissionList: React.FC = () => {
  const { missions, loading } = useTasks();
  const [showMissionForm, setShowMissionForm] = useState(false);

  if (loading) {
    return (
      <Container>
        <EmptyState>Loading...</EmptyState>
      </Container>
    );
  }

  const groupedMissions = missions.reduce((acc, mission) => {
    const categoryId = mission.category_id || 'uncategorized';
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(mission);
    return acc;
  }, {} as Record<number | 'uncategorized', typeof missions>);

  return (
    <Container>
      <Header>
        <Title>Missions</Title>
        <Button primary onClick={() => setShowMissionForm(true)}>
          Create Mission
        </Button>
      </Header>
      <Content>
        {missions.length === 0 ? (
          <EmptyState>
            <p>No missions yet. Create your first mission to get started!</p>
          </EmptyState>
        ) : (
          Object.entries(groupedMissions).map(([categoryId, categoryMissions]) => (
            <div key={categoryId}>
              {categoryMissions.map((mission) => (
                <MissionItem key={mission.id} mission={mission} />
              ))}
            </div>
          ))
        )}
      </Content>

      <Modal
        isOpen={showMissionForm}
        onClose={() => setShowMissionForm(false)}
        title="Create Mission"
      >
        <TaskForm onClose={() => setShowMissionForm(false)} />
      </Modal>
    </Container>
  );
};

export default MissionList;

