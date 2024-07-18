
import { loadModel } from '../../Helpers/loadModels';
import { showToast, dispatchEvent, encryptPassword } from '../../Helpers/Utils';

export default {
    name: 'e-dashboard',
    async mounted() {
        this.organization = await this.$Licence.getLicence();
        this.entity.slug = "user"
        this.entity.owner = this.organization.id
        this.entity.status = 1
    },
    data() {
        return {
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
        async newUser() {
            this.modalInstance = this.$openModal('addUser');
        },
        async save() {
            try {
                const model = await loadModel('User');
                let entity = new model();
                
                await entity.populate(this.entity);
                entity.password = await encryptPassword(this.entity.password);
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