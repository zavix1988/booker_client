<template>
    <div id="addUser" class="container">
        <h1>{{ $route.params.login }}</h1>
        <form @submit.prevent="update()">
            <div class="form-group">
                <label for="first_name">First name:</label>
                <input v-model="form.first_name" type="text" class="form-control" id="first_name"  placeholder="Enter first name">
            </div>
            <div class="form-group">
                <label for="last_name">Last name:</label>
                <input v-model="form.last_name" type="text" class="form-control" id="last_name"  placeholder="Enter last name">
            </div>
            <div class="form-group">
                <label for="email">Email address</label>
                <input v-model="form.email" type="email" class="form-control" id="email" placeholder="Enter email">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input v-model="form.password" type="password" class="form-control" id="password" placeholder="Enter password">
                <small class="form-text text-muted">if you don’t want to change the password - leave the field empty.</small>

            </div>
            <div class="form-group">
                <label for="retry">Retry password</label>
                <input v-model="form.retry" type="password" class="form-control" id="retry" placeholder="Retry password">
                <small class="form-text text-muted">if you don’t want to change the password - leave the field empty.</small>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
        <div v-if="result">{{ result }}</div>
    </div>
</template>

<script>
    import Store from '@/Store'
    export default {
        name: "edit-user",
        data(){
            return{
                form: {
                    password: '',
                    retry: '',
                    email: '',
                    first_name: '',
                    last_name: '',
                },
                store: Store,
                result: undefined
            }
        },
        methods: {
            update(){
               axios
                   .put('http://booker-client.loc/api/admin/updateUser', 'user='+this.store.user.login
                                                                          +'&token='+this.store.user.token
                                                                          +'&login='+this.$route.params.login
                                                                          +'&password='+this.form.password
                                                                          +'&retry='+this.form.retry
                                                                          +'&first_name='+this.form.first_name
                                                                          +'&last_name='+this.form.last_name
                                                                          +'&email='+this.form.email)
                   .then(response=>{

                        if(response.data.result == true){
                            this.result = 'Changes saved';
                        }

                   })

            },
            getUser(){
                axios
                    .get('http://booker-client.loc/api/admin/user/'+this.$route.params.login+'/'+this.store.user.login+'/'+this.store.user.token)
                    .then(response=>{
                        if(response.data){
                            this.form.email = response.data.email;
                            this.form.first_name = response.data.first_name;
                            this.form.last_name = response.data.last_name;
                        }
                    });
            }
        },
        created(){
            this.getUser();
        }
    }
</script>

<style scoped>

</style>