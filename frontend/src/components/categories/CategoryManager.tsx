import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { useTasks, Category } from '../../contexts/TaskContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';

const FloatingButton = styled.button`
  position: fixed;
  bottom: ${theme.spacing.lg};
  right: ${theme.spacing.lg};
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.primary.main};
  color: ${theme.colors.text.onOrange};
  border: none;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(90, 154, 168, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(90, 154, 168, 0.4);
    background: ${theme.colors.primary.light};
  }

  &:active {
    transform: translateY(0);
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`;

const Label = styled.label`
  font-size: ${theme.typography.fontSizes.body};
  color: ${theme.colors.text.primary};
  font-weight: 500;
`;

const ColorInput = styled.input`
  width: 100%;
  height: 36px;
  border: 1px solid ${theme.colors.border.default};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  background: ${theme.colors.background.elevated};
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  margin-bottom: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
`;

const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.background.elevated};
  border: 1px solid ${theme.colors.border.default};
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.border.medium};
    background: rgba(255, 255, 255, 0.3);
  }
`;

const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const ColorDot = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: ${theme.borderRadius.full};
  background: ${props => props.color};
  border: 1px solid ${theme.colors.border.default};
`;

const CategoryManager: React.FC = () => {
  const { categories, createCategory, updateCategory, deleteCategory } = useTasks();
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#5A9AA8');

  const handleOpen = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setColor(category.color);
    } else {
      setEditingCategory(null);
      setName('');
      setColor('#5A9AA8');
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingCategory(null);
    setName('');
    setColor('#5A9AA8');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      await updateCategory(editingCategory.id, name, color);
    } else {
      await createCategory(name, color);
    }
    handleClose();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(id);
    }
  };

  return (
    <>
      <FloatingButton onClick={() => handleOpen()}>+</FloatingButton>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        footer={
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" primary onClick={handleSubmit}>
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Name</Label>
            <Input
              type="text"
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Color</Label>
            <ColorInput
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </FormGroup>
        </form>
        {categories.length > 0 && (
          <>
            <h3 style={{ marginTop: theme.spacing.xl, marginBottom: theme.spacing.md }}>Categories</h3>
            <CategoryList>
              {categories.map((cat) => (
                <CategoryItem key={cat.id}>
                  <CategoryInfo>
                    <ColorDot color={cat.color} />
                    <span>{cat.name}</span>
                  </CategoryInfo>
                  <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                    <Button onClick={() => handleOpen(cat)}>Edit</Button>
                    <Button onClick={() => handleDelete(cat.id)}>Delete</Button>
                  </div>
                </CategoryItem>
              ))}
            </CategoryList>
          </>
        )}
      </Modal>
    </>
  );
};

export default CategoryManager;

