export default {
    name: 'e-breadcrumb',
    props: {
        label: {
            type: String,
            default: "Meu breadcrumb"
        },
        icon: {
            type: [Boolean, String],
            default: false
        },
        sizeIcon: {
            type: String,
            default: "72:72"
        },
        navigation: {
            type: Array,
            default: [{label: "nav1", route:"/"},{label: "nav2", route:"/"}]
        }
    },
    data() {
        return {};
    },
    methods: {},
};