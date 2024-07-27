
import { loadModel } from '../../Helpers/loadModels';
import { showToast, dispatchEvent } from '../../Helpers/Utils';

export default {
    name: 'e-dashboard',
    async mounted() {
        this.organization = await this.$Licence.getLicence();
    },
    data() {
        return {
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

        breadcrumb() {
            return [
                { label: this.$__i('Home'), route: "/" },
                { label: this.$__i('Usuários') }
            ]
        }
    },
    methods: {
        async edit() {
            try {
                const model = await loadModel('User');
                let entity = await model.findByPk(this.modalEntity.id)

                if(!await entity.canUser('modify')) {
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

            if(!await instance.canUser('modify')) {
                showToast(this.$__i('Você nao tem permissão para executar esta ação'), 'error');
                return;
            }

            this.modalEntity = instance.get({ plain: true });
            const ignore = ['password', 'repassword'];

            this.entity.slug = "user"
            Object.keys(entity.dataValues).forEach((field) => {
                if(!ignore.includes(field)) {
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