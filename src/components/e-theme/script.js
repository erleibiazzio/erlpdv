import { destroySession } from '../../session'
export default {
    name: 'e-theme',
    data() {
        return {
            licenceActive: false,
            info: {},
            version: process.env.VUE_APP_VERSION,
            showUserAction: false,
        };
    },
    methods: {
        async logout() {
            let sessionStorage = localStorage.getItem('sessionId');
            this.$authStore.logout();
            await destroySession(sessionStorage);
        },
        toggleUserAction() {
            this.showUserAction = !this.showUserAction
        },
    },
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