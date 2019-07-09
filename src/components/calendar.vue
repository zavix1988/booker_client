<template>
    <div id="calendar">

        <table id="calendar2">
            <thead>
            <tr>
                {{ setDefaultVals }}
                <button @click="prevMonth">‹</button>
                <td colspan="5">{{ monthYear }}</td>
                <button @click="nextMonth">›</button>
            </tr>
            <tr>
                <td>Sun</td>
                <td>Mon</td>
                <td>Tue</td>
                <td>Wed</td>
                <td>Thu</td>
                <td>Fri</td>
                <td>Sat</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="week in days">
                <td v-for="day in week">{{ day.dayNum }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        name: "calendar",
        data(){
            return{
                date: new Date(),
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'October', 'December'],
                selectedMonth: undefined,
                selectedYear: undefined,
                lastDay: undefined,
                firstWeekDay: undefined,
                lastWeekDay: undefined,
                days: []
            }
        },
        methods:{
            currentMonth()
            {
                return this.selectedMonth = this.date.getMonth();
            },
            currentYear()
            {
                return this.selectedYear = this.date.getFullYear();
            },
            nextMonth()
            {
                this.getFirstWeekDay();
                this.getLastDay();
                this.getLastWeekDay();
                this.getMonthsDays();
                if (this.selectedMonth < 11) {
                    return this.selectedMonth++;
                }
                this.selectedYear++;
                return this.selectedMonth = 0;
            },
            prevMonth()
            {
                this.getFirstWeekDay();
                this.getLastDay();
                this.getLastWeekDay();
                this.getMonthsDays();
                if (this.selectedMonth > 0) {
                    return this.selectedMonth--;
                }
                this.selectedYear--;
                return this.selectedMonth = 11;
            },
            getLastDay() {
                this.lastDay = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate()
            },
            getFirstWeekDay() {
                this.firstWeekDay = new Date(this.selectedYear, this.selectedMonth, 1).getDay();
            },
            getLastWeekDay () {
                this.getLastDay();
                this.lastWeekDay = new Date(this.selectedYear, this.selectedMonth, this.lastDay).getDay()
            },
            getMonthsDays () {
                let week = 0;
                this.days[week] = [];
                for (let i = 1; i <= this.lastDay; i++) {
                    if (new Date(this.selectedYear, this.selectedMonth, i).getDay() != 0) {
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

            },
            formatFirstWeek() {
                for (let i = this.days[0].length; i < 7; i++) {
                    this.days[0].unshift({
                        dayNum: undefined,
                        dayWeek: i
                    });
                }
            }
        },
        computed: {
            setDefaultVals: function () {
                this.getFirstWeekDay();
                this.getLastWeekDay();
                this.getLastDay();
                this.getMonthsDays();
                this.formatFirstWeek();
            },
            monthYear: function () {
                this.days = [];
                if (void 0 === this.selectedMonth) {
                    this.selectedMonth = this.currentMonth();
                }
                if (void 0 === this.selectedYear) {
                    this.selectedYear = this.currentYear();
                }
                return this.months[this.selectedMonth] + " " + this.selectedYear;
            }
        }
    }
</script>

<style scoped>

</style>