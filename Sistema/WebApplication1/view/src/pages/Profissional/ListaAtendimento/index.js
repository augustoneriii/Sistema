import React, { useContext, useState, useRef } from 'react'
import Modal from '../../../components/Modal'
import { Toast } from 'primereact/toast';
import { SidebarContext } from '../../../context/SideBarContext'


function ListaAtendimentos() {
  const { atendimentoVisible, setAtendimentoVisible } = useContext(SidebarContext)
  const [dataLoaded, setDataLoaded] = useState(false);
  const toast = useRef(null);


  const onHideModal = () => {
    setAtendimentoVisible(false);
    setDataLoaded(false);
  }

  const header = (
    <h1>Lista de Atentimentos</h1>
  );


  return (
    <>
      <Toast ref={toast} />
      <Modal header={header} modal={false} visible={atendimentoVisible} style={{ width: '80vw', height: '80vh' }} onHide={() => onHideModal()}>
        ListaAtendimentos
      </Modal>
    </>
  )
}

export default ListaAtendimentos