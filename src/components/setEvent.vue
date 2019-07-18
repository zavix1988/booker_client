<template>
    <div id="setEvent" class="container">
        <div>
            <b-button v-b-modal.modal-prevent-closing variant="outline-primary">Book it!</b-button>


            <b-modal id="modal-prevent-closing" ref="modal" title="Booking" @show="resetModal" @hidden="resetModal" @ok="validateForm" >

                <b-alert show class="text-center" v-model="error" variant="danger" v-if="error">
                    <h4>{{error}}</h4>
                </b-alert>
                <form ref="form" @submit="validateForm">
                    <div class="form-group">
                        <label for="userFor">Booked for:</label>
                        <select class="form-control" id="userFor" v-model="form.user">
                            <option :key="key" v-for="(user, key) in users" :value="user.login">{{user.login}}</option>
                        </select>
                    </div>
                </form>
            </b-modal>
        </div>
    </div>
</template>

<script>
    import Store from '@/Store'
    export default {
    props: ['timeFormat', 'nowDate'],
    data() {
        return {
            store: Store,
            error: false,
            users: [],
            form: {
                user: undefined,
            }
        }
    },
    methods: {
        resetModal()
        {

        },
        validateForm()
        {

        },
        getUsers()
        {

            if (this.store.user.role == 'admin'){
                axios.get('http://bookerclient.loc/api/admin/allUsers/'+this.store.user.login+'/'+this.store.user.token)
                    .then(response => {
                        this.users = response.data
                    }).catch(error => {
                    if(error.response.status == 401){
                        this.error = 'You are not Admin'
                    }
                })
            } else {
                console.log(this.store.user.login)
                this.users.push(this.store.user)
            }
        },
    },
    created(){
        this.getUsers();
    }

}
</script>

<style scoped>
</style>