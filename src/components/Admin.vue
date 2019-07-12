<template>
    <div id="admin" class="container">
        <button class="btn btn-primary" @click="addUser">Add User</button>
        <span v-if="users !== undefined">{{ users }}</span>
    </div>
</template>

<script>
    import Store from '@/Store'
    export default {
        name: "admin",
        data(){
            return{
                store: Store,
                users: undefined
            }
        },
        methods: {
            addUser(){
                this.$router.push({name: "addUser"})
            }
        },
        created(){

        },
        mounted(){
            axios.get('http://tc.geeksforless.net/~user12/booker/api/admin/allUsers/'+this.store.user.login+'/'+this.store.user.token)
                .then(response => {
                    if(response.data.length > 0){
                        this.users = response.data
                    }
                }).catch(error => console.log(error))
        }
    }
</script>

<style scoped>

</style>