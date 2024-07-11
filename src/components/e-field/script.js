export default {
    name: 'e-field',
    props: {
        entity: {
            type: Object,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        prop: {
            type: String,
            required: true,
        },
        label: {
            type: String
        },
        placeholder: {
            type: String
        },
        options: {
            type: Array,
            default: []
        }
    },
    data() {
        return {};
    },
    async mounted() {

    },
    methods: {
        is(value) {
            if (this.type === value) {
                return true;
            }

            return false;
        }
    },
};
