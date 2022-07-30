import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '../views/error/NotFound';
import PkIndexView from '../views/pk/PkIndexView';
import RecordIndexView from '../views/record/RecordIndexView';
import RanklistIndexView from '../views/ranklist/RanklistIndexView';
import UserBotIndexView from '../views/user/bot/UserBotIndexView';
import UserAccountLoginView from '../views/user/account/UserAccountLoginView';
import UserAccountRegisterView from '../views/user/account/UserAccountRegisterView';
import store from '../store/index'

const routes = [
  {
    path: '/',
    name: 'home',
    component: PkIndexView,
    meta: {//存一下本页面是否需要授权才能访问，这里meta和requestAuth的名字都是自己起的！
      requestAuth: true,
    }
  },
  {
    path: '/pk/',
    name: 'pk_index',
    component: PkIndexView,
    meta: {
      requestAuth: true,
    }
  },

  {
    path: '/ranklist/',
    name: 'ranklist_index',
    component:
      RanklistIndexView
    ,
    meta: {
      requestAuth: true,
    }
  },
  {
    path: '/record/',
    name: 'record_index',
    component:
      RecordIndexView,
    meta: {
      requestAuth: true,
    }
  },
  {
    path: '/user/bot/',
    name: 'user_bot_index',
    component: UserBotIndexView,
    meta: {
      requestAuth: true,
    }
  },

  {
    path: '/user/account/login/',
    name: 'user_account_login',
    component: UserAccountLoginView,
    meta: {
      requestAuth: false,
    }
  },
  {
    path: '/user/account/register/',
    name: 'user_account_register',
    component: UserAccountRegisterView,
    meta: {
      requestAuth: false,
    }
  },

  {
    path: '/404/',
    name: '404',
    component: NotFound,
    meta: {
      requestAuth: false,
    }
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


//to是要去哪个页面，from是从哪个页面来，next是看下一步有没有操作
router.beforeEach((to, from, next) => {
  if (to.meta.requestAuth && !store.state.user.is_login) {//如果当前页面需要授权，并且用户没有登录，重定向到登录页面
    next({ name: "user_account_login" });
  }
  else {
    next();
  }
}
)


export default router
