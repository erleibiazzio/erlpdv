
import { loadModel } from '../../Helpers/loadModels';
const { Sequelize } = require('sequelize');
import { Modal } from 'bootstrap'; // Importa Modal do Bootstrap
import { showToast } from '../../Helpers/Utils';


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
        },
        addModalIdentifier: {
            type: String,
            default: "exampleModal"
        },
        actionOptions: {
            type: Array,
            default:['edit', 'trash', 'locked', 'unlocked']
        },
    },
    data() {
        return {
            count: 0,
            pages: 0,
            filters: {
                maxRecords: 10
            },
            records: [],
            headers: {},
            slug: "",
            currentPage: 1,
            maxVisiblePages: 5,
            entityModal: {},
            modalInstance: {}
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
        },
        visiblePages() {
            const startPage = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2));
            let endPage = startPage + this.maxVisiblePages - 1;
            if (endPage > this.pages) {
                endPage = this.pages;
            }
            const pages = [];
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            return pages;
        }
    },
    async mounted() {
        await this.fetchRecords();
    },
    methods: {
        async pagination(model) {
            this.count = await model.count({
                where: {
                    status: { [Sequelize.Op.gte]: 1 }
                }
            });

            this.pages = Math.ceil(this.count / this.filters.maxRecords);
        },
        getEntityData(obj, value) {
            if(value) {
                let val = eval(`obj.${value}`);
                return val;
            }
        },
        async fetchRecords() {
            try {
                if (this.type) {
                    const model = await loadModel(this.type);
                    this.pagination(model);

                    let offset = (this.currentPage - 1) * this.filters.maxRecords

                    const records = await model.findAll({ limit: parseInt(this.filters.maxRecords), offset: offset });
                    this.records = records.map(record => record.get({ plain: true }));
                    if (records.length > 0) {
                        this.headers = Object.keys(records[0].get({ plain: true }));
                    }
                } else {
                    this.records = this.entities
                }
            } catch (error) {
                console.log(error.erros)
                console.error('Failed to fetch records:', error);
            }
        },
        async goToPage(page) {
            if (page !== this.currentPage && page >= 1 && page <= this.pages) {
                this.currentPage = page;
            }

            await this.fetchRecords();
        },
        validatePage(value) {
            this.currentPage = "";
            let page = parseInt(value);

            if (isNaN(page)) {
                page = 1;
            }

            if (page < 1) {
                page = 1;
            }

            if (page >= this.pages) {
                page = this.pages;
            }

            this.currentPage = page;

            this.$nextTick(() => {
                // Seleciona o valor do input após a atualização
                const inputElement = this.$refs.currentPageInput;
                inputElement.select(); // Seleciona o texto no input
            });

            this.goToPage(page);
        },
        selectValue() {
            const inputElement = this.$refs.currentPageInput;
            inputElement.select(); // Seleciona o texto no input quando ele recebe foco
        },
        addOpenModal() {
           const modal = document.getElementById(this.addModalIdentifier);
           const modalInstance = new Modal(modal);
           modalInstance.show()
        },
        async alterStatus(item, status) {
            const model = await loadModel(this.type);
            let entity = await model.findOne({where: {id: item.id}});
            entity.status = entity.statusByName(status);

            this.entityModal = {
                entity: entity,
                status: entity.statusByNamePt(status)
            };

            const modal = document.getElementById('alterStatusModal');
            this.modalInstance = new Modal(modal);
            this.modalInstance.show()
        },
        async editStatus(entity) {
            try {
                await entity.save();
                await this.fetchRecords();
                showToast('Status alterado com sucesso');

                this.modalInstance.hide();

            } catch (error) {
                throw new Error('A senha e a confirmação de senha devem ser iguais');
            }
        }
    },
};
