
import { loadModel } from '../../Helpers/loadModels';
import { showToast } from '../../Helpers/Utils';

export default {
    name: 'e-dashboard',
    async mounted() {
        this.organization = await this.$Licence.getLicence();
    },
    data() {
        return {
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
        async newUser(addActions) {
            const model = await loadModel('User');
            this.entity = new model();
            this.entity.owner = this.organization.id
            this.entity.status = 1
            addActions.addOpenModal();
        },
        async save(modal) {
            this.response = await modal.save();

            if (!this.response.error) {
                showToast(this.$__i('Usuario cadastrado com sucesso'), 'success');
                this.entity = {}
            } else {
                showToast(this.$__i('Corrija os erros para continuar'), 'error');
                this.errors = this.response.data;
            }
        }
    },
};