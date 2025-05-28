import { createApp } from 'vue';
import App from './App.vue'; // Importa o componente principal
import router from './routes'; // Importa as rotas definidas
import '@fortawesome/fontawesome-free/css/all.min.css';


const app = createApp(App);

app.use(router); // Usa o roteador
app.mount('#app'); // Monta na div com id="app"
