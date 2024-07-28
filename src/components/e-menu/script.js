import { loadModel } from '../../Helpers/loadModels';


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
        },
        type: {
            type: String,
            default: 'bayPass'
        },

    },
    data() {
        return {
            canAccess: true,
        };
    },
    async mounted() { 
        this._canAccess()
    },
    methods: {
        async _canAccess() {
            if(this.type != "bayPass") {
                const model = await loadModel(this.type);
                const entity = new model()
                this.canAccess = await entity.canUser('accessArea');
            }
        },
    },
};
