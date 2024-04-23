import React from 'react'
import Modal from '../../../components/Modal/index.js';
import { SidebarContext } from '../../../context/SideBarContext.js';
import { useContext } from 'react';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';


function AgendaProfissional() {
  const { agendaProfissionalVisible, setAgendaProfissionalVisible } = useContext(SidebarContext);
  const toast = useRef(null);

  const onHideModal = () => {
    setAgendaProfissionalVisible(false);
};

  const header = (
    <h1>Agenda Profissional</h1>
);
  return (
    <>
      {/* <Toast ref={toast} /> */}

      <Modal header={header} modal={false} visible={agendaProfissionalVisible} style={{ width: '80vw', height: '80vh' }} onHide={() => onHideModal()}>
        <div>AgendaProfissional</div>
      </Modal>
    </>
  )
}

export default AgendaProfissional