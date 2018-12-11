<template>
    <div>
      <!--<mt-header fixed title="个人信息">-->
        <!--<div slot="left">-->
          <!--<mt-button icon="back" @click="$router.back()"></mt-button>-->
        <!--</div>-->
      <!--</mt-header>-->
      <div style="text-align:left;">
        <mt-cell title="用户名" v-model="userInfo.account"></mt-cell>
        <mt-cell title="姓名" v-model="userInfo.name"></mt-cell>
        <!--<mt-cell title="专业" value="从数据库中调取信息" ></mt-cell>-->
        <!--<mt-cell title="班级" value="从数据库中调取信息" ></mt-cell>-->
        <!--<mt-cell title="手机号码" v-model="userInfo.mobile" @click.native="editphone" is-link></mt-cell>-->
        <!--<mt-cell title="邮箱地址" v-model="userInfo.email"  @click.native="editemail" is-link></mt-cell>-->
        <mt-cell title="手机号码" v-model="userInfo.mobile"></mt-cell>
        <!--<mt-cell title="邮箱地址" v-model="userInfo.email"></mt-cell>-->
      </div>
    </div>
</template>

<script>
export default {
  name: 'personal',
  head () {
    return {
      title: '个人信息'
    }
  },
  data () {
    return {
      userInfo: ''
    }
  },
  created () {
    this.userInfo = this.$route.query
  },
  methods: {
    editphone () {
      this.$messagebox({
        $type: 'prompt',
        title: '',
        message: '请输入新的手机号',
        showCancelButton: true,
        inputPattern: /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/,
        inputErrorMessage: '请输入正确的手机号',
        showInput: true,
        promptButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value, action }) => {
        console.log(value)
      }).catch(({ value, action }) => {
        console.log('')
      })
    },
    editemail () {
      this.$messagebox({
        type: 'prompt',
        title: '',
        message: '请输入新的邮箱地址',
        showCancelButton: true,
        inputPattern: /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/,
        inputErrorMessage: '请输入正确的邮箱地址',
        showInput: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value, action }) => {
        console.log(value)
      }).catch(({ value, action }) => {
        console.log('')
      })
    }
  }
}
</script>

<style scoped>

</style>
