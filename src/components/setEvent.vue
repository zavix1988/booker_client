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
                        <label for="user">Set event for:</label>
                        <select class="form-control" id="user" v-model="form.user">
                            <option v-for="user in users" :value="user.login" >{{user.login}}</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="datestart">Date of event:</label>
                        <input type="date" v-model="form.dateStart" class="form-control" id="datestart" required>
                    </div>

                    <div class="form-group">
                        <label>Event start:</label>
                        <div class="row">
                            <div class="col-4">
                                <select class="form-control" v-if="timeFormat == 24" v-model="form.hoursStart">
                                    <option selected disabled>Hours</option>
                                    <option :key="index" v-for="(hour, index) in 24" v-if="hour >= 8 && hour <= 20">{{hour}}</option>
                                </select>
                                <select class="form-control" v-else v-model="form.hoursStart">
                                    <option selected disabled>Hours</option>
                                    <option :key="index" v-for="(hour, index) in 12">{{hour}}</option>
                                </select>
                            </div>:
                            <div class="col-4">
                                <select class="form-control" v-model="form.minutesStart">
                                    <option selected disabled>Minutes</option>
                                    <option :key="index" v-for="(minute, index) in minutes">{{minute}}</option>
                                </select>
                            </div>
                            <div class="col-3 pl-0" v-if="timeFormat != 24">
                                <select class="form-control" v-model="form.ampmStart">
                                    <option selected disabled>AM/PM</option>
                                    <option value="am">A.M.</option>
                                    <option value="pm">P.M.</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Event end:</label>
                        <div class="row">
                            <div class="col-4">
                                <select class="form-control" id="h-end" v-model="form.hoursEnd" v-if="timeFormat == 24">
                                    <option selected disabled>Hours</option>
                                    <option :key="index" v-for="(hour, index) in 24" v-if="hour >= 8 && hour <= 20">{{hour}}</option>
                                </select>
                                <select class="form-control" v-model="form.hoursEnd" v-else>
                                    <option selected disabled>Hours</option>
                                    <option :key="index" v-for="(hour, index) in 12">{{hour}}</option>
                                </select>
                            </div>:
                            <div class="col-4">
                                <select class="form-control" v-model="form.minutesEnd">
                                    <option selected disabled>Minutes</option>
                                    <option :key="index" v-for="(minute, index) in minutes">{{minute}}</option>
                                </select>
                            </div>
                            <div class="col-3 pl-0" v-if="timeFormat != 24">
                                <select class="form-control" v-model="form.ampmEnd">
                                    <option selected disabled>AM/PM</option>
                                    <option value="am">A.M.</option>
                                    <option value="pm">P.M.</option>
                                </select>
                            </div>
                        </div>
                    </div>


                    <div class="form-group">
                        <label for="event-desc">Describe event</label>
                        <textarea class="form-control" v-model="form.description" id="event-desc" rows="3" required></textarea>
                    </div>

                    <div class="custom-control custom-switch pb-2">
                        <input type="checkbox" class="custom-control-input" v-model="recurrence" name="recurrence" @click="switchRecurring" id="recurrenceSwitcher">
                        <label class="custom-control-label" for="recurrenceSwitcher">Is this going to be recurring event?</label>
                    </div>
                    <div class="pt-1 pb-1" v-if="recurrence">
                        <p class="mb-2">Specify recurrence of event:</p>
                        <div class="form-check" >
                            <input class="form-check-input" type="radio" v-model="form.recurring" @click="resetDuration" name="recurr" id="weekly" value="weekly" checked>
                            <label class="form-check-label" for="weekly">
                                Weekly
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" v-model="form.recurring" @click="resetDuration" name="recurr" id="bi-weekly" value="bi-weekly">
                            <label class="form-check-label" for="bi-weekly">
                                Bi-weekly
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" v-model="form.recurring" @click="resetDuration" name="recurr" id="monthly" value="monthly">
                            <label class="form-check-label" for="monthly">
                                Monthly
                            </label>
                        </div>
                        <div class="form-group">
                            <label for="duration">Duration: {{form.duration}}</label>
                            <input type="range" class="custom-range" v-model="form.duration" v-if="form.recurring == 'weekly'" min="1" max="4" step="1" id="duration">
                            <input type="range" class="custom-range" v-model="form.duration" v-if="form.recurring == 'bi-weekly'" min="1" max="2" step="1" id="duration">
                            <input type="range" class="custom-range" v-model="form.duration" v-if="form.recurring == 'monthly'" min="1" max="1" disabled value="1" id="duration">
                        </div>
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
                dateStart: undefined,
                hoursStart: "Hours",
                minutesStart: "Minutes",
                ampmStart: "AM/PM",
                hoursEnd: "Hours",
                minutesEnd: "Minutes",
                ampmEnd: "AM/PM",
                description: "",
                recurring: "weekly",
                duration: 1

            },
            minutes: ['00', '15', '30', '45'],
            recurrence: false,

        }
    },
    methods: {
        resetDuration() {
            this.form.duration = 1;
        },
        resetModal() {
            this.form = {
                user: undefined,
                dateStart: undefined,
                hoursStart: "Hours",
                minutesStart: "Minutes",
                ampmStart: "AM/PM",
                hoursEnd: "Hours",
                minutesEnd: "Minutes",
                ampmEnd: "AM/PM",
                description: "",
                recurring: "weekly",
                duration: 1

            }
        },
        validateForm: function (e) {
            e.preventDefault();
            if (!this.form.dateStart) {
                this.error = "Please, choose the correct date!";
                return;
            }
            if (!this.validateDate(this.form.dateStart)) {
                return;
            }
            let hoursStart = this.standartizeHours(this.form.hoursStart, this.form.ampmStart);
            let hoursEnd = this.standartizeHours(this.form.hoursEnd, this.form.ampmEnd);
            if (hoursStart < 8 || hoursStart > 20 || hoursEnd < 8 || hoursEnd > 20) {
                this.error = "Events aviable only on 8 a.m. till 9 p.m.";
                return;
            }
            if (!hoursStart) {
                this.error = "Please, choose the correct start time";
                return;
            }
            if (!hoursEnd) {
                this.error = "Please, choose the correct ending time";
                return;
            }
            let correctDates = this.standartizeDate(this.form.dateStart, hoursStart, this.form.minutesStart, hoursEnd, this.form.minutesEnd);
            if (correctDates) {
                if (correctDates.dateStart > correctDates.dateEnd) {
                    this.error = "The event cannot end before it starts";
                    return;
                }
            } else {
                return;
            }

            if (this.recurrence) {
                if (this.form.recurring == 'weekly' && this.form.duration > 4 || this.form.duration < 1) {
                    this.error = "Weekly duration cannot be more than 4";
                    return;
                }
                if (this.form.recurring == 'bi-weekly' && this.form.duration > 2 || this.form.duration < 1) {
                    this.error = "Bi-weekly duration cannot be more than 2";
                    return;
                }
                if (this.form.recurring == 'monthly' && this.form.duration != 1) {
                    this.error = "Monthly duration cannot be more than 1";
                    return;
                }
            }
            let params = 'login=' + this.store.user.login +
                '&token=' + this.store.user.token +
                '&user=' + this.form.user +
                '&room=' + this.store.currentRoom +
                '&dateStart=' + correctDates.dateStart +
                '&dateEnd=' + correctDates.dateEnd +
                '&description=' + this.form.description

            if (this.recurrence) {
                params += '&recurring=' + this.form.recurring + '&duration=' + this.form.duration;
            }
            axios.post('http://bookerclient.loc/api/event/roomEvent', params)
                .then(response => (console.log(response.data)))

            this.$nextTick(() => {
                this.$refs.modal.hide()
            })

        },
        validateDate(date) {

            let dateArr = date.split('-');
            if (+dateArr[0] < this.nowDate.getFullYear() && +dateArr[1] < this.nowDate.getMonth() && +dateArr[2] < this.nowDate.getDate()) {
                this.error = "You might to select the current year or later";
                return;
            }
            return true;
        },
        switchRecurring() {
            this.recurrence = !this.recurrence
        },
        standartizeDate(date, hoursStart, minutesStart, hoursEnd, minutesEnd) {
            let result = {};
            let dateArr = date.split('-');
            if (hoursStart && minutesStart) {
                var dateStart = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], hoursStart, minutesStart);
            }

            if (hoursEnd && minutesEnd) {
                var dateEnd = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], hoursEnd, minutesEnd);
            }
            if (!this.checkHolidays(dateStart) || !this.checkHolidays(dateEnd)) {
                return;
            }
            if (dateStart.getTime() < this.nowDate.getTime()) {
                this.error = "You can not create event before current time!";
                return;
            }
            if (dateStart && dateEnd) {
                result.dateStart = dateStart.getTime() / 1000;
                result.dateEnd = dateEnd.getTime() / 1000;
                return result;
            }
            this.error = "Please, choose correct date";
            return;
        },
        standartizeHours(hours, ampm) {
            if (isNaN(hours)) {
                return;
            }
            if (this.timeFormat != 24 && ampm == 'pm') {
                return +hours + 12;
            }
            return hours;
        },
        getUsers() {

            if (this.store.user.role == 'admin') {
                axios
                    .get('http://bookerclient.loc/api/admin/allUsers/' + this.store.user.login + '/' + this.store.user.token)
                    .then(response => {
                        this.users = response.data
                    }).catch(error => {
                    if (error.response.status == 401) {
                        this.error = 'You are not Admin'
                    }
                })
            } else {
                this.users.push(this.store.user)
            }
        },
        checkHolidays: function (date) {
            if ([0, 6].includes(date.getDay())) {
                this.error = "Weekend";
                return;
            }
            return true;
        },
    },
    created(){
        this.getUsers();
    }

}
</script>

<style scoped>
</style>