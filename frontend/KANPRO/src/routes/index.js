import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Projetos from '../views/Projetos.vue';
import Tarefas from '../views/Tarefas.vue';
import Registro from '../views/Registro.vue';
import Perfil from '../views/Perfil.vue';
import VerificarEmail from '../views/VerificarEmail.vue';
import PropriedadesProjeto from '../views/PropriedadesProjeto.vue';
import Permissoes from '../views/Permissoes.vue';
import ArquivosProjeto from '../views/ArquivosProjeto.vue';
import RecursosProjeto from '../views/RecursosProjeto.vue';
import GanttProjeto from '../views/GanttProjeto.vue';

const routes = [
    {
        path: '/projetos',
        name: 'Projetos',
        component: Projetos
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/',
        name: 'Home',
        component: Login
    },
    {
        path: '/projeto/:id',
        name: 'ProjetoTarefas',
        component: Tarefas,
        props: true
    },
    {
        path: '/registro',
        name: 'Registro',
        component: Registro
    },
    {
        path: '/verificar-email',
        name: 'VerificarEmail',
        component: VerificarEmail,
    },
    {
        path: '/perfil',
        name: 'Perfil',
        component: Perfil,
    },
    {
        path: '/projeto/:id/propriedades',
        name: 'ProjetoPropriedades',
        component: PropriedadesProjeto,
    },
    {
        path: '/projeto/:id/arquivos',
        name: 'ProjetoArquivos',
        component: ArquivosProjeto,
    },
    {
        path: '/projeto/:id/recursos',
        name: 'ProjetoRecursos',
        component: RecursosProjeto,
    },
    {
        path: '/projeto/:id/gantt',
        name: 'ProjetoGantt',
        component: GanttProjeto,
    },
    {
        path: '/permissoes',
        name: 'Permissoes',
        component: Permissoes,
    }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
