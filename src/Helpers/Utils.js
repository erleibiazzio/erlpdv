import bcrypt from 'bcrypt';
import { Modal } from 'bootstrap';

const saltRounds = 12;

/**
 * Função para tradução
 * @param {String} value - Texto a ser traduzido
 * @return {String} - Texto traduzido (atualmente retorna o mesmo valor)
 */
function __i(value) {
    return value;
}

/**
 * Função para criptografar a senha
 * @param {string} password - Senha a ser criptografada
 * @returns {Promise<string>} - Hash da senha criptografada
 */
function encryptPassword(password) {
    return bcrypt.hash(password, saltRounds);
}

/**
 * Função para verificar a senha
 * @param {string} password - Senha fornecida
 * @param {string} hash - Hash da senha armazenada
 * @returns {Promise<boolean>} - Resultado da comparação (true se a senha corresponder ao hash)
 */
function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}

/**
 * Função para exibir uma notificação toast
 * @param {string} message - Mensagem a ser exibida
 * @param {string} [type='success'] - Tipo da mensagem (success, error, etc.)
 * @param {number} [time=1500] - Duração da mensagem em milissegundos
 * @param {string|null} [icon=null] - Ícone opcional a ser exibido
 */
function showToast(message, type = 'success', time = 1500, icon = null) {
    window.dispatchEvent(new CustomEvent('showToast', { detail: { message: message, type: type, icon: icon, time: time } }));
}

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

function dispatchEvent(name, params = {}) {
    window.dispatchEvent(new CustomEvent(name, { detail: params }));
}


export { __i, encryptPassword, verifyPassword, showToast, openModal, dispatchEvent };
