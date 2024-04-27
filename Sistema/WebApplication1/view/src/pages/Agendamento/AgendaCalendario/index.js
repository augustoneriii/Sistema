import React, { useContext } from 'react'
import { SidebarContext } from '../../../context/SideBarContext'
import Modal from '../../../components/Modal'

function AgendaCalendario() {
    const { agendaCalendarioVisible, setAgendaCalendarioVisible } = useContext(SidebarContext);

    const header = (
        <h1>AgendaCalendario</h1>
    );

    return (
        <>
            <Modal header={header} modal={false} visible={agendaCalendarioVisible} style={{ width: '70vw' }} onHide={() => setAgendaCalendarioVisible(false)}>

            </Modal>
        </>
    )
}

export default AgendaCalendario