import styled from 'styled-components';
import { Image, Text, View } from 'react-native';
import { scale } from '../../../utils/scalling';

export const Container = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-horizontal: 20px;
`;

export const Logo = styled(Image)`
  height: ${scale(160)}px;
  resize-mode: contain;
  margin-bottom: ${scale(20)}px;
`;

export const WelcomeText = styled(Text)`
  font-family: 'System';
  font-weight: 600;
  font-size: ${scale(17)}px;
  color: #ffffff;
  margin-bottom: 20%;
  text-align: center;
  padding-horizontal: 20px;
`;
