<template>
  <div class="tabItem steps2" style="display: block;">
    <div class="step1">
      <div class="steps">
        <ul>
          <li class="bgStep1 bgStep1Selected">基本信息</li>
          <li class="bgStep2">找回操作</li>
          <li class="bgStep3">完成</li>
        </ul>
      </div>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px" class="forms">
        <el-form-item label="账号" prop="account">
          <el-input @blur="getTypes" v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="找回方式" prop="byWay">
          <el-select v-model="form.byWay" placeholder="请选择" style="width: 370px;" @focus="selectByWay">
            <el-option
              v-for="item in byWayOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button :loading="btnLoading" style="padding: 12px 70px;" type="primary"  @click="next('form')">下一步</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
// import { MessageBox } from 'mint-ui'
import { getResetPasswordTypes, resetPassword1 } from '@/api/auth'
// import { jssdk, getResetPasswordTypes, resetPassword1 } from '@/api/auth'
import { Base64 } from 'js-base64'

export default {
  name: 'baseInfo',
  head () {
    return {
      title: '找回密码'
    }
  },
  data () {
    return {
      btnLoading: false,
      byWayOptions: [],
      form: {
        account: '',
        name: '',
        byWay: '',
        mobile: ''
      },
      sessionId: null,
      hasMobile: false,
      hasHeadImg: false,
      recommendTypeIndex: '',
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        byWay: [
          { required: true, message: '请选择找回方式', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    getTypes () {
      this.byWayOptions = [
        {
          value: '0',
          label: '人脸识别',
          disabled: false
        },
        {
          value: '1',
          label: '手机号',
          disabled: false
        },
        {
          value: '2',
          label: '人工申诉',
          disabled: false
        }]
      if (this.form.account) {
        for (let i = 0; i < this.byWayOptions.length; i++) {
          this.byWayOptions[i].disabled = false
        }
        getResetPasswordTypes(this.form.account).then(resp => {
          console.log(resp)
          if (resp.status === 211) {
            this.$alert('无此用户，请重新输入', '系统出错了', {
              confirmButtonText: '确定',
              callback: action => {
                this.form.account = ''
              }
            })
            return
          }
          this.hasMobile = resp.data.hasMobile
          this.hasHeadImg = resp.data.hasHeadImg
          this.form.mobile = resp.data.mobile
          this.recommendTypeIndex = resp.data.recommendTypeIndex
          this.byWayOptions[this.recommendTypeIndex].label = this.byWayOptions[this.recommendTypeIndex].label + '（推荐）'
          this.form.byWay = this.byWayOptions[this.recommendTypeIndex].value
          if (this.hasMobile) {
            this.byWayOptions[1].disabled = false
          } else {
            this.byWayOptions[1].disabled = true
          }
          if (this.hasHeadImg) {
            this.byWayOptions[0].disabled = false
          } else {
            this.byWayOptions[0].disabled = true
          }
        })
      }
    },
    selectByWay () {
      if (this.form.account === '') {
        this.$message('请先输入账号')
        for (let i = 0; i < this.byWayOptions.length; i++) {
          this.byWayOptions[i].disabled = true
        }
      }
    },
    next (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          // const openIdOrUserId = this.$route.query.openIdOrUserId
          const openIdOrUserId = 1
          resetPassword1(this.form.account, this.form.name, openIdOrUserId).then((resp) => {
            this.sessionId = resp.data.sessionId
            if (this.form.byWay === '0') {
              this.$router.push({ path: '/pc/resetPassword/fp2', query: { sessionId: this.sessionId } })
            } else if (this.form.byWay === '1') {
              this.$router.push({ path: '/pc/resetPassword/mp2', query: { sessionId: this.sessionId, mobile: Base64.encode(this.form.mobile) } })
            } else {
              this.$router.push({ path: '/pc/resetPassword/cp2', query: { sessionId: this.sessionId } })
            }
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
