import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '../views/error/NotFound';
import PkIndexView from '../views/pk/PkIndexView';
import RecordIndexView from '../views/record/RecordIndexView';
import RanklistIndexView from '../views/ranklist/RanklistIndexView';
import UserBotIndexView from '../views/user/bot/UserBotIndexView';


const routes = [
  {
    path: '/',
    name: 'home',
    component: PkIndexView,
  },
  {
    path: '/pk/',
    name: 'pk_index',
    component: PkIndexView,
  },

  {
    path: '/ranklist/',
    name: 'ranklist_index',
    component:
      RanklistIndexView
  },
  {
    path: '/record/',
    name: 'record_index',
    component:
      RecordIndexView,

  },
  {
    path: '/user/bot/',
    name: 'user_bot_index',
    component: UserBotIndexView,
  },

  {
    path: '/404/',
    name: '404',
    component: NotFound,
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
