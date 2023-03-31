import styled from '@emotion/styled'
import { Space, Table, Typography } from 'antd';

export const StyledContactsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
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

export const StyledTextNoWrap = styled(Typography.Text)`
  white-space: no-wrap;
`;

export const StyledTable = styled(Table)`
  .ant-table-cell {
    vertical-align: top;
  }
`;