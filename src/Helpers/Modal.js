import { Modal } from 'bootstrap';

/**
 * Abre um modal específico na página.
 *
 * @param {String} identifier - O identificador (ID) do elemento HTML do modal a ser aberto.
 * @returns {Modal} - Retorna a instância do modal aberto.
 *
 * @example
 * // Supondo que você tenha um modal com o ID 'exampleModal', você pode abri-lo assim:
 * const modalInstance = openModal('exampleModal');
 */
function openModal(identifier) {
    const modal = document.getElementById(identifier);
    const modalInstance = new Modal(modal);
    modalInstance.show();
    return modalInstance;
}

function closeModal(identifier) {
    const modal = document.getElementById(identifier);
    const modalInstance = new Modal(modal);
    modalInstance.hide();
    return modalInstance;
}


export { openModal,closeModal };
