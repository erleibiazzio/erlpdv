/* eslint-disable no-unused-vars */

import { loadModel } from '../../Helpers/loadModels';
import { showToast, dispatchEvent } from '../../Helpers/Utils';
import { listCanUserMethods } from './permissionsDefinitions';

export default {
    name: 'e-dashboard',
    async mounted() {
        this.organization = await this.$Licence.getLicence();
    },
    data() {
        return {
            userPermissions: {},
            keyWordsFilters: ['username', 'name', 'email'],
            modalEntity: {},
            modalInstance: {},
            response: {},
            errors: {},
            organization: {},
            entity: {},
            columns: [
                { label: "Nome", value: "name", slug: "name" },
                { label: "Usuário", value: "username", slug: "username" },
                { label: "E-mail", value: "email", slug: "email" },
                { label: "Status", value: "statusName", slug: "statusName" },
                { label: "Data de cadastro", value: "createdAt.dateTime('numeric year')", slug: "createdAt" },
                { label: "Ações", value: "", slug: "actions" },
            ],
            statusOptions: [
                { label: 'Ativado', value: 1 },
                { label: 'Desativado', value: 2 },
                { label: 'Rascunho', value: 3 },
            ]
        };
    },
    computed: {

        complementCurrentPermissions() {
            return ['alterPermissions'];
        },
        breadcrumb() {
            return [
                { label: this.$__i('Home'), route: "/" },
                { label: this.$__i('Usuários') }
            ]
        },
        permissions() {
            return listCanUserMethods();
        }
    },
    methods: {
       async alterPermission(entity) {
            this.userPermissions = {};
            let userPermissions = {};

            this.modalEntity = entity;
            const Permission = await loadModel('Permission');
            userPermissions = await Permission.findAll({where: {userId: entity.id}});

            if(userPermissions) {
                for (const permission of userPermissions) {
                    let target = `${permission.objectType}:${permission.action}`;
                    this.userPermissions[target] = true;
                }
            }

            this.modalInstance = this.$openModal('alterPermissions');
        },
        async savePermissions() {
            try {
                const _PermissionQueue = await loadModel('PermissionQueue');
                const _User = await loadModel('User');
                const user = await _User.findByPk(this.modalEntity.id);

                await user.clearAllPermissions();

                Object.keys(this.userPermissions).forEach(async item => {
                    if (item) {
                        if(this.userPermissions[item]) {
                            let _permission = item.split(":");
                            let action = _permission[1];
                            let objectType = _permission[0];
    
                            let permission = new _PermissionQueue()
                            permission.userId = this.modalEntity.id;
                            permission.objectType = objectType;
                            permission.action = action;
                            permission.objectIds = [];
                            permission.status = 0;
                            await permission.save()
                        }
                    }
                });

                dispatchEvent('saveSuccess', { entity: user });
                showToast(this.$__i(`As permissões do usuario ${user.username} foi salva com sucesso`), 'success');
                this.modalInstance.hide();
            } catch (error) {
                showToast(this.$__i('Corrija os erros para continuar'), 'error');
                dispatchEvent('saveErrors', { errors: error.errors });
            }

        },
        async edit() {
            try {
                const model = await loadModel('User');
                let entity = await model.findByPk(this.modalEntity.id)

                if (!await entity.canUser('modify')) {
                    showToast(this.$__i('Você nao tem permissão para executar esta ação'), 'error');
                    return;
                }

                let user = await entity.populateDiff(this.entity);
                await user.save();

                this.modalInstance.hide();
                dispatchEvent('saveSuccess', { entity: user });
                dispatchEvent('tableRefresh');
                showToast(this.$__i('Usuário editado com sucesso'), 'success');
                this.entity = {}

            } catch (error) {
                showToast(this.$__i('Corrija os erros para continuar'), 'error');
                dispatchEvent('saveErrors', { errors: error.errors });
            }
        },
        async startEdit(entity) {
            this.entity = {};
            dispatchEvent('saveErrors', { errors: [] });
            const model = await loadModel('User');
            const instance = await model.findByPk(entity.id);

            if (!await instance.canUser('modify')) {
                showToast(this.$__i('Você nao tem permissão para executar esta ação'), 'error');
                return;
            }

            this.modalEntity = instance.get({ plain: true });
            const ignore = ['password', 'repassword'];

            this.entity.slug = "user"
            Object.keys(entity.dataValues).forEach((field) => {
                if (!ignore.includes(field)) {
                    this.entity[field] = this.modalEntity[field];
                }
            });

            this.modalInstance = this.$openModal('editUser');

        },
        async newUser() {
            this.entity = {};
            this.entity.slug = "user"
            this.entity.owner = this.organization.id
            this.entity.status = 1
            this.modalInstance = this.$openModal('addUser');
        },
        async save() {
            try {
                const model = await loadModel('User');
                let entity = new model();

                await entity.populate(this.entity);
                await entity.save();

                this.modalInstance.hide();
                dispatchEvent('saveSuccess', { entity: entity });
                dispatchEvent('tableRefresh');
                showToast(this.$__i('Usuario cadastrado com sucesso'), 'success');
                this.entity = {}

            } catch (error) {
                showToast(this.$__i('Corrija os erros para continuar'), 'error');
                dispatchEvent('saveErrors', { errors: error.errors });
            }
        }
    },
};