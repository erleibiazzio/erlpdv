// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import { Icon } from '@iconify/vue';

import API from './Helpers/API'; // Importe a classe API

// Importando Bootstrap CSS e JavaScript
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import router from './router';

// Importação de classes Helpers Globais
const Utils = require('./Helpers/Utils').default;

// Importando o arquivo global de estilos SCSS
import './assets/sass/global.scss';

// Importando entidades
import Licence from './models/Licence';

// Criando a aplicação Vue
const app = createApp(App);

// Registrando entidades de forma global
app.config.globalProperties.$Licence = Licence;
app.config.globalProperties.$__i = Utils.__i;

const api = new API();
app.config.globalProperties.$api = api;

// Registrando valores de forma global
app.config.globalProperties.$licenceActive = await Licence.isActive();

// Importando componentes
import ETheme from './components/e-theme/ErIndex.vue';
import EDashboard from './components/e-dashboard/ErIndex.vue';
import ECard from './components/e-card/ErIndex.vue';
import EAlert from './components/e-alert/ErIndex.vue';

app.component('e-alert', EAlert);
app.component('e-theme', ETheme);
app.component('e-card', ECard);
app.component('e-dashboard', EDashboard);
app.component('e-icon', Icon);

// roteador
app.use(router);

// Montando a aplicação Vue no elemento com id 'app' no HTML
app.mount('#app');
