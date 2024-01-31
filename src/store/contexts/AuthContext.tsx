import React, {FunctionComponent} from 'react';

export interface AuthFunctions {
  signIn: (profileStatus?: boolean) => void;
  signOut: () => void;
}

const defaultAuthFunctions: AuthFunctions = {
  signIn: (_profileStatus?: boolean) => void 0,
  signOut: () => void 0,
};

export const AuthContext =
  React.createContext<AuthFunctions>(defaultAuthFunctions);

export const AuthContextProvider: FunctionComponent<any> = ({
  children,
  value,
}: any) => (
  <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
);
