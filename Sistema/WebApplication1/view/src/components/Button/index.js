
import React from 'react';
import { Button } from 'primereact/button';

export default function ButtonComponent({ label, severity }) {
    return (
        <div className="card flex flex-wrap justify-content-center gap-3">
            <Button label={label} severity={severity} raised />
        </div>
    )
}
