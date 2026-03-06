import { defineThemes } from '../theme/theme.models';

export const { useTheme } = defineThemes({
  dark: {
    backgroundColor: '#232323',
    borderColor: '#282828',
    switchBackgroundColor: '#a2a2a2',
    switchBorderColor: '#c6c6c7',
  },
  light: {
    backgroundColor: '#ffffff',
    borderColor: '#efeff5',
    switchBackgroundColor: '#727171',
    switchBorderColor: '#505050',
  },
});
