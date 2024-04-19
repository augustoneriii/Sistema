import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';

function Modal({ children, header, modal, visible, style, onHide }) {
    const modalHeader = <div>{header}</div>;


    return (
        <Dialog
            header={modalHeader}
            modal={modal}
            visible={visible}
            onHide={onHide}
            style={style}
            maximizable
        >
            {children}
        </Dialog>
    );
}

export default Modal;
