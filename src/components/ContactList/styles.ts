import { StarFilled, StarOutlined } from '@ant-design/icons';
import styled from '@emotion/styled'
import { Button, Space, Typography } from 'antd';

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

export const StyledStarFilledIcon = styled(StarFilled)`
  color: gold;
`;

export const StyledStarOurlinedIcon = styled(StarOutlined)`
  color: gold;
`;

export const StyledFavoriteButton = styled(Button)`
  border: '1px solid gold';
`;