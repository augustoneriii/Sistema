import React, { useContext, useEffect, useRef } from 'react'
import { SidebarContext } from '../../../context/SideBarContext'
import Modal from '../../../components/Modal'

function AgendaCalendario() {
    const { agendaCalendarioVisible, setAgendaCalendarioVisible } = useContext(SidebarContext);
    const modalIdRef = useRef(Math.random().toString(36).substr(2, 9));

    const header = (
        <h1>AgendaCalendario</h1>
    );

    return (
        <>
            <Modal modalKey={modalIdRef.current} header={header} modal={false} visible={agendaCalendarioVisible} style={{ width: '70vw' }} onHide={() => setAgendaCalendarioVisible(false)}>

            </Modal>
        </>
    )
}

export default AgendaCalendario