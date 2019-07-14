<template>
    <div class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
        <h5 class="my-0 mr-md-auto font-weight-normal">Broadboard Booker</h5>
        <nav class="my-2 my-md-0 mr-md-3">
            <a class="p-2 text-dark" href="#">Features</a>
            <a class="p-2 text-dark" href="#">Enterprise</a>
            <a class="p-2 text-dark" href="#">Support</a>
            <a class="p-2 text-dark" href="#">Pricing</a>
        </nav>
        <router-link v-if="store.user.login == 'guest'" to="/login" class="btn btn-outline-primary" >Sign up</router-link>
        <a class="btn btn-outline-primary" href="#" @click="logout">{{ store.user.login }}</a>
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

            }
        }
    }
</script>

<style scoped>
</style>