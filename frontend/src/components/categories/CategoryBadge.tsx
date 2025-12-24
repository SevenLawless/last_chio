import styled from 'styled-components';
import { Category } from '../../contexts/TaskContext';

interface CategoryBadgeProps {
  category: Category | null;
}

const Badge = styled.div<{ color: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.color}25;
  border: 1px solid ${props => props.color}50;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSizes.small};
  color: ${props => props.color};
  font-weight: 500;
  line-height: ${props => props.theme.typography.lineHeights.tight};
`;

const ColorDot = styled.div<{ color: string }>`
  width: 6px;
  height: 6px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.color};
`;

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  if (!category) return null;

  return (
    <Badge color={category.color}>
      <ColorDot color={category.color} />
      <span>{category.name}</span>
    </Badge>
  );
};

export default CategoryBadge;

