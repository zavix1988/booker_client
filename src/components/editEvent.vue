<template>
    <div class="row">
        <div class="col-12">

        </div>
        <div class="col-4"></div>
        <div class="col-4">
            <form ref="form" class="text-left" @submit.prevent="validateForm" v-if="showEvent">
                <div class="form-group">
                    <h1>Booked for {{this.eventData.login}}</h1>
                </div>

                <div class="form-group">
                    <label for="timeStart">Beginning on (<small>Old time: {{form.oldTime}}</small>):</label>
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
                            <select class="form-control" v-model="form.midnightStart">
                                <option selected disabled>AM/PM</option>
                                <option value="am">A.M.</option>
                                <option value="pm">P.M.</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="timeStart">Ending on:</label>
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
                            <select class="form-control" v-model="form.midnightEnd">
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
                <button type="submit" class="btn btn-primary right">Submit</button>
            </form>
        </div>
        <div class="col-4"></div>
    </div>
</template>

<script>
    import Store from '@/Store'
    export default {
        name: "editEvent",
        data(){
            return{
                store: Store,
                eventData: {},
                showEvent: false,
                status: false,
                form: {
                    user: "",
                    dateStart: "",
                    hoursStart: "Hours",
                    minutesStart: "Minutes",
                    midnightStart: "AM/PM",
                    hoursEnd: "Hours",
                    minutesEnd: "Minutes",
                    midnightEnd: "AM/PM",
                    description: "",
                    oldTime: ""
                },
                timeFormat: localStorage.timeFormat,
                minutes: ['00', '15', '30', '45'],

            }
        },
        methods:{
            getDate: function(startEvent) {
                let start = startEvent + "000";
                let date = new Date(+start);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                return year + '-' + month + '-' + day;
            },
            getTime: function(startEvent, endEvent) {
                let start = startEvent + "000";
                let dateStart = new Date(+start);
                if(dateStart.getMinutes() == 0) {
                    var timeStart = dateStart.getHours() + ':00';
                } else {
                    var timeStart = dateStart.getHours() + ':' + dateStart.getMinutes();
                }
                let end = endEvent + "000";
                let dateEnd = new Date(+end);
                if(dateEnd.getMinutes() == 0) {
                    var timeEnd = dateEnd.getHours() + ':00';
                } else {
                    var timeEnd = dateEnd.getHours() + ':' + dateEnd.getMinutes();
                }
                return timeStart + " - " + timeEnd;
            },
            getEvent() {
                axios
                    .get('http://bookerclient.loc/api/event/roomevent/'+this.$route.params.id)
                    .then(response=>{
                        console.log(response.data)
                        if(response.data.login == this.store.user.login || this.store.user.role == 'admin'){
                            this.eventData = response.data;
                            this.showEvent = true;
                            this.form.dateStart = this.getDate(this.eventData.startEvent);
                            this.form.description = this.eventData.description;
                            this.form.oldTime = this.getTime(this.eventData.startEvent, this.eventData.endEvent)
                        }else{
                            this.status = "error";
                        }
                    });
            },
            getTime: function(startEvent, endEvent) {
                let start = startEvent + "000";
                let dateStart = new Date(+start);
                if(dateStart.getMinutes() == 0) {
                    var timeStart = dateStart.getHours() + ':00';
                } else {
                    var timeStart = dateStart.getHours() + ':' + dateStart.getMinutes();
                }
                let end = endEvent + "000";
                let dateEnd = new Date(+end);
                if(dateEnd.getMinutes() == 0) {
                    var timeEnd = dateEnd.getHours() + ':00';
                } else {
                    var timeEnd = dateEnd.getHours() + ':' + dateEnd.getMinutes();
                }
                return timeStart + " - " + timeEnd;
            },
            standartizeHours: function(hours, midnight) {
                if (isNaN(hours)) {
                    return;
                }
                if (this.hoursFormat != 24 && midnight == 'pm') {
                    return +hours + 12;
                }
                return hours;
            },
            standartizeDate: function(date, hoursStart, minutesStart, hoursEnd, minutesEnd) {
                let result = {};
                let dateArr = date.split('-');
                let currentDate = new Date;
                if(hoursStart && minutesStart) {
                    var dateStart = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], hoursStart, minutesStart);
                }

                if(hoursEnd && minutesEnd) {
                    var dateEnd = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], hoursEnd, minutesEnd);
                }
                if (dateStart.getTime() < currentDate.getTime()) {
                    this.status = "Sorry, but event is already finished!";
                    return;
                }
                if(dateStart && dateEnd) {
                    result.dateStart = dateStart.getTime() / 1000;
                    result.dateEnd = dateEnd.getTime() / 1000;
                    return result;
                }
                this.status = "Please, choose correct date";
                return;
            },
            validateForm(){
                let hoursStart = this.standartizeHours(this.form.hoursStart, this.form.midnightStart);
                let hoursEnd = this.standartizeHours(this.form.hoursEnd, this.form.midnightEnd);
                if (hoursStart < 8 || hoursStart > 20 || hoursEnd < 8 || hoursEnd > 20) {
                    this.status = "Events aviable only on 8 a.m. till 9 p.m.";
                    return;
                }
                if(!hoursStart || isNaN(this.form.minutesStart)) {
                    this.status = "Please, choose the correct start time";
                    return;
                }
                if(!hoursEnd || isNaN(this.form.minutesStart)) {
                    this.status = "Please, choose the correct ending time";
                    return;
                }
                let correctDates = this.standartizeDate(this.form.dateStart, hoursStart, this.form.minutesStart, hoursEnd, this.form.minutesEnd);
                if(correctDates) {
                    if(correctDates.dateStart > correctDates.dateEnd) {
                        this.status = "The event cannot end before it starts";
                        return;
                    }
                } else {
                    return;
                }
                if (this.form.description.length <= 0) {
                    this.status = "Desctiption is required field";
                    return;
                }
                var dataForm =
                    'login='+this.store.user.login+
                    '&token='+this.store.user.token+
                    '&eventId='+this.eventData.id+
                    '&roomId='+this.eventData.room_id+
                    '&userId='+this.eventData.user_id+
                    '&description='+this.form.description+
                    '&dateStart='+correctDates.dateStart+
                    '&dateEnd='+correctDates.dateEnd

                axios
                    .put('http://bookerclient.loc/api/event/RoomEvent', dataForm)
                    .then(response=>{
                        if(response.data.result == 'success'){
                            this.$router.push({name: 'Hello'})
                        }
                    })
            }
        },
        created(){
            this.getEvent();
        }
    }
</script>

<style scoped>

</style>