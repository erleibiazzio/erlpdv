// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import { Icon } from '@iconify/vue';
import { vMaska } from "maska/vue"

import API from './Helpers/API'; // Importe a classe API

// Importando Bootstrap CSS e JavaScript
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import router from './router';

// Importação de classes Helpers Globais
const { __i } = require('./Helpers/Utils');

// Importando o arquivo global de estilos SCSS
import './assets/sass/global.scss';

// Importando entidades
import Licence from './models/Licence';

// Criando a aplicação Vue
const app = createApp(App);

// Registrando entidades de forma global
app.config.globalProperties.$Licence = Licence;
app.config.globalProperties.$__i = __i;

const api = new API();
app.config.globalProperties.$api = api;

// Registrando valores de forma global
app.config.globalProperties.$licenceActive = await Licence.isActive();

// Importando componentes
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

// roteador
app.use(router);

// Montando a aplicação Vue no elemento com id 'app' no HTML
app.mount('#app');
