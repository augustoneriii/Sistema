import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

function Modal({ children, header, modal, visible, style, onHide }) {
    const [isMinimized, setIsMinimized] = useState(false);

    // Estilos para o modal quando minimizado e quando normal
    const minimizedStyle = {
        width: '200px',
        height: '40px',
        position: 'fixed',
        bottom: '0',
        left: '0',
        overflow: 'hidden'
    };

    // Alternar entre minimizado e normal
    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    // Modificar o estilo do modal com base no estado minimizado
    const currentStyle = isMinimized ? { ...style, ...minimizedStyle } : style;

    // Determinar o ícone correto para o botão baseado no estado isMinimized
    const buttonIcon = isMinimized ? "pi pi-window-maximize" : "pi pi-window-minimize";

    return (
        <Dialog header={header} modal={modal} visible={visible} style={currentStyle} onHide={onHide}>
            <Button icon={buttonIcon} onClick={toggleMinimize} className="p-button-rounded p-button-text" />
            {!isMinimized && children}
        </Dialog>
    );
}

export default Modal;
