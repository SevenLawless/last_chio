import styled from 'styled-components';
import { Task, useTasks } from '../../contexts/TaskContext';
import Button from '../common/Button';

interface TaskItemProps {
  task: Task;
  missionId: number;
  onSelect?: () => void;
  isSelected?: boolean;
}

const TaskContainer = styled.div<{ completed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.elevated};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.sm};
  margin-left: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xs};
  opacity: ${props => props.completed ? 0.6 : 1};
  transform: scale(1);
  transition: all 0.25s ease;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  &:hover {
    border-color: ${props => props.theme.colors.border.default};
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.01);
  }
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: ${props => props.theme.colors.primary.main};
`;

const TaskTitle = styled.span<{ completed: boolean }>`
  flex: 1;
  font-size: ${props => props.theme.typography.fontSizes.body};
  color: ${props => props.theme.colors.text.primary};
  line-height: ${props => props.theme.typography.lineHeights.normal};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
`;

const TaskActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`;

const TaskItem: React.FC<TaskItemProps> = ({ task, missionId: _missionId, onSelect, isSelected }) => {
  const { updateTask, cancelTask, addSelectedTask, selectedTasks, removeSelectedTask } = useTasks();

  const handleToggle = async () => {
    await updateTask(task.id, {
      state: task.state === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED'
    });
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this task?')) {
      await cancelTask(task.id);
    }
  };

  const handleSelect = async () => {
    if (isSelected) {
      // Find selected task id
      const selected = selectedTasks.find(st => st.task_id === task.id);
      if (selected) {
        await removeSelectedTask(selected.id);
      }
      onSelect?.();
    } else {
      await addSelectedTask(task.id);
      onSelect?.();
    }
  };

  return (
    <TaskContainer completed={task.state === 'COMPLETED'}>
      <Checkbox
        type="checkbox"
        checked={task.state === 'COMPLETED'}
        onChange={handleToggle}
      />
      <TaskTitle completed={task.state === 'COMPLETED'}>
        {task.title}
      </TaskTitle>
      <TaskActions>
        <Button onClick={handleSelect} secondary>
          {isSelected ? 'Unselect' : 'Select'}
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </TaskActions>
    </TaskContainer>
  );
};

export default TaskItem;

