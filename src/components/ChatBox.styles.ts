import styled from "styled-components";
export const ChatBoxOuterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #1a1a1d;
  @media (min-width: 320px) and (max-width: 480px) {
    height: 100%;
  }
`;
export const ChatBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #ece5dd;
  border-radius: 8px;
  height: 100%;
  width: 100%;

  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
    height: 100%;
  }

  @media (min-width: 480px) and (max-width: 1200px) {
    width: 100%;
  }
`;
