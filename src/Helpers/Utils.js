import bcrypt from 'bcrypt';

const saltRounds = 12;

/**
     * Função para tradução
     * @param {String} value 
     * @return String
     */
function __i(value) {
    return value;
}

/**
 * 
 * @param { string } password 
 * @returns 
 */
function encryptPassword(password) {
    return bcrypt.hash(password, saltRounds);
}

function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}

function showToast(message, type = 'success', time = 1500, icon = null) {
    window.dispatchEvent(new CustomEvent('showToast', { detail: {message: message, type: type, icon: icon, time: time} }));
}


export { __i, encryptPassword, verifyPassword, showToast };
