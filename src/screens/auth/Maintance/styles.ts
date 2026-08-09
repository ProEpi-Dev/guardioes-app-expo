import { Image, StyleSheet } from 'react-native';
import styled from 'styled-components';
import { scale } from '../../../utils/scalling';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: scale(20),
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: scale(30),
    paddingBottom: scale(12),
  },
  text: {
    color: '#fff',
    fontSize: scale(16),
    textAlign: 'center',
    paddingHorizontal: scale(30),
    paddingBottom: scale(10),
  },
  retryButton: {
    marginTop: scale(24),
    minWidth: scale(180),
    minHeight: scale(48),
    paddingHorizontal: scale(24),
    borderRadius: scale(24),
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryLabel: {
    color: '#fff',
    fontSize: scale(16),
    fontWeight: 'bold',
  },
});

export const Logo = styled(Image)`
  height: ${scale(120)}px;
  resize-mode: contain;
  margin-bottom: ${scale(20)}px;
  margin-top: ${scale(210)}px;
`;
