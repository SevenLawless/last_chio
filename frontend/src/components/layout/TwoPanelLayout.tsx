import styled from 'styled-components';
import { ReactNode } from 'react';

interface TwoPanelLayoutProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  flex: 0 0 65%;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.background.base};
  border-right: 1px solid ${props => props.theme.colors.border.default};
  overflow-y: auto;

  @media (max-width: 768px) {
    flex: 0 0 60%;
    border-right: none;
    border-bottom: 1px solid ${props => props.theme.colors.border.default};
  }
`;

const RightPanel = styled.div`
  flex: 0 0 35%;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.background.surface};
  overflow-y: auto;

  @media (max-width: 768px) {
    flex: 0 0 40%;
  }
`;

const TwoPanelLayout: React.FC<TwoPanelLayoutProps> = ({ leftPanel, rightPanel }) => {
  return (
    <Container>
      <LeftPanel>{leftPanel}</LeftPanel>
      <RightPanel>{rightPanel}</RightPanel>
    </Container>
  );
};

export default TwoPanelLayout;

