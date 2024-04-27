import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import styles from './style.module.css';

function Modal({ children, header, modal, visible, style, onHide }) {
    const [isExpanded, setIsExpanded] = useState(true);

    const onMinimize = () => {
        setIsExpanded(!isExpanded);
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
        <Dialog
            header={headerContent}
            modal={modal}
            className={`${isExpanded ? '' : styles.minimized}`}
            visible={visible}
            onHide={onHide}
            baseZIndex={0}
            style={style}
            maximizable
            resizable={true}
            closeOnEscape
            contentClassName="pt-3"
            focusOnShow={false}
            headerStyle={isExpanded ? { backgroundColor: '#f9fafb' } : { backgroundColor: '#f9fafb', display: 'block', height: '20px', overflow: 'hidden' }}
            icons={headerIcon}
        >
            {isExpanded && children}
        </Dialog>
    );
}

export default Modal;
