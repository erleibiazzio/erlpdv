
import { loadModel } from '../../Helpers/loadModels';

export default {
    name: 'e-table',
    props: {
        type: {
            type: [Boolean, String],
            default: false
        },
        buttonAddLabel: {
            type: String,
            default: "Novo"
        },
        entities: {
            type: Array,
            default: []
        },
        columns: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            filters: {
                maxRecords: 10
            },
            records: [],
            headers: {}
        };
    },
    computed: {
        maxRecordsOtions() {
            return [
                { label: 3, value: 3 },
                { label: 10, value: 10 },
                { label: 20, value: 20 },
                { label: 30, value: 30 },
                { label: 40, value: 40 },
                { label: 50, value: 50 },
                { label: 100, value: 100 },
                { label: 200, value: 200 },
                { label: 300, value: 300 },
                { label: 400, value: 400 },
            ]
        }
    },
    async mounted() {
        await this.fetchRecords();
    },
    methods: {
        getEntityData(obj, value) {
            let val = eval(`obj.${value}`);
            return val;
        },
        async fetchRecords() {
            try {
                if (this.type) {
                    const model = await loadModel(this.type);
                    const records = await model.findAll({ limit: this.filters.maxRecords });
                    this.records = records.map(record => record.get({ plain: true }));
                    if (records.length > 0) {
                        this.headers = Object.keys(records[0].get({ plain: true }));
                    }
                } else {
                    this.records = this.entities
                }
            } catch (error) {
                console.error('Failed to fetch records:', error);
            }
        }
    },
};
