<template>
    <div id="calendar">
        <h2>Calendar</h2>
        <button @click="changeFormat">Change Format</button>
        <button @click="prevMonth">-</button>
        <button @click="nextMonth">+</button>
        <div class="row">
            <div class="col-md-1" v-for="weekDay in week">{{ weekDay }}</div>
        </div>
        <div class="row" v-for="week in days">
            <div class="col-md-1" v-for="day in week" @click="addEvent(day.dayDate)">{{ day.dayNum }}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "calendar",
        data(){
            return{
                date: new Date(),
                weekDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
                selectedMonth: undefined,
                selectedYear: undefined,
                lastDay: undefined,
                firstDay: 0,
                days: []
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
                        dayWeek: i
                    });
                }
            },
            addEvent(data){
             console.log(data)
            },
            changeFormat()
            {
                if(this.firstDay == 0){
                    this.firstDay = 1
                }else{
                    this.firstDay = 0
                }
                this.getDaysArray();
            }
        },
        mounted(){
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
            }
        }
    }
</script>

<style scoped>

</style>