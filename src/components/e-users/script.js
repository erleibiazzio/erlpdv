
export default {
    name: 'e-dashboard',
    data() {
        return {
            columns: [
                { label: "Usuário", value: "username" },
                { label: "Status", value: "status"},
                { label: "Data de cadastro", value: "createdAt.dateTime('numeric year')"},
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
    methods: {},
};