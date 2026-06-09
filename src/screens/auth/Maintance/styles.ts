import { Image, StyleSheet } from 'react-native';
import styled from 'styled-components';
import { scale } from '../../../utils/scalling';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: scale(16),
    textAlign: 'center',
    paddingHorizontal: scale(30),
    paddingBottom: scale(10),
  },
});

export const Logo = styled(Image)`
  height: ${scale(120)}px;
  resize-mode: contain;
  margin-bottom: ${scale(20)}px;
  margin-top: ${scale(210)}px;
`;
