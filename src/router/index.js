import { createRouter, createWebHistory } from 'vue-router';
import Licence from '../models/Licence';
import { getSession } from '../session';
import User from '../models/User';


// Importe seus componentes e configure suas rotas
import EDashboard from '../components/e-dashboard/ErIndex.vue';
import EAuth from '../components/e-auth/ErIndex.vue';
import EUsers from '../components/e-users/ErIndex.vue';
import Eactive from '../components/e-active/ErIndex.vue';

const routes = [
    {
        path: '/active',
        name: 'e-active',
        component: Eactive,
    },
    {
        path: '/login',
        name: 'e-auth',
        component: EAuth
    },
    {
        path: '/',
        name: 'e-dashboard',
        component: EDashboard,
        meta: { requiresAuth: true } // Esta rota requer autenticação
    },
    {
        path: '/users',
        name: 'e-users',
        component: EUsers,
        meta: { requiresAuth: true } // Esta rota requer autenticação
    },

    // Outras rotas aqui
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach(async (to, from, next) => {
    const isAuthenticated = await checkAuthentication();
    const isActive = await Licence.isActive();

    if (!isActive && to.path !== '/active') {
        next('/active');
    } else if (isActive && to.path === '/active') {
        next('/');
    } else if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else if (isAuthenticated && to.path === '/login') {
        next('/');
    } else {
        next();
    }
});

async function checkAuthentication() {
    let sessionStorage = localStorage.getItem('sessionId');
    if (sessionStorage) {
        let session = await getSession(sessionStorage);
        if(session) {
            let user = await User.findByPk(session.userId);

            if(!user) {
                return false;
            }
    
            if(user.status != 1) {
                session.destroy()
                return false;
            }
    
            if (session.sessionId == sessionStorage) {
                return true;
            }
        }
       
    }

    return false;
}

export default router;
