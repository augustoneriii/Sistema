import React, { createContext, useContext, useState } from 'react';

const ZIndexContext = createContext();

export const ZIndexProvider = ({ children }) => {
    const [zIndex, setZIndex] = useState(1100);

    const incrementZIndex = () => {
        setZIndex(z => z + 10);
    };

    return (
        <ZIndexContext.Provider value={{ zIndex, incrementZIndex }}>
            {children}
        </ZIndexContext.Provider>
    );
};

export const useZIndex = () => useContext(ZIndexContext);
