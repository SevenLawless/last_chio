import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { useTasks, SelectedTask } from '../../contexts/TaskContext';
import Button from '../common/Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.div`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border.default};
  background: ${theme.colors.background.elevated};
`;

const Title = styled.h2`
  font-size: ${theme.typography.fontSizes.h3};
  font-family: ${theme.typography.fontFamilies.heading};
  color: ${theme.colors.text.primary};
  margin: 0;
  font-weight: 600;
  line-height: ${theme.typography.lineHeights.tight};
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${theme.spacing.md};
  background: ${theme.colors.background.surface};
`;

const TaskItem = styled.div<{ completed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.background.elevated};
  border: 1px solid ${theme.colors.border.default};
  border-radius: ${theme.borderRadius.sm};
  margin-bottom: ${theme.spacing.xs};
  opacity: ${props => props.completed ? 0.6 : 1};
  transition: all 0.2s ease;
  cursor: move;

  &:hover {
    border-color: ${theme.colors.border.medium};
    background: rgba(255, 255, 255, 0.4);
  }
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: ${theme.colors.primary.main};
`;

const TaskInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const TaskTitle = styled.span<{ completed: boolean }>`
  font-size: ${theme.typography.fontSizes.body};
  color: ${theme.colors.text.primary};
  line-height: ${theme.typography.lineHeights.normal};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
`;

const MissionTitle = styled.span`
  font-size: ${theme.typography.fontSizes.small};
  color: ${theme.colors.text.secondary};
`;

const TaskActions = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSizes.body};
`;

const SelectedTasksPanel: React.FC = () => {
  const { selectedTasks, updateTask, removeSelectedTask, reorderSelectedTasks } = useTasks();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [displayTasks, setDisplayTasks] = useState<SelectedTask[]>(selectedTasks);

  // Update displayTasks when selectedTasks changes
  useEffect(() => {
    setDisplayTasks(selectedTasks);
  }, [selectedTasks]);

  const handleToggle = async (taskId: number, currentState: 'NOT_STARTED' | 'COMPLETED') => {
    await updateTask(taskId, {
      state: currentState === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED'
    });
  };

  const handleRemove = async (id: number) => {
    await removeSelectedTask(id);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newTasks = [...displayTasks];
    const draggedTask = newTasks[draggedIndex];
    newTasks.splice(draggedIndex, 1);
    newTasks.splice(index, 0, draggedTask);

    setDisplayTasks(newTasks);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;

    const reordered = displayTasks.map((task, idx) => ({
      id: task.id,
      display_order: idx + 1
    }));

    await reorderSelectedTasks(reordered);
    setDraggedIndex(null);
  };

  return (
    <Container>
      <Header>
        <Title>Today's Focus</Title>
      </Header>
      <Content>
        {displayTasks.length === 0 ? (
          <EmptyState>
            <p>No tasks in today's focus. Select tasks from missions to focus on them here.</p>
          </EmptyState>
        ) : (
          displayTasks.map((task, index) => (
            <TaskItem
              key={task.id}
              completed={task.state === 'COMPLETED'}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              style={{
                cursor: 'move',
                opacity: draggedIndex === index ? 0.5 : undefined
              }}
            >
              <Checkbox
                type="checkbox"
                checked={task.state === 'COMPLETED'}
                onChange={() => handleToggle(task.task_id, task.state)}
              />
              <TaskInfo>
                <TaskTitle completed={task.state === 'COMPLETED'}>
                  {task.title}
                </TaskTitle>
                <MissionTitle>{task.mission_title}</MissionTitle>
              </TaskInfo>
              <TaskActions>
                <Button onClick={() => handleRemove(task.id)}>Remove</Button>
              </TaskActions>
            </TaskItem>
          ))
        )}
      </Content>
    </Container>
  );
};

export default SelectedTasksPanel;

