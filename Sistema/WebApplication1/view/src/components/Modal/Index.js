
import React, { useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Avatar } from '@/components/lib/avatar/Avatar';

export default function Modal({
    labelButton = labelButton,
    severityButton = severityButton
}) {
    const [visible, setVisible] = useState(false);

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <Avatar size="large" icon="pi pi-user" />
            <span className="font-bold white-space-nowrap">Amy Elsner</span>
        </div>
    );

    const footerContent = (
        <ButtonComponent
            label={labelButton}
            severity={severityButton}
            onClick={() => setVisible(false)}
        />
    );

    return (
        <div className="card flex justify-content-center">
            <Button label="Show" icon="pi pi-external-link" onClick={() => setVisible(true)} />
            <Dialog visible={visible} modal header={headerElement} footer={footerContent} style={{ width: '50rem' }} onHide={() => setVisible(false)}>
                <div className="m-0">

                </div>
            </Dialog>
        </div>
    )
}
