/* eslint-disable no-unused-vars */
import User from '../../models/User';
import Permission from '../../models/Permission';

const entities = [
    {
        model: User,
        slug: "User",
        label: "Usuários",
        avaliable: ["all"]
    }
]

const dict = {
    canUserAccessArea: {
        label: "Acessar área admnistrativa",
        type: "accessArea"
    },
    canUserAlterStatus: {
        label: "Alterar status",
        type: "alterStatus"
    },
    canUserCreate: {
        label: "Cadastrar",
        type: "create"
    },
    canUserView: {
        label: "Visualizar",
        type: "view"
    },
    canUserModify: {
        label: "Modificar",
        type: "modify"
    },
    canUserDelete: {
        label: "Deletar",
        type: "delete"
    },
    canUserAlterPermissions: {
        label: "Alterar permissões",
        type: "alterPermissions"
    },
}

function listAllMethodsIncludingInherited(cls) {
    const methods = new Set();
    let prototype = cls.prototype;

    while (prototype) {
        Object.getOwnPropertyNames(prototype).forEach(prop => {
            if (prop.startsWith('canUser')) {
                if (prop != "canUser") {
                    methods.add(prop)
                }
            }
        });
        prototype = Object.getPrototypeOf(prototype);
    }

    return Array.from(methods).sort();

}

function listCanUserMethods() {

    const permissionsList = [];

    Object.values(entities).forEach((item) => {
        let data = {
            label: item.label,
            slug: item.slug,
        }

        data.permissions = [];
        listAllMethodsIncludingInherited(item.model).forEach(permission => {
            if(item.avaliable.includes('all') || item.avaliable.includes(permission)) {
                data.permissions.push(dict[permission])
            }
        })
        
        permissionsList.push(data)
    })

    return permissionsList;
}


export { listCanUserMethods };
