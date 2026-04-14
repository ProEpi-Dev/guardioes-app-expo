import styled from 'styled-components';
import { Image, Text, View } from 'react-native';
import { scale } from '../../../utils/scalling';

export const Logo = styled(Image)`
  height: ${scale(120)}px;
  resize-mode: contain;
  margin-bottom: ${scale(30)}px;
`;

export const WelcomeText = styled.Text`
  font-family: 'System';
  font-weight: 400;
  font-size: ${scale(18)}px;
  color: #ffffff;
  margin-bottom: ${scale(25)}px;
  text-align: center;
`;

export const LabelVisible = styled.Text`
  font-family: 'System';
  font-weight: 500;
  font-size: ${scale(14)}px;
  text-decoration-line: underline;
  color: #ffffff;
  text-align: center;
`;

export const SeparatorLine = styled(View)`
  width: 80%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.3);
  margin-vertical: ${scale(10)}px;
`;

export const FooterContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 50px;
`;

export const FooterText = styled(Text)`
  font-family: 'System';
  font-size: ${scale(14)}px;
  color: #ffffff;
`;

export const FooterLink = styled(Text)`
  font-family: 'System';
  font-size: ${scale(14)}px;
  color: #ffffff;
  font-weight: bold;
  margin-left: 5px;
`;

export const PageTitle = styled.Text`
  font-family: 'System';
  font-weight: 600;
  font-size: ${scale(21)}px;
  color: #ffffff;
  margin-top: 5%;
  margin-bottom: 3%;
  text-align: center;
`;
