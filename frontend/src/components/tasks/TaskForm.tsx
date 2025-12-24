import { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import { useTasks } from '../../contexts/TaskContext';
import Input from '../common/Input';
import Button from '../common/Button';

interface TaskFormProps {
  missionId?: number;
  onClose: () => void;
  initialTitle?: string;
  initialCategoryId?: number | null;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${props => props.theme.typography.fontSizes.body};
  color: ${props => props.theme.colors.text.primary};
  font-weight: 500;
`;

const Select = styled.select`
  background: ${props => props.theme.colors.input.background};
  color: ${props => props.theme.colors.input.textColor};
  border: 1px solid ${props => props.theme.colors.border.default};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSizes.body};
  font-family: ${props => props.theme.typography.fontFamilies.body};
  border-radius: ${props => props.theme.borderRadius.sm};
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary.main}26;
    background: rgba(255, 255, 255, 0.7);
  }

  option {
    background: ${props => props.theme.colors.background.surface};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const TaskForm: React.FC<TaskFormProps> = ({ missionId, onClose, initialTitle = '', initialCategoryId = null }) => {
  const { theme } = useTheme();
  const { categories, createMission, createTask } = useTasks();
  const [title, setTitle] = useState(initialTitle);
  const [categoryId, setCategoryId] = useState<number | null>(initialCategoryId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Close modal immediately for smooth UX
    onClose();

    // Create in background (optimistic update already handled in context)
    try {
      if (missionId) {
        await createTask(missionId, title);
      } else {
        await createMission(title, categoryId);
      }
    } catch (error) {
      // Error handling is done in context with rollback
      console.error('Error creating task/mission:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {!missionId && (
        <FormGroup>
          <Label>Category (optional)</Label>
          <Select
            value={categoryId || ''}
            onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">No Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </FormGroup>
      )}
      <FormGroup>
        <Label>{missionId ? 'Task Title' : 'Mission Title'}</Label>
        <Input
          type="text"
          placeholder={missionId ? 'Enter task title' : 'Enter mission title'}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          autoFocus
          required
        />
      </FormGroup>
      <div style={{ display: 'flex', gap: theme.spacing.md, justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" primary>
          {missionId ? 'Create Task' : 'Create Mission'}
        </Button>
      </div>
    </Form>
  );
};

export default TaskForm;

