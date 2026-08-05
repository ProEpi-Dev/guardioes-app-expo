import styled from 'styled-components/native';
import { Image, Text } from 'react-native';
import { scale } from '../../../utils/scalling';

export const Logo = styled(Image)`
  height: ${scale(100)}px;
  resize-mode: contain;
  margin-bottom: ${scale(20)}px;
`;

export const PageTitle = styled(Text)`
  font-size: ${scale(24)}px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: ${scale(20)}px;
  text-align: center;
`;
