import styled,
{
  keyframes
} from 'styled-components';

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-60px);
  }
  60% {
    transform: translateY(-15px);
  }
`;

export const BounceWrapper = styled.div`
  position: relative;
  margin: auto;
  animation: ${bounce} 2s infinite;
`;

export const Logo = styled.img`
  max-width: 224px;
  margin: 25 0;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
  width: 100%;
  min-height: 200px;
  justify-content: space-evenly;
`;

export const Error = styled.div`
  color: hsl(22,97%,50%);
  font-size: 14px;
  // padding: 15px 10px 0;
  text-align: center;
  min-height: 32px;
  margin-top: 20px;
`;
