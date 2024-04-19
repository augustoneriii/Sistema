import { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const toast = useRef(null);

    return (
        <ToastContext.Provider value={toast}>
            <Toast ref={toast} />
            {children}
        </ToastContext.Provider>
    );
};
