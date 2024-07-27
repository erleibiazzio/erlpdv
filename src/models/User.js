/* eslint-disable no-undef */
// src/models/User.js
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../database');
const Entity = require('../abstracts/Entity');
const { validateCPF, validateCNPJ } = require('../Helpers/validators');
const { encryptPassword } = require('../Helpers/Utils');
const Role = require('./Role');

class User extends Entity {
    async isAdmin(userId) {
        const _userId = userId || this.id;
        const role = await Role.findBy({userId: _userId});
        if(role && role.role === 'admin') {
            return true
        }

        return false;
    }

    async canUserDelete(userId = null) {

        if(this.id == globalThis.authUser.id) {
            return false;
        }

        return this.checkPermission('delete', userId);
    }

    async canUserAlterStatus(userId = null) {

        if(this.id == globalThis.authUser.id) {
            return false;
        }

        return this.checkPermission('alsterStatus', userId);
    }
}

// Função para verificar unicidade de campos
async function checkUniqueField(fieldName, value, user, errorMessages) {
    // eslint-disable-next-line no-useless-catch
    try {
        const existingUser = await User.findOne({ where: { [fieldName]: value } });
        if (existingUser && existingUser.id !== user.id) {
            throw new Sequelize.ValidationError(null, [
                new Sequelize.ValidationErrorItem(
                    errorMessages[fieldName],
                    'unique violation',
                    fieldName,
                    value
                )
            ]);
        }
    } catch (error) {
        throw error;
    }
}

User.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'O Nome do usuário é obrigatório'
            },
            notEmpty: {
                msg: 'O Nome do usuário é obrigatório'
            },
        }
    },
    document: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: 'O CPF ou CNPJ é obrigatório'
            },
            notEmpty: {
                msg: 'O CPF ou CNPJ é obrigatório'
            },
            isValid(value) {
                if (!validateCPF(value) && !validateCNPJ(value)) {
                    throw new Error('CPF ou CNPJ inválido');
                }
            }
        },
        set(value) {
            this.setDataValue('document', value.replace(/\D/g, ''));
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'Este nome de usuário já está em uso, por favor, escolha outro.'
        },
        validate: {
            notNull: {
                msg: 'O usuário é obrigatório'
            },
            notEmpty: {
                msg: 'O usuário é obrigatório'
            },
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'Este e-mail já está sendo utilizado por outro usuário, por favor, escolha outro.'
        },
        validate: {
            notNull: {
                msg: 'O e-mail é obrigatório'
            },
            notEmpty: {
                msg: 'O e-mail é obrigatório'
            },
            isEmail: {
                msg: 'O e-mail informado é inválido'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'A senha é obrigatória'
            },
            notEmpty: {
                msg: 'A senha é obrigatória'
            },
        },
    },
    repassword: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'A confirmação de senha é obrigatória'
            },
            notEmpty: {
                msg: 'A confirmação de senha é obrigatória'
            },
            async isValid() {
                if (this.repassword !== this.password) {
                    throw new Error('A senha e a confirmação de senha devem ser iguais');
                }
            }
        }
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: Entity.STATUS_ACTIVE,
    },
    owner: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    slug: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
        defaultValue: 'user',
    }
}, {
    sequelize,
    modelName: 'User',
    hooks: {
        beforeCreate: async (user) => {
            const errorMessages = {
                email: 'Este e-mail já está sendo utilizado por outro usuário, por favor, escolha outro.',
                document: 'Este CPF ou CNPJ já está em uso por outro usuário, por favor, escolha outro.',
                username: 'Este nome de usuário já está em uso, por favor, escolha outro.',
            };

            await Promise.all([
                checkUniqueField('document', user.document, user, errorMessages),
                checkUniqueField('email', user.email, user, errorMessages),
                checkUniqueField('username', user.username, user, errorMessages),
            ]);
        },
        beforeSave: async (user) => {
            if (user.password) {
                user.password = await encryptPassword(user.password);
            }
        }
    }
});

module.exports = User;
