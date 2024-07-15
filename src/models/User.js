// src/models/User.js
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../database');
const Entity = require('../abstracts/Entity');
const { validateCPF, validateCNPJ } = require('../Helpers/validators');

class User extends Entity {
    // Defina atributos específicos do modelo User, se necessário
}

async function checkUniqueField(fieldName, value, user, errorMessages) {
    const existingUser = await User.findOne({ where: { [fieldName]: value } });
    if (existingUser && existingUser.id !== user.id) {
        const validationError = new Sequelize.ValidationError();
        validationError.errors.push(new Sequelize.ValidationErrorItem(
            errorMessages[fieldName],
            'unique violation',
            fieldName,
            value
        ));
        throw validationError;
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
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
        unique: true,
        validate: {
            notNull: {
                msg: 'O e-mail é obrigatório'
            },
            notEmpty: {
                msg: 'O e-mail é obrigatório'
            },
            isEmail: {
                msg: 'O e-mail informado é invalido'
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
        }
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    owner: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    slug: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
        defaultValue: 'user',
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
            isValid() {
                if (this.password != this.repassword) {
                    throw new Error('A senha e a confirmação de senha devem ser iguais');
                }
            }
        },
    },
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

            await checkUniqueField('document', user.document, user, errorMessages);
            await checkUniqueField('email', user.email, user, errorMessages);
            await checkUniqueField('username', user.username, user, errorMessages);
        }
    },
});

module.exports = User;
