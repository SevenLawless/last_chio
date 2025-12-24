import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { ReactNode } from 'react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const Overlay = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme.colors.background.overlay};
  z-index: 1000;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled.div`
  background: ${theme.colors.background.surface};
  border: 1px solid ${theme.colors.border.default};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(90, 154, 168, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
`;

const ModalTitle = styled.h2`
  font-size: ${theme.typography.fontSizes.h3};
  font-family: ${theme.typography.fontFamilies.heading};
  color: ${theme.colors.text.primary};
  margin: 0;
  font-weight: 600;
  line-height: ${theme.typography.lineHeights.tight};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 28px;
  height: 28px;
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

const ModalBody = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const ModalFooter = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: flex-end;
`;

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {title && (
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            <CloseButton onClick={onClose}>×</CloseButton>
          </ModalHeader>
        )}
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContainer>
    </Overlay>
  );
};

export default Modal;

