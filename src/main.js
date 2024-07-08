// src/main.js
import { createApp } from 'vue';
import App from './App.vue';

// Importando Bootstrap CSS e JavaScript
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Importando o arquivo global de estilos SCSS
import './assets/sass/global.scss';

// Importando entidades
import Licence from './models/Licence';

// Criando a aplicação Vue
const app = createApp(App);

// Registrando entidades de forma global
app.config.globalProperties.$Licence = Licence;

// Registrando valores de forma global
app.config.globalProperties.$licenceActive = await Licence.isActive();

// Importando componentes
import EAuth from './components/e-auth/ErIndex.vue';
app.component('e-auth', EAuth);

// Montando a aplicação Vue no elemento com id 'app' no HTML
app.mount('#app');
