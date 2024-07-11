import icons from './defaults.json';

export default {
    name: 'e-icon',
    props: {
        name: {
            type: String,
            default: "tdesign:file-icon"
        },
        size: {
            type: String,
            default: "24:24"
        }
    },
    data() {
        return {
            iconName: "",
            height: null,
            width: null,
        };
    },
    computed: {
        icons() {
            return icons;
        }
    },
    async mounted() {
        let sizes = this.size.split(':');
        this.width = sizes[0];
        this.height = sizes[1];
        this.iconName = this.name in icons ? icons[this.name] : this.name;
    },
    methods: {},
};
