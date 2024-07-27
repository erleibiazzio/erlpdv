/* eslint-disable no-undef */
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { Icon } from '@iconify/vue';
import { vMaska } from "maska/vue";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import router from './router';
const { __i, openModal } = require('./Helpers/Utils');
import './assets/sass/global.scss';
import Licence from './models/Licence';
import User from './models/User';
import Role from './models/Role';
import { getSession } from './session';
import API from './Helpers/API';
import { useAuthStore } from './stores/auth';
import { useGlobalStore } from './stores/globalStore';
import { usePermissionStore } from './stores/permissionStore';

let userAuth =  null
let session =  null
let role =  null
const sessionStorage = localStorage.getItem('sessionId');
if (sessionStorage) {
    session = await getSession(sessionStorage);
    if (session) {
        userAuth = await User.findByPk(session.userId);
        role =  await Role.findByPk(userAuth.id);
    }
}

const app = createApp(App);
const pinia = createPinia();

// Configurações globais
app.config.globalProperties.$Licence = Licence;
app.config.globalProperties.$__i = __i;
app.config.globalProperties.$openModal = openModal;
app.config.globalProperties.$api = new API();
app.config.globalProperties.$licenceActive = await Licence.isActive();

// Copartilhamento global
globalThis.authUser = userAuth
globalThis.user =  {
    role: role
}

// Registrando componentes globais
import EAlert from './components/e-alert/ErIndex.vue';
import EBreadcrumb from './components/e-breadcrumb/ErIndex.vue';
import ECard from './components/e-card/ErIndex.vue';
import EDashboard from './components/e-dashboard/ErIndex.vue';
import EField from './components/e-field/ErIndex.vue';
import ETheme from './components/e-theme/ErIndex.vue';
import EIcon from './components/e-icon/ErIndex.vue';
import EMenu from './components/e-menu/ErIndex.vue';
import EModal from './components/e-modal/ErIndex.vue';
import ETable from './components/e-table/ErIndex.vue';
import EToast from './components/e-toast/ErIndex.vue';

app.component('VIconify', Icon);
app.directive('maska', vMaska);
app.component('e-alert', EAlert);
app.component('e-breadcrumb', EBreadcrumb);
app.component('e-card', ECard);
app.component('e-dashboard', EDashboard);
app.component('e-field', EField);
app.component('e-theme', ETheme);
app.component('e-icon', EIcon);
app.component('e-menu', EMenu);
app.component('e-modal', EModal);
app.component('e-table', ETable);
app.component('e-toast', EToast);

// Uso do roteador e Pinia na aplicação Vue
app.use(router);
app.use(pinia); // Importante: configurar o Pinia antes de usar qualquer store

// Criando a instância da store de autenticação
const authStore = useAuthStore();
const globalStore = useGlobalStore();
const permissionStore = usePermissionStore();

if(session && userAuth) {
    authStore.login({
        user: userAuth,
        sessionId: session.sessionId,
        role: role
    });
}

// Registrando a store de autenticação globalmente
app.config.globalProperties.$authStore = authStore;
app.config.globalProperties.$globalStore = globalStore;
app.config.globalProperties.$permissionStore = permissionStore;

// Montando a aplicação Vue no elemento com id 'app' no HTML
app.mount('#app');
