import {
  DefaultTheme as LightNavTheme,
  DarkTheme as DarkNavTheme
} from '@react-navigation/native'

import {
  DefaultTheme as LightPaperTheme,
  DarkTheme as DarkPaperTheme
} from 'react-native-paper'

const tintColor = '#2f95dc'
export default {
  tintColor,
  tabIconDefault: '#ccc',
  tabIconSelected: tintColor,
  tabBar: '#fefefe',
  errorBackground: 'red',
  errorText: '#fff',
  warningBackground: '#EAEB5E',
  warningText: '#666804',
  noticeBackground: tintColor,
  noticeText: '#fff',

  // Theme Definitions
  lightTheme: {
    ...LightNavTheme,
    ...LightPaperTheme,
    colors: {
      ...LightNavTheme.colors,
      ...LightPaperTheme.colors
    }
  },
  darkTheme: {
    ...DarkNavTheme,
    ...DarkPaperTheme,
    colors: {
      ...DarkPaperTheme.colors,
      ...DarkNavTheme.colors
    },
    mode: 'adaptive'
  }
}
