<template>
  <div>
    <mt-tab-container  v-model="selected" style="margin-bottom: 50px;">
      <mt-tab-container-item id="tab1">
        <!--<mt-header fixed title="首页"></mt-header>-->
        <div v-if="!mounted"><img src="/img/banner.jpg" alt="" style="width: 100%;"></div>
        <div v-else style="height:150px;">
          <mt-swipe :auto="4000" >
            <mt-swipe-item>
              <img src="/img/banner.jpg" alt="" style="width: 100%;">
            </mt-swipe-item>
            <mt-swipe-item>
              <img src="/img/banner01.jpg" alt="" style="width: 100%;">
            </mt-swipe-item>
          </mt-swipe>
        </div>
        <div>
          <van-row class="bigBox" type="flex" justify="center" gutter="70">
            <van-col class="appBox" span="6" align="center" @click.native="goGetPassword">
              <div class="img_box" style="background-color: #E57B85" >
                <img slot="icon" src="../../assets/icon/resetPwd.svg">
              </div>
              <span>密码找回</span>
            </van-col>
            <van-col v-if="yhlx == 3 || yhlx == 6 || yhlx == 8" class="appBox" span="6" align="center" @click.native="searchTimeTable">
              <div class="img_box" style="background-color: #3498db">
                <img slot="icon" src="../../assets/icon/search.svg">
              </div>
              <span>课表查询</span>
            </van-col>
            <!--<van-col v-if="yhlx != 3" class="appBox" span="6" align="center" @click.native="searchExam">-->
              <!--<div class="img_box" style="background-color: #f3bc33" >-->
                <!--<img slot="icon" src="../../assets/icon/exam.svg">-->
              <!--</div>-->
              <!--<span>考试查询</span>-->
            <!--</van-col>-->
            <van-col class="appBox" span="6" align="center" @click.native="searchScore">
              <div class="img_box" style="background-color: #db7164" >
                <img slot="icon" src="../../assets/icon/score.svg">
              </div>
              <span>成绩查询</span>
            </van-col>
            <van-col class="appBox" span="6" align="center" @click.native="searchClassroom">
              <div class="img_box" style="background-color: #89c47d" >
                <img slot="icon" src="../../assets/icon/classroom.svg">
              </div>
              <span>空闲教室</span>
            </van-col>
            <van-col class="appBox" span="6" align="center" @click.native="searchBook">
              <div class="img_box" style="background-color: #25C9A9" >
                <img slot="icon" src="../../assets/icon/books.svg" style="width: 2.3rem;height: 2.3rem;">
              </div>
              <span>馆藏查询</span>
            </van-col>
            <van-col class="appBox" span="6" align="center" @click.native="borrowReturn">
              <div class="img_box" style="background-color: #f0a45d" >
                <img slot="icon" src="../../assets/icon/borrow.svg">
              </div>
              <span>借阅记录</span>
            </van-col>
            <van-col class="appBoxEmp" span="6"></van-col>
            <van-col class="appBoxEmp" span="6"></van-col>
          </van-row>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="tab2">
        <!--<mt-header fixed title="动态"></mt-header>-->
        <!--<div style="height:50px;">-->
        <!--<mt-search v-model="selectedWeek" cancel-text="取消" placeholder="搜索"></mt-search>-->
        <!--</div>-->
        <div>
          <mt-cell title="这是一个界面"></mt-cell>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="tab3">
        <!--<mt-header fixed title="个人中心"></mt-header>-->
        <div style="text-align:left;">
          <mt-cell title="个人信息" is-link @click.native="goToPersonal"></mt-cell>
          <!--<mt-cell title="重置密码" :to="{path: '/auth/forgetPassword', query: {account: this.userInfo.account}}" is-link></mt-cell>-->
          <!--<mt-cell title="密码申诉" :to="{name: 'faceResetPassword2', params: {account: this.userInfo.account, userName: ''}}" is-link></mt-cell>-->
          <mt-cell title="设置" is-link></mt-cell>
          <!--<mt-cell title="退出帐号" @click.native="logout" is-link></mt-cell>-->
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
    <!--底部tabbar-->
    <mt-tabbar v-model="selected" class="tabbar">
      <mt-tab-item id="tab1" class="tabbarItem">
        <img v-if="selected === 'tab1'" slot="icon" src="../../assets/icon/home.png">
        <img v-else slot="icon" src="../../assets/icon/home01.png">
        首页
      </mt-tab-item>
      <!--<mt-tab-item id="tab2" class="tabbarItem">-->
        <!--<img v-if="selected === 'tab2'" slot="icon" src="../../assets/icon/state.png">-->
        <!--<img v-else slot="icon" src="../../assets/icon/state01.png">-->
        <!--动态-->
      <!--</mt-tab-item>-->
      <mt-tab-item id="tab3" class="tabbarItem">
        <img v-if="selected === 'tab3'" slot="icon" src="../../assets/icon/mine.png">
        <img v-else slot="icon" src="../../assets/icon/mine01.png">
        我的
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/auth'
export default {
  name: 'index',
  head () {
    return {
      title: '河北大学校园微信'
    }
  },
  data () {
    return {
      tab1: '',
      tab2: '',
      tab3: '',
      selectedWeek: '',
      selected: 'tab1',
      userInfo: '',
      yhlx: '',
      mounted: false
    }
  },
  created () {
  },
  mounted () {
    this.mounted = true
    this.yhlx = this.$route.query.yhlx || '3'
    window.sessionStorage.setItem('yhlx', this.yhlx)
    window.sessionStorage.setItem('x-auth-token', this.$route.query.token)
    getUserInfo().then(resp => {
      this.userInfo = resp.data
      this.yhlx = this.userInfo.yhlx
    })
  },
  methods: {
    goGetPassword () {
      window.location.href = '/business/resetPassword'
    },
    goToPersonal () {
      this.$router.push({ path: '/portal/personal', query: this.userInfo })
    },
    searchTimeTable () {
      this.$router.push({ path: '/portal/timetable' })
    },
    searchExam () {
      this.$router.push({ path: '/portal/exam' })
    },
    searchScore () {
      this.$router.push({ path: '/portal/score' })
    },
    searchClassroom () {
      this.$router.push({ path: '/portal/classroom' })
    },
    searchBook () {
      this.$router.push({ path: '/portal/books' })
    },
    borrowReturn () {
      this.$router.push({ path: '/portal/borrowReturn' })
    },
    logout () {
      this.$messagebox({
        title: '提示',
        message: '是否退出当前帐号?',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(action => {
        if (action === 'confirm') {
          this.$router.push({ path: '/auth/login' })
        } else {
          console.log('')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .bigBox{
    -webkit-flex-wrap:wrap;
    flex-wrap:wrap;
    .appBoxEmp {
      padding: 1rem;
      margin: 0.3rem;
    }
    .appBox{
       background: #fff;
       padding: 1rem!important;
       margin: 0.3rem;
       span{
         font-size: 0.8rem;
         margin-top: 0.5rem;
         display: block;
       }
      .img_box{
        width:3.5em;
        height:3.3em;
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        border-radius: 50%;
        img{
          width:2em;
          height:2em;
        }
      }
    }
  }
  .tabbar {
    position: fixed;
    bottom: 0;
    width: 100%;
    color: #666;
    .tabbarItem {
      padding: 0.2rem;
    }
  }
</style>
