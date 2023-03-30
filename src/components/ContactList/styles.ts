import styled from '@emotion/styled'
import { Space } from 'antd';

export const StyledContactsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const StyledContactListWrapper = styled(Space)`
  width: 100%;
  padding: 1rem;
`;

export const StyledLoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
`;