<template>
  <div class="container" id="login">
    <b-form  @submit.prevent="login">
        <b-form-group id="input-group-login" label="Логин:" label-for="login">
            <b-form-input id="login" v-model="form.login" type="name" required placeholder="Логин" ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-password" label="Пароль:" label-for="password">
            <b-form-input id="password" v-model="form.password" type="password" required placeholder="Пароль" ></b-form-input>
        </b-form-group>
        
        <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
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
      }
    }
  },
  methods: {
      login(){
        axios
        .put('http://tc.geeksforless.net/~user12/bookerclient/api/user/login', 'login='+this.form.login
                                                                                +'&password='+this.form.password)
        .then(response => (console.log(response.data)))
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
