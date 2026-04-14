import styled from 'styled-components/native';
import { Image, TouchableOpacity } from 'react-native';
import { scale } from '../../../utils/scalling';

export const Logo = styled(Image)`
  height: ${scale(100)}px;
  resize-mode: contain;
  margin-bottom: ${scale(20)}px;
`;
