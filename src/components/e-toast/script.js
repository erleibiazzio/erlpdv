export default {
    name: 'e-toast',
    async mounted() {
        window.addEventListener("showToast", this.populateToast);
    },
    props: {},
    data() {
        return {
            options: {
                message: "Mensgame teste grande para verificar como fica o tamenho da div e decidir se devo controlar o tamanho",
                type: "success",
                time: 1500,
                icon: null
            }
        };
    },
    methods: {
        populateToast(data) {
            this.options = {};
            this.options = data.detail;
            this.options.type = this.dictType(this.options.type);
            this.options.icon = this.dictIcon(this.options.type)
            this.showToast();
        },
        showToast() {
            const toast = this.$refs.toast;
            toast.classList.add('active');

            setTimeout(() => {
                toast.classList.remove('active');
            }, this.options.time);
        },
        dictType(type) {
            let value = null;
            switch (type) {
                case 'danger':
                case 'error':
                case 'erro':
                    value =  'danger';
                    break;
                case 'success':
                case 'sucesso':
                case 'ok':
                    value =  'success';
                    break;
                case 'warning':
                case 'atention':
                case 'eita':
                    value =  'warning';
                    break;
                default:
                    value = 'secondary'
                    break;
            }

            return value
        },
        dictIcon(type) {
            let value = null;
            switch (type) {
                case 'danger':
                case 'error':
                case 'erro':
                    value =  'error';
                    break;
                case 'success':
                case 'sucesso':
                case 'ok':
                    value =  'success';
                    break;
                case 'warning':
                case 'atention':
                case 'eita':
                    value =  'warning';
                    break;
                default:
                    value = 'secondary'
                    break;
            }

            return value
        }
    },
};
