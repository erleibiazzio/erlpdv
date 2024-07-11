export default {
    name: 'e-menu',
    props: {
        label: {
            type: String,
            default: "Label do menu"
        },
        route: {
            type: String,
            default: "/"
        },
        icon: {
            type: [Boolean, String],
            default: false
        },
        iconSize: {
            type: String,
            default: "24:24"
        }

    },
    data() {
        return {};
    },
    async mounted() { },
    methods: {},
};
