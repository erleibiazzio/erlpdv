export default {
    name: 'e-modal',
    async mounted() { },
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
        return { };
    },
    methods: {},
};
