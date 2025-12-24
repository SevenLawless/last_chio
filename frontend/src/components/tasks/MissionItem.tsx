import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Mission, useTasks } from '../../contexts/TaskContext';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import CategoryBadge from '../categories/CategoryBadge';
import Button from '../common/Button';
import Modal from '../common/Modal';

interface MissionItemProps {
  mission: Mission;
}

const MissionContainer = styled.div`
  margin-bottom: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border.default};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background.surface};
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.border.medium};
    box-shadow: 0 2px 8px rgba(90, 154, 168, 0.15);
  }
`;

const MissionHeader = styled.div<{ completed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  background: ${theme.colors.background.elevated};
  border-bottom: 1px solid ${theme.colors.border.default};
  opacity: ${props => props.completed ? 0.6 : 1};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${theme.colors.primary.main};
`;

const MissionTitle = styled.h3<{ completed: boolean }>`
  flex: 1;
  font-size: ${theme.typography.fontSizes.body};
  font-family: ${theme.typography.fontFamilies.heading};
  color: ${theme.colors.text.primary};
  margin: 0;
  font-weight: 500;
  line-height: ${theme.typography.lineHeights.tight};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
`;

const MissionActions = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
  align-items: center;
`;

const TasksContainer = styled.div`
  padding: ${theme.spacing.sm};
  background: ${theme.colors.background.surface};
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  font-size: 14px;
  padding: ${theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    color: ${theme.colors.text.primary};
    background: ${theme.colors.background.elevated};
  }
`;

const MissionItem: React.FC<MissionItemProps> = ({ mission }) => {
  const { updateMission, cancelMission, categories, selectedTasks } = useTasks();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editTitle, setEditTitle] = useState(mission.title);

  const category = mission.category_id
    ? categories.find(c => c.id === mission.category_id)
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

