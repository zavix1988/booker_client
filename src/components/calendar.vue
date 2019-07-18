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
                            <td v-for="day in week" :class="['col-md-1', [0,6].includes(day.dayWeek)?'week-end':'work-day']"> {{ day.dayNum }}</td>
                        </tr>
                    </tbody>
                </table>
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
                <setEvent :time-format="timeFormat" :now-date="date"/>
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
                timeFormat: 24,
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                days: [],
                rooms: [],
                store: Store,
                events: []
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
                            dayDate: new Date(this.selectedYear, this.selectedMonth, i),
                            dayWeek: new Date(this.selectedYear, this.selectedMonth, i).getDay()
                        })
                    } else {
                        week++;
                        if (!this.days[week]) {
                            this.days[week] = [];
                        }
                        this.days[week].push({
                            dayNum: i,
                            dayDate: new Date(this.selectedYear, this.selectedMonth, i),
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
            },
            addEvent(date){
                if((typeof date) != 'undefined'){
                    if(!(date.getDay() == 0 || date.getDay()==6))
                        console.log(date)
                        console.log(this.store.currentRoom)
                        console.log(this.store.user.login)
                }
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
                        .then(response => (this.events = response.data))

                }
            },
            changeTimeFormat() {
                if(this.timeFormat == 24)
                {
                    this.timeFormat = 12;
                } else {
                    this.timeFormat = 24;
                }
            },
            toCurrentMonth(){
                this.getCurrentMonth();
                this.getCurrentYear();
                this.getDaysArray();
            }
        },
        mounted(){
            this.getRooms();
            this.firstDay = localStorage.firstDay || 1;
            this.weekFormat = localStorage.weekFormat || 'Mon';
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
    width: 70px;
    height: 70px;
    margin: 2px
}
.week-end{
    background: #f15e5e;
    width: 70px;
    height: 70px;
    margin: 2px
}

</style>