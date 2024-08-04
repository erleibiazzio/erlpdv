/* eslint-disable no-undef */

import { loadModel } from '../../Helpers/loadModels';
const { Op } = require('sequelize');
import { showToast } from '../../Helpers/Utils';


export default {
    name: 'e-table',
    async mounted() {
        this.model = await loadModel(this.type);
        const entity = new this.model()
        this.canUserCreate = await entity.canUser('create');

        window.addEventListener("tableRefresh", this.fetchRecords);
        await this.fetchRecords();
    },
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
            default: ['edit', 'trash', 'locked', 'unlocked']
        },
        keyWordsFilters: {
            type: [Boolean, Array],
            default: false
        },
        complementCurrentPermissions: {
            type: [Boolean, Array],
            default: false
        }
    },

    data() {
        return {
            canUserCreate: false,
            model: null,
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
            modalInstance: {},
            searchTimeout: null,
            keyword: ""
        };
    },
    watch: {
        'filters.search'(_new, _old) {
            if (_new != _old) {
                this.searchKeyWords(_new);
            }
        },
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
    methods: {
        searchKeyWords(keyword) {
            this.keyword = "";
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.keyword = keyword || ""
                this.fetchRecords();
            }, 1500);

        },
        async pagination(model) {
            let where = { status: { [Op.gt]: 0 } };
            if (this.keyword && this.keyWordsFilters) {

                let filters = [];
                this.keyWordsFilters.forEach(element => {
                    let data = { [element]: { [Op.like]: `%${this.keyword}%` } }
                    filters.push(data);
                    
                });

                where[Op.or] = filters
            }

            this.count = await model.count({
                where: where
            });

            this.pages = Math.ceil(this.count / this.filters.maxRecords);
        },
        getEntityData(obj, value) {
            if (value) {
                let val = eval(`obj.${value}`);
                return val;
            }
        },
        async fetchRecords() {
            this.records = [];

            if (this.type) {
                this.pagination(this.model);

                let offset = (this.currentPage - 1) * this.filters.maxRecords

                let where = { status: { [Op.gt]: 0 } }

                if (this.keyword && this.keyWordsFilters) {

                    let filters = [];
                    this.keyWordsFilters.forEach(element => {
                        let data = { [element]: { [Op.like]: `%${this.keyword}%` } }
                        filters.push(data);
                        
                    });
    
                    where[Op.or] = filters
                }

                const records = await this.model.findAll({ limit: parseInt(this.filters.maxRecords), offset: offset, where: where });

                for (const record of records) {
                    if (await record.canUser('view')) {
                        let data = record;

                        data.currentPermissions =  {
                            canUserCreate: await record.canUser('create'),
                            canUserView: await record.canUser('view'),
                            canUserModify: await record.canUser('modify'),
                            canUserDelete: await record.canUser('delete'),
                            canUserAlterStatus: await record.canUser('alterStatus'),
                        };

                        if(this.complementCurrentPermissions) {

                            for(let permission of this.complementCurrentPermissions) {
                                let method = "canUser"+permission.charAt(0).toUpperCase() + permission.slice(1);
                                data.currentPermissions[method] = await record.canUser(permission)
                            }
                        }

                        this.records.push(data);
                    }
                }
            } else {
                this.records = this.entities
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
                const inputElement = this.$refs.currentPageInput;
                inputElement.select();
            });

            this.goToPage(page);
        },
        selectValue() {
            const inputElement = this.$refs.currentPageInput;
            inputElement.select();
        },
        async alterStatus(item, status) {
            const model = await loadModel(this.type);
            let entity = await model.findOne({ where: { id: item.id } });

            if (!await entity.canUser('alterStatus')) {
                showToast(this.$__i('Você nao tem permissão para executar esta ação'), 'error');
                return;
            }

            entity.status = parseInt(entity.statusByName(status));

            this.entityModal = {
                entity: entity,
                status: entity.statusIdByName(status)
            };

            this.modalInstance = this.$openModal('alterStatusModal');
        },
        async editStatus() {
            try {
                if (!await this.entityModal.entity.canUser('alterStatus')) {
                    showToast(this.$__i('Você nao tem permissão para executar esta ação'), 'error');
                    return;
                }

                await this.entityModal.entity.save();
                await this.fetchRecords();
                showToast('Status alterado com sucesso');
                this.modalInstance.hide();
            } catch (error) {
                throw new Error(error);
            }
        },
        async deleteEntity(item) {
            const model = await loadModel(this.type);
            let entity = await model.findOne({ where: { id: item.id } });

            if (!await entity.canUser('delete')) {
                showToast(this.$__i('Você nao tem permissão para executar esta ação'), 'error');
                return;
            }

            entity.status = entity.statusByName('trash');

            this.entityModal = {
                entity: entity
            };

            this.modalInstance = this.$openModal('deleteModal');
        },
        async deleteRecord(entity) {
            if (!await entity.canUser('delete')) {
                showToast(this.$__i('Você nao tem permissão para executar esta ação'), 'error');
                return;
            }

            await entity.save();
            await this.fetchRecords();
            showToast('Registro deletado com sucesso');

            this.modalInstance.hide();
        },
    },
};
