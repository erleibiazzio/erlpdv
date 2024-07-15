
import { descriptions } from "@/models/EntityDescriptions";

export default {
    name: 'e-field',
    async mounted() {
        window.addEventListener("saveErrors", this.saveErros);
        this.fieldId = `${this.prop}-${this.uuidv4()}`;
        this.descriptions = await descriptions();
    },
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
        },
        size: {
            type: String,
            defailt: '12',
        },
        mask: {
            type: String,
            default: null,
        },
        required: {
            type: Boolean,
            default: false
        }
    },
    computed: {
       
    },
    data() {
        return {
            descriptions: {},
            errors: {},
            fieldId: null
        };
    },

    methods: {
        isRequired() {
            if(this.required) {
                return true;
            }

            const desc = this.descriptions[this.entity.slug];

            if (desc && this.prop in desc) {
                if(!this.descriptions[this.entity.slug][this.prop].allowNull) {
                    return true
                }
            }

            return false
        },
        is(value) {
            if (this.type === value) {
                return true;
            }

            return false;
        },
        uuidv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        change(event) {
            let oldValue = this.entity[this.prop] ? JSON.parse(JSON.stringify(this.entity[this.prop])) : null;
            this.entity[this.prop] = event.target.value
            this.$emit('change', {entity: this.entity, prop: this.prop, oldValue: oldValue, newValue: event.target.value});
        },
        saveErros(data) {
            let errors = {};
            data.detail.errors.forEach(element => {
                errors[element.path] = element.message
            });

            this.errors = errors
        },
        hasError() {
            // eslint-disable-next-line no-prototype-builtins
            return this.errors.hasOwnProperty(this.prop);
        }
    },
};
