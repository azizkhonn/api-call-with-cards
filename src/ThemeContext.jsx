// ThemeContext.js
import { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

// eslint-disable-next-line react/prop-types
export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () => createTheme({
      palette: {
        mode,
      },
    }),
    [mode]
  );

  // Using useTheme hook to access the current theme
  const currentTheme = useTheme();

  return (
    <ThemeContext.Provider value={{ toggleColorMode, currentTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
