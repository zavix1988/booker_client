<template>
    <div id="addUser" class="container">
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
                <label for="login">Login:</label>
                <input v-model="form.login" type="text" class="form-control" id="login"  placeholder="Enter Login">
            </div>
            <div class="form-group">
                <label for="email">Email address</label>
                <input v-model="form.email" type="email" class="form-control" id="email" placeholder="Enter email">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input v-model="form.password" type="password" class="form-control" id="password" placeholder="Enter password">
            </div>
            <div class="form-group">
                <label for="retry">Retry password</label>
                <input v-model="form.retry" type="password" class="form-control" id="retry" placeholder="Retry password">
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</template>

<script>
    export default {
        name: "edit-user",
        data(){
            return{
                form: {
                    login: '',
                    password: '',
                    retry: '',
                    email: '',
                    first_name: '',
                    last_name: '',
                }
            }
        },
        methods: {
          update(){
              if((this.form.password !== '') && this.form.password === this.form.retry){
                  axios
                      .put('http://booker-client.loc/api/admin/update', 'login='+this.form.login
                                                                          +'&password='+this.form.password
                                                                          +'&retry='+this.form.retry
                                                                          +'&first_name='+this.form.first_name
                                                                          +'&last_name='+this.form.last_name
                                                                          +'&email='+this.form.email)
              }else{
                  axios
                      .put('http://booker-client.loc/api/admin/updateuser', 'login='+this.form.login
                                                                          +'&first_name='+this.form.first_name
                                                                          +'&last_name='+this.form.last_name
                                                                          +'&email='+this.form.email)
              }
          }
        },
        created(){
            axios
                .get('http://booker-client.loc/api/admin/user/'+this.$route.params.login)
                .then(response=>{
                    if(response.data){
                        this.form.login = response.data.login;
                        this.form.email = response.data.email;
                        this.form.first_name = response.data.first_name;
                        this.form.last_name = response.data.last_name;
                    }
                });
        }
    }
</script>

<style scoped>

</style>