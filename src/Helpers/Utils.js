const bcrypt = require('bcrypt');
const saltRounds = 12;
class Utils {

    /**
     * FUnção para tradução
     * @param {String} value 
     * @return String
     */
    static __i(value) {
        return value
    }


    /**
     * 
     * @param { string } password 
     * @returns 
     */
    static async encryptPassword(password) {
        return bcrypt.hash(password, saltRounds);
    }

    static async verifyPassword(password, hash) {
        return bcrypt.compare(password, hash);
    }

}

export default Utils;
