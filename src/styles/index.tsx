import styled from '@emotion/styled'

export const StyledScreenGuard = styled.div`
  @media only screen and (max-width: 600px) {
    max-width: 600px;
  }
  max-width: 90%;
  margin: 0 auto;
  width: 100%;
`;

export const StyledAppWrapper = styled.div`
  border-radius: 1rem;
  margin: 1rem;
  background: #FFFFFF;
`;

export const StyledPhoneBookTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  font-size: 24px;
  font-weight: 600;
`;

export const StyledHeaderWrapper = styled.header`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #F0F0F0;
  padding: 0 1rem 0;
`;

export const StyledIcon = styled.div`
  display: flex;
  font-size: 2rem;
  color: #00A9F7;
`;
