<template>
  <div class="container" id="login">
    <form  @submit.prevent="login">
        <div class="form-group">
            <label for="login">Логин:</label>
            <input v-model="form.login" type="name" class="form-control" id="login" placeholder="Логин" required>
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input v-model="form.password"  type="password" class="form-control" id="password" placeholder="Пароль" required>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
    name: 'login',
    data () {
        return {
            form: {
                login: '',
                password: ''
            },

        }
    },
    methods: {
      login(){
        axios
        .put('http://tc.geeksforless.net/~user12/booker/api/user/login', 'login='+this.form.login
                                                                                +'&password='+this.form.password)
        .then(response => {
            if(response.data.token == false){
            }else {
                console.log(response.data)
                localStorage.setItem('user', JSON.stringify(response.data));
                if(response.data.role == 'admin'){
                    this.$router.push({name: 'Admin'})

                }else{
                    this.$router.push({name: 'Hello'})

                }
            }
        })
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
