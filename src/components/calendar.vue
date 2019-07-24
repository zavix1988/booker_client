<template>
    <div id="calendar">
        <h2>Calendar</h2>
        <div class="row">
            <div class="col-md-10">
                <table id="cal" class="table table-bordered">
                    <thead class="center">
                        <tr>
                            <td><b-button @click="prevMonth" variant="primary" class="btn-switch"> << </b-button></td>
                            <td colspan="5">{{ months[selectedMonth] }} {{ selectedYear }}</td>
                            <td><b-button @click="nextMonth" variant="primary" class="btn-switch"> >> </b-button></td>
                        </tr>
                        <tr>
                            <td v-for="weekDay in week">{{ weekDay }}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="week in days">
                            <td v-for="day in week" :class="['col-md-1', [0,6].includes(day.dayWeek)?'week-end':'work-day']"> {{ day.dayNum }}
                                <b-list-group>
                                    <b-list-group-item :key="index" v-for="(event, index) in events" v-if="new Date(+event.startEvent).getDate() == day.dayNum" size="sm" variant="primary" class="mb-1 p-0 border-0 text-center event-badge" v-b-modal.my-modal @click="getEventById(index)"><small>
                                        {{event.startHour}}:{{event.startMinutes}} {{event.ampmStart}} - {{event.endHour}}:{{event.endMinutes}} {{event.ampmEnd}}</small>
                                    </b-list-group-item>
                                </b-list-group>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <b-modal id="my-modal" title="Event details" hide-footer v-if="selectedEvent != undefined" >
                    <table class="table">
                        <tbody>
                        <tr>
                            <th scope="row">When</th>
                            <td><small>Starts at</small> {{events[selectedEvent].startHour}}:{{events[selectedEvent].startMinutes}} {{events[selectedEvent].ampmStart}}</td>
                            <td><small>Ends at</small> {{events[selectedEvent].endHour}}:{{events[selectedEvent].endMinutes}} {{events[selectedEvent].ampmEnd}}</td>
                        </tr>
                        <tr>
                            <th scope="row">Notes</th>
                            <td colspan="2">{{events[selectedEvent].note}}</td>
                        </tr>
                        <tr>
                            <th scope="row">Who</th>
                            <td colspan="2">{{events[selectedEvent].first_name}} {{events[selectedEvent].last_name}}</td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="modal-footer">
                        <button v-b-modal.delete-modal @click="$bvModal.hide('my-modal')" type="button" class="btn btn-outline-danger">Delete</button>
                        <router-link :to="'/edit/' + events[selectedEvent].id" class="btn btn-primary">Update</router-link>
                    </div>
                </b-modal>

                <b-modal id="delete-modal" title="Delete event" hide-footer v-if="selectedEvent != undefined">
                    <p>Are you sure you want to delete this event?</p>
                    <div class="modal-footer">
                        <button type="button" @click="deleteEvent(false)" class="btn btn-primary float-right">Delete</button>
                        <button type="button" v-if="events[selectedEvent].parent" @click="deleteEvent(true)" class="btn btn-primary float-right">Delete with recurrences</button>
                    </div>
                </b-modal>

            </div>
            <div class="col-md-2">
                <div class="custom-control custom-switch">
                    <input type="checkbox" class="custom-control-input" id="weekFormat" @click="changeFormat" v-if="weekFormat == 'RU'">
                    <input type="checkbox" class="custom-control-input" id="weekFormat" @click="changeFormat" v-else checked>
                    <label class="custom-control-label" for="weekFormat">Week started: <b>({{weekFormat}})</b></label>
                </div>
                <div class="custom-control custom-switch">
                    <input type="checkbox" class="custom-control-input" id="timeFormat" @click="changeTimeFormat" v-if="timeFormat == 24">
                    <input type="checkbox" class="custom-control-input" id="timeFormat" @click="changeTimeFormat" v-else checked>
                    <label class="custom-control-label" for="timeFormat">Time format: <b>({{ timeFormat }})</b></label>
                </div>
                <div class="form-group">
                    <label for="rooms">Select room</label>
                    <select class="form-control" id="rooms" v-model="store.currentRoom" @change="getEvents">
                        <option v-for="room in rooms" :value="room.id" >{{room.name}}</option>
                    </select>
                </div>
                <b-form-group>
                    <b-button @click="toCurrentMonth" variant="outline-secondary">Current Month</b-button>
                </b-form-group>
                <setEvent v-if="store.currentRoom" :time-format="timeFormat" :now-date="date"/>
            </div>
        </div>
    </div>
</template>

