import { createApp } from 'vue'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/sass/global.scss'

const app = createApp(App);


import EAuth from './components/e-auth/ErIndex.vue';

app.component('e-auth', EAuth);

app.mount('#app');
