import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base dimensions (iPhone 6/7/8)
const baseWidth = 375;
const _baseHeight = 667;

export const scale = (size) => {
  return (width / baseWidth) * size;
};

export const percentage = (size) => {
  return (size / 100) * height;
};
