<template>
    <div id="admin" class="container">
        <table v-if="!error" class="table">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Email</th>
                <th scope="col" colspan="2">Action</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="users.length > 0" v-for="(user, key) in users ">
                <th scope="row">{{ key+1 }}</th>
                <td>{{ user.first_name }}</td>
                <td>{{ user.last_name }}</td>
                <td>{{ user.email }}</td>
                <td><button class="btn btn-secondary" @click="editUser(user.login)">Edit</button></td>
                <td><button class="btn btn-danger" @click="deleteUser(user.login)">Delete</button></td>
            </tr>
            <tr v-else>
                <td>Нет добавленых юзеров</td>
            </tr>
            <tr>
                <td colspan="6"><button class="btn btn-primary" @click="addUser()">Add User</button></td>
            </tr>
            </tbody>
        </table>
        <div class="error" v-if="error">Error - {{ this.error }}</div>
    </div>
</template>

<script>
    import Store from '@/Store'
    export default {
        name: "admin",
        data(){
            return{
                store: Store,
                users: [],
                error: undefined,
            }
        },
        methods: {
            addUser(){
                this.$router.push({name: "addUser"})
            },
            editUser(login){
                this.$router.push({name: 'editUser', params: {login: login}})

            },
            deleteUser(login){
                axios
                    .delete('http://bookerclient.loc/api/admin/user/'+login)
                    .then(response => {
                        if(response.data.rowsCount == 'null'){
                            this.error = 'Unknown user'
                        }else{
                            this.getUsers();
                        }
                    }).catch(error => console.log(error.response.status));
            },
            getUsers(){
                axios.get('http://bookerclient.loc/api/admin/allUsers/'+this.store.user.login+'/'+this.store.user.token)
                    .then(response => {
                            this.users = response.data
                    }).catch(error => {
                        if(error.response.status == 401){
                            this.error = 'You are not Admin'
                        }
                    })
            }
        },
        created(){
            this.getUsers();
        },
        mounted(){

        }
    }
</script>

<style scoped>

</style>