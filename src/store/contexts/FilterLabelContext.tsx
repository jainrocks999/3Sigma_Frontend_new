import React, {FunctionComponent, useState} from 'react';

const initialState: {
  filteredLabels: number[] | undefined;
  updateFilteredLabels: (_labels: number[]) => void;
  clearContext: () => void;
} = {
  filteredLabels: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateFilteredLabels: (_labels) => null,
  clearContext: () => null,
};

export const FilterLabelContext = React.createContext(initialState);

export const FilterLabelContextProvider: FunctionComponent<any> = ({children}: any) => {
  const [filteredLabels, setFilteredLabels] = useState<number[]>();
  const clearContext = () => {
    setFilteredLabels([]);
  };
  return (
    <FilterLabelContext.Provider
      value={{
        filteredLabels,
        updateFilteredLabels: setFilteredLabels,
        clearContext,
      }}>
      {children}
    </FilterLabelContext.Provider>
  );
};
