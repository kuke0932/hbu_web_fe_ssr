<template>
    <div>
      <div class="body">
        <div class="message" v-for="(exam, index) in examList" :key="index" >
          <p>{{exam.courseName}}</p>
          <p><span>地点：{{exam.classroomName}}</span>  <span>座位号：{{exam.seatNo}}</span></p>
          <p>时间：第{{exam.weeks}}周  星期{{exam.weekday}} {{exam.examTime}} </p>
        </div>
      </div>
    </div>
</template>

<script>
import { listExam } from '@/api/educational'

export default {
  name: 'exam',
  head () {
    return {
      title: '考试查询'
    }
  },
  data () {
    return {
      schoolYear: '',
      schoolTerm: '',
      examList: null,
      total: -1,
      pageNum: 1,
      pageSize: 10
    }
  },
  mounted () {
    listExam(this.schoolYear, this.schoolTerm).then(resp => {
      this.examList = resp.data.rows
      this.total = resp.data.total
    })
  },
  methods: {
    refresh () {
      console.log('refresh...')
    }
  }
}
</script>

<style scoped>
  .message {
    text-align: left;
    margin:5px 0 5px 0;
    padding: 5px 15px 5px 15px;
    background: white;
    border-radius: 5px;
    opacity: 0.8;
  }
  span {
    display:inline;
    margin-right:25px;}
</style>
