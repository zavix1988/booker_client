import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '@/components/Login'
import Admin from '@/components/Admin'
import addUser from '@/components/addUser'
import editUser from '@/components/editUser'
import bookIt from '@/components/bookIt'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    },
    {
      path: '/admin/add-user',
      name: 'addUser',
      component: addUser
    },
    {
      path: '/admin/edit/:login',
      name: 'editUser',
      component: editUser
    },
    {
      path: '/bookit',
      name: 'bookIt',
      component: bookIt
    }
  ]
})
