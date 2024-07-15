export default {
    name: 'e-modal',
    props: {
        identifier: {
            type: String,
            default: 'exampleModal'
        },
        title: {
            type: String,
            default: 'Título do modal'
        },
        entity: {
            type: Object,
            required: true
        },
        type: {
            type: String,
            default: 'lg'
        },
    },
    data() {
        return {};
    },
    async mounted() { },
    methods: {
        async save() {
            try {
                await this.entity.validate();         
                await this.entity.save();
                window.dispatchEvent(new CustomEvent('saveSuccess', { detail: { errors: this.entity } }));
                return {
                    error: false,
                    data: this.entity
                }

            } catch (error) {
               
                window.dispatchEvent(new CustomEvent('saveErrors', { detail: { errors: error.errors } }));
                return {
                    error: true,
                    data: error.errors
                }
            }
        }
    },
};
