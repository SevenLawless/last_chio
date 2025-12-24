import { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import { Mission, Category, useTasks } from '../../contexts/TaskContext';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import CategoryBadge from '../categories/CategoryBadge';
import Button from '../common/Button';
import Modal from '../common/Modal';

interface MissionItemProps {
  mission: Mission;
}

const MissionContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background.surface};
  overflow: hidden;
  transition: all 0.25s ease;
  transform: scale(1);
  animation: fadeInUp 0.3s ease-out;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  &:hover {
    border-color: ${props => props.theme.colors.border.medium};
    box-shadow: 0 2px 8px ${props => props.theme.colors.primary.main}26;
    transform: scale(1.005);
  }
`;

const MissionHeader = styled.div<{ completed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.elevated};
  border-bottom: 1px solid ${props => props.theme.colors.border.default};
  opacity: ${props => props.completed ? 0.6 : 1};
  transition: opacity 0.2s ease;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${props => props.theme.colors.primary.main};
`;

const MissionTitle = styled.h3<{ completed: boolean }>`
  flex: 1;
  font-size: ${props => props.theme.typography.fontSizes.body};
  font-family: ${props => props.theme.typography.fontFamilies.heading};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
  font-weight: 500;
  line-height: ${props => props.theme.typography.lineHeights.tight};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
`;

const MissionActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
  align-items: center;
`;

const TasksContainer = styled.div`
  padding: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.background.surface};
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  font-size: 14px;
  padding: ${props => props.theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.text.primary};
    background: ${props => props.theme.colors.background.elevated};
  }
`;

const MissionItem: React.FC<MissionItemProps> = ({ mission }) => {
  const { theme } = useTheme();
  const { updateMission, cancelMission, categories, selectedTasks } = useTasks();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editTitle, setEditTitle] = useState(mission.title);

  const category: Category | null = mission.category_id
    ? (categories.find(c => c.id === mission.category_id) || null)
    : null;

  const handleToggle = async () => {
    await updateMission(mission.id, {
      state: mission.state === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED'
    });
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this mission?')) {
      await cancelMission(mission.id);
    }
  };

  const handleEdit = async () => {
    await updateMission(mission.id, { title: editTitle });
    setShowEditForm(false);
  };

  const tasks = mission.tasks || [];

  return (
    <>
      <MissionContainer>
        <MissionHeader completed={mission.state === 'COMPLETED'}>
          <Checkbox
            type="checkbox"
            checked={mission.state === 'COMPLETED'}
            onChange={handleToggle}
          />
          <ExpandButton onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '▼' : '▶'}
          </ExpandButton>
          <MissionTitle completed={mission.state === 'COMPLETED'}>
            {mission.title}
          </MissionTitle>
          <CategoryBadge category={category} />
          <MissionActions>
            <Button onClick={() => setShowEditForm(true)}>Edit</Button>
            <Button onClick={() => setShowTaskForm(true)}>Add Task</Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </MissionActions>
        </MissionHeader>
        {isExpanded && (
          <TasksContainer>
            {tasks.length === 0 ? (
              <div style={{ color: theme.colors.text.secondary, padding: theme.spacing.sm, fontSize: theme.typography.fontSizes.small, fontStyle: 'italic' }}>
                No tasks yet. Click "Add Task" to create one.
              </div>
            ) : (
              tasks.map((task) => {
                const isSelected = selectedTasks.some(st => st.task_id === task.id);
                return (
                  <TaskItem
                    key={task.id}
                    task={task}
                    missionId={mission.id}
                    isSelected={isSelected}
                  />
                );
              })
            )}
          </TasksContainer>
        )}
      </MissionContainer>

      <Modal
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        title="Add Task"
      >
        <TaskForm missionId={mission.id} onClose={() => setShowTaskForm(false)} />
      </Modal>

      <Modal
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        title="Edit Mission"
        footer={
          <>
            <Button onClick={() => setShowEditForm(false)}>Cancel</Button>
            <Button primary onClick={handleEdit}>Save</Button>
          </>
        }
      >
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          style={{
            width: '100%',
            padding: theme.spacing.sm,
            background: theme.colors.input.background,
            color: theme.colors.text.primary,
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.borderRadius.sm,
            fontSize: theme.typography.fontSizes.body
          }}
          autoFocus
        />
      </Modal>
    </>
  );
};

export default MissionItem;

