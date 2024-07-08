export default {
    name: 'e-theme',
    data() {
        return {
            licenceActive: false,
            info: {},
            version: process.env.VUE_APP_VERSION
        };
    },
    methods: {},
    async mounted() {
        this.licenceActive = await this.$licenceActive;
        this.info = await this.$Licence.getLicence();
    },
    computed: {
        currentYear() {
            return new Date().getFullYear();
        }
    }
};