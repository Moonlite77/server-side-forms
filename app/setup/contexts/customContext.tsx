import { createContext, useContext } from 'react';

interface DataContextType {
    firstName: String
    lastName: String
    careerField: String
    alias: String
    fullTime: String
    contract: String
    speaker: String
    stepOne: String
    
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

// Custom hook that handles the undefined case
export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useDataContext must be used within DataContext.Provider');
    }
    return context;
};