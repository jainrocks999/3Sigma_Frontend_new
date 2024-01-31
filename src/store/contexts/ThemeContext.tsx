import React, {FunctionComponent} from 'react';
import {defaultTheme} from 'resources/palette/gTheme.interface';

export const ThemeContext = React.createContext(defaultTheme);

export const ThemeContextProvider: FunctionComponent<any> = ({children}: any) => (
  <ThemeContext.Provider value={defaultTheme}>{children}</ThemeContext.Provider>
);
