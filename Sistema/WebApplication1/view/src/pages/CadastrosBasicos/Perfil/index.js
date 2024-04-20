import React, { useContext, useRef, useState } from 'react';
import { SidebarContext } from '../../../context/SideBarContext';
import Modal from '../../../components/Modal';


function Perfil() {
    const { perfilVisible, setPerfilVisible } = useContext(SidebarContext);
    const [dataLoaded, setDataLoaded] = useState(false);


    const header = (
        <h1>Perfil</h1>
    );

    const onHideModal = () => {
        setPerfilVisible(false);
        setDataLoaded(false); // Reseta o carregamento de dados para false quando o modal é fechado
    };


    return (
        <Modal header={header} modal={false} visible={perfilVisible} style={{ width: '80vw', height: '80vh' }} onHide={() => onHideModal()}>
            <div>
                <h1>Perfil</h1>
            </div>
        </Modal>
    );
}

export default Perfil;