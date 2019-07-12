<template>
    <div id="admin">
        {{ users }}
    </div>
</template>

<script>
    import Store from '@/Store'
    export default {
        name: "admin",
        data(){
            return{
                store: Store,
                users: {}
            }
        },
        created(){

        },
        mounted(){
            axios.get('http://booker.loc/api/admin/allUsers/'+this.store.user.login+'/'+this.store.user.token)
                .then(response => {
                    if(response.data.length > 0){
                        this.users = response.data
                    }
                })
        }

    }
</script>

<style scoped>

</style>