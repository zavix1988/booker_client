<template>
  <div id="app">
    <navbar></navbar>
    <router-view></router-view>
  </div>
</template>

<script>
import navbar from './components/navbar'
import Store from '@/Store'
export default {
    name: 'app',
    data(){
        return{
            store: Store
        }
    },
    methods:{

    },
    created(){
        if (localStorage.user) {
            let user = JSON.parse(localStorage.user);
            if(user.login !== 'false'){
                this.store.user.login = user.login;
                this.store.user.token = user.token;
                this.store.user.role = user.role;
            }
        }
    },

}
</script>

<style>
#app {

}
</style>
