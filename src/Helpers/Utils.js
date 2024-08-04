import bcrypt from 'bcrypt';

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

function dispatchEvent(name, params = {}) {
    window.dispatchEvent(new CustomEvent(name, { detail: params }));
}

function ucfirst(string) {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export { __i, encryptPassword, verifyPassword, showToast, dispatchEvent, ucfirst };
