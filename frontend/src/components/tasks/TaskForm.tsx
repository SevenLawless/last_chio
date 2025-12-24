import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
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
  gap: ${theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${theme.typography.fontSizes.body};
  color: ${theme.colors.text.primary};
  font-weight: 500;
`;

const Select = styled.select`
  background: ${theme.colors.input.background};
  color: ${theme.colors.input.textColor};
  border: 1px solid ${theme.colors.border.default};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSizes.body};
  font-family: ${theme.typography.fontFamilies.body};
  border-radius: ${theme.borderRadius.sm};
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 0 0 3px rgba(90, 154, 168, 0.15);
    background: rgba(255, 255, 255, 0.7);
  }

  option {
    background: ${theme.colors.background.surface};
    color: ${theme.colors.text.primary};
  }
`;

const TaskForm: React.FC<TaskFormProps> = ({ missionId, onClose, initialTitle = '', initialCategoryId = null }) => {
  const { categories, createMission, createTask } = useTasks();
  const [title, setTitle] = useState(initialTitle);
  const [categoryId, setCategoryId] = useState<number | null>(initialCategoryId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (missionId) {
      await createTask(missionId, title);
    } else {
      await createMission(title, categoryId);
    }
    onClose();
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

