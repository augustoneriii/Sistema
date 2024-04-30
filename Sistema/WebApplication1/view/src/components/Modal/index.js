import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { useZIndex } from '../../context/ZIndexContext';

function Modal({ modalKey, children, header, modal, visible, style, onHide }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const { zIndex, incrementZIndex } = useZIndex();

    let modalId = `modal-${modalKey}`;


    const handleClick = () => {
        console.log(modalId);
        let modalContainer = document.getElementById(modalId)?.parentNode;
        console.log("modalContainer", modalContainer)
        if (modalContainer) {
            modalContainer.style.zIndex = zIndex;
        }
        incrementZIndex();
    };

    const onMinimize = () => {
        setIsExpanded(!isExpanded);
    };

    const dynamicStyles = {
        ...style,
        position: 'relative'
    };

    const headerContent = (
        <div className="p-dialog-titlebar">
            <span className="p-dialog-title">{header}</span>
        </div>
    );

    const headerIcon = (
        <button
            type="button"
            className="p-dialog-titlebar-icon p-dialog-titlebar-minimize p-link mr-2"
            onClick={onMinimize}
        >
            <span className="p-dialog-titlebar-icon">__</span>
        </button>
    );

    return (
        <>
            {
                !modalKey ? (null) : (
                    <>
                        <Dialog
                            header={headerContent}
                            modal={modal}
                            visible={visible}
                            id={`${modalId}`}
                            onHide={onHide}
                            maximizable
                            resizable={true}
                            closeOnEscape
                            contentClassName="pt-3"
                            focusOnShow={false}
                            headerStyle={isExpanded ? { backgroundColor: '#f9fafb' } : { backgroundColor: '#f9fafb', display: 'block', height: '20px', overflow: 'hidden' }}
                            icons={headerIcon}
                            style={dynamicStyles}
                            onClick={handleClick}
                        >
                            {isExpanded && children}
                        </Dialog >
                    </>
                )
            }
        </>
    );
}

export default Modal;
