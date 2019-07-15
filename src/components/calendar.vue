<template>
    <div id="calendar">
        <h2>Calendar</h2>
        <div class="row">
            <div class="col-md-6"><button @click="changeFormat">Change Format</button></div>
            <div class="col-md-6">
                <div class="form-group">
                    <label for="rooms">Select room</label>
                    <select class="form-control" id="rooms">
                        <option v-for="room in rooms">{{room.name}}</option>
                    </select>
                </div>
            </div>
        </div>

        
        <div class="row">
            <div class="col-md-2"><button @click="prevMonth">-</button></div>
            <div class="col-md-8 center">{{ months[selectedMonth] }} {{ selectedYear }}</div>
            <div class="col-md-2"><button @click="nextMonth">+</button></div>
        
        </div>
        <div class="row">
            <div class="col-md-2"></div>
            <div class="col-md-1" v-for="weekDay in week">{{ weekDay }}</div>
        </div>
        <div class="row" v-for="week in days">
            <div class="col-md-2"></div>
            <div  v-for="day in week" @click="addEvent(day.dayDate)" :class="['col-md-1', [0,6].includes(day.dayWeek)?'week-end':'']">{{ day.dayNum }}</div>
        </div>
    </div>
</template>

<script>
    import Store from '@/Store'
    export default {
        name: "calendar",
        data(){
            return{
                date: new Date(),
                selectedMonth: undefined,
                selectedYear: undefined,
                lastDay: undefined,
                firstDay: 1,
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                days: [],
                rooms: [],
                store: Store

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
                for (let i = this.days[0].length; i < 7; i++) {
                    this.days[0].unshift({
                        dayNum: undefined,
                        dayWeek: undefined
                    });
                }
            },
            addEvent(date){
                if((typeof date) != 'undefined'){
                    if(!(date.getDay() == 0 || date.getDay()==6))
                        console.log(date)
                }
            },
            changeFormat()
            {
                if(this.firstDay == 0){
                    this.firstDay = 1
                }else{
                    this.firstDay = 0
                }
                localStorage.setItem('firstDay', this.firstDay);
                this.getDaysArray();
            },
            getRooms(){
                axios.get('http://bookerclient.loc/api/room/allRooms')
                    .then(response => {
                        this.rooms = response.data
                    })
            }
        },
        mounted(){
            this.getRooms();
            this.firstDay = localStorage.firstDay || 1;
            this.getCurrentMonth();
            this.getCurrentYear();
            this.getLastDay()
            this.getDaysArray()
        },
        computed:{
            week(){
                if(this.firstDay == 0){
                    return ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
                }else{
                    return  ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
                }
            },
        }
    }
</script>

<style scoped>
.center{
    text-align: center
}
.week-end{
    background: red
}

</style>