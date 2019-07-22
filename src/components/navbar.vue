<template>
    <div class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
        <h5 class="my-0 mr-md-auto font-weight-normal">Broadboard Booker</h5>
        <nav class="my-2 my-md-0 mr-md-3">
            <router-link class="p-2 text-dark" to="/">Calendar</router-link>
            <router-link v-if="store.user.login == 'admin'" class="p-2 text-dark" to="/admin">Employee List</router-link>

        </nav>
        <router-link v-if="store.user.login == 'guest'" to="/login" class="btn btn-outline-primary" >Sign up</router-link>
        <a v-else class="btn btn-outline-primary" href="#" @click="logout">{{ store.user.login }}</a>
    </div>

</template>

<script>
    import Store from '@/Store'

    export default {
        name: "navbar",
        data(){
            return{
                store: Store,
            }
        },
        methods:{
            logout(){
                axios
                    .put('http://bookerclient.loc/api/user/logout', 'login='+this.store.user.login+'&token='+this.store.user.token)
                    .then(response => {
                        if(response.data.result == true){
                            localStorage.user = JSON.stringify({
                                login: 'guest',
                                token: undefined,
                                role: undefined,
                            });
                            this.store.user = {
                                login: 'guest',
                                token: undefined,
                                role: undefined,
                            }
                            this.$router.push({name: 'Login'})
                        }

                    });

            }
        }
    }
</script>

<style scoped>
</style>