// src/main.js
import { createApp } from 'vue';
import App from './App.vue';

// Importando Bootstrap CSS e JavaScript
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import router from './router';

// Importação de classes Helpers Globais
const Utils = require('./Helpers/Utils');

// Importando o arquivo global de estilos SCSS
import './assets/sass/global.scss';

// Importando entidades
import Licence from './models/Licence';

// Criando a aplicação Vue
const app = createApp(App);

// Registrando entidades de forma global
app.config.globalProperties.$Licence = Licence;
app.config.globalProperties.$__i = Utils.__i;

// Registrando valores de forma global
app.config.globalProperties.$licenceActive = await Licence.isActive();

// Importando componentes
import EAuth from './components/e-auth/ErIndex.vue';
import EActive from './components/e-active/ErIndex.vue';
import ETheme from './components/e-theme/ErIndex.vue';
import EUsers from './components/e-users/ErIndex.vue';
import EDashboard from './components/e-dashboard/ErIndex.vue';

app.component('e-active', EActive);
app.component('e-auth', EAuth);
app.component('e-theme', ETheme);
app.component('e-users', EUsers);
app.component('e-dashboard', EDashboard);

// roteador
app.use(router);

// Montando a aplicação Vue no elemento com id 'app' no HTML
app.mount('#app');