<script>
    import Store from '@/Store'
    import setEvent from './setEvent'

    export default {
        name: "calendar",
        data(){
            return{
                date: new Date(),
                selectedMonth: undefined,
                selectedYear: undefined,
                lastDay: undefined,
                firstDay: undefined,
                weekFormat: undefined,
                timeFormat: undefined,
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                days: [],
                rooms: [],
                store: Store,
                events: [],
                selectedEvent: undefined
            }
        },
        methods:{
            getCurrentMonth()
            {
                this.selectedMonth = this.date.getMonth();
            },
            getCurrentYear()
            {
                this.selectedYear = this.date.getFullYear();
            },
            nextMonth()
            {
                if (this.selectedMonth < 11) {
                    this.selectedMonth++;
                }else{
                    this.selectedYear++;
                    this.selectedMonth = 0;
                }
                this.getLastDay()
                this.getDaysArray()
                this.getEvents()
            },
            prevMonth()
            {
                if (this.selectedMonth > 0) {
                    this.selectedMonth--;
                }else{
                    this.selectedYear--;
                    this.selectedMonth = 11;
                }
                this.getLastDay()
                this.getDaysArray()
                this.getEvents()
            },
            getLastDay()
            {
                this.lastDay = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate()
            },
            getDaysArray()
            {
                this.days = [];
                let week = 0;
                this.days[week] = [];
                for (let i = 1; i <= this.lastDay; i++) {
                    if (new Date(this.selectedYear, this.selectedMonth, i).getDay() != this.firstDay) {
                        this.days[week].push({
                            dayNum: i,
                            dayWeek: new Date(this.selectedYear, this.selectedMonth, i).getDay()
                        })
                    } else {
                        week++;
                        if (!this.days[week]) {
                            this.days[week] = [];
                        }
                        this.days[week].push({
                            dayNum: i,
                            dayWeek: new Date(this.selectedYear, this.selectedMonth, i).getDay()
                        })
                    }
                }
                this.formatFirstWeek()
            },
            formatFirstWeek() {
                if(this.days[0].length > 0){
                    for (let i = this.days[0].length; i < 7; i++) {
                        this.days[0].unshift({
                            dayNum: undefined,
                            dayWeek: undefined
                        });
                    }
                }
                this.getEvents()
            },
            changeFormat()
            {
                if(this.firstDay == 0){
                    this.firstDay = 1
                    this.weekFormat = 'Mon'
                }else{
                    this.firstDay = 0
                    this.weekFormat = 'Sun'
                }
                localStorage.setItem('firstDay', this.firstDay);
                localStorage.setItem('weekFormat', this.weekFormat);
                this.getDaysArray();
            },
            getRooms(){
                axios.get('http://bookerclient.loc/api/room/allRooms')
                    .then(response => {
                        this.rooms = response.data
                    })
            },
            getEvents(){
                if(this.store.currentRoom){
                    axios
                        .get('http://bookerclient.loc/api/event/roomevents/'+this.store.currentRoom+'/'+this.selectedMonth+'/'+this.selectedYear)
                        .then(response => {
                            if(response.data.length > 0){
                                response.data.forEach(event=>{
                                    event.createdEvent += "000";
                                    event.startEvent += "000";
                                    event.endEvent += "000";
                                    if (this.timeFormat == 24) {
                                        event.startHour = new Date(+event.startEvent).getHours();
                                        event.startMinutes = new Date(+event.startEvent).getMinutes();
                                        if (event.startMinutes == 0) {
                                            event.startMinutes = "00";
                                        }
                                        event.endHour = new Date(+event.endEvent).getHours();
                                        event.endMinutes = new Date(+event.endEvent).getMinutes();
                                        if (event.endMinutes == 0) {
                                            event.endMinutes = "00";
                                        }
                                    } else {
                                        event.startHour = new Date(+event.startEvent).getHours();
                                        event.startMinutes = new Date(+event.startEvent).getMinutes();
                                        event.ampmStart = event.startHour >= 12 ? 'pm' : 'am';
                                        event.startHour = event.startHour % 12;
                                        event.startHour = event.startHour ? event.startHour : 12;
                                        event.startMinutes = new Date(+event.startEvent).getMinutes();
                                        if (event.startMinutes == 0) {
                                            event.startMinutes = "00";
                                        }
                                        event.endHour = new Date(+event.endEvent).getHours();
                                        event.endMinutes = new Date(+event.endEvent).getMinutes();
                                        event.ampmEnd = event.endHour >= 12 ? 'pm' : 'am';
                                        event.endHour = event.endHour % 12;
                                        event.endHour = event.endHour ? event.endHour : 12;
                                        event.endMinutes = new Date(+event.endEvent).getMinutes();
                                        if (event.endMinutes == 0) {
                                            event.endMinutes = "00";
                                        }
                                    }

                                });
                                this.events = response.data;
                                console.log(this.events)
                            }else{
                                this.events = []
                            }
                        })
                }
            },
            deleteEvent(recDel) {
                if(!recDel){
                    console.log(1);
                    axios
                        .delete('http://bookerclient.loc/api/event/roomEvent/'+this.events[this.selectedEvent].id+'/'+this.store.user.login+'/'+this.store.user.token)
                        .then(response=>{
                            if(response.data.result == 'success'){
                                this.getEvents();
                            }
                        })
                }else{
                    console.log(2);
                    axios
                        .delete('http://bookerclient.loc/api/event/roomEvent/'+this.events[this.selectedEvent].id+'/'+this.store.user.login+'/'+this.store.user.token+'/all')
                        .then(response=>{
                            if(response.data.result == 'success'){
                                this.getEvents();
                            }
                        })
                }
                this.$bvModal.hide('delete-modal');
            },
            changeTimeFormat() {
                this.timeFormat = (this.timeFormat == 24) ? 12 : 24;
                localStorage.timeFormat = this.timeFormat;
                this.getEvents();
            },
            toCurrentMonth(){
                this.getCurrentMonth();
                this.getCurrentYear();
                this.getDaysArray();
            },
            getEventById(id){
                this.selectedEvent = id;
            }
        },
        mounted(){
            this.getRooms();
            this.firstDay = localStorage.firstDay || 1;
            this.weekFormat = localStorage.weekFormat || 'Mon';
            this.timeFormat = localStorage.timeFormat || 24;
            this.getCurrentMonth();
            this.getCurrentYear();
            this.getLastDay()
            this.getDaysArray()
        },
        computed:{
            week(){
                if(this.firstDay == 0){
                    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                }else{
                    return  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                }
            },

        }
    }
</script>

<style scoped>
.center{
    text-align: center
}
.work-day{
    background: #d8d8d8;
    width: 80px;
    height: 80px;
    margin: 2px
}
.week-end{
    background: #f15e5e;
    width: 70px;
    height: 70px;
    margin: 2px
}

</style>