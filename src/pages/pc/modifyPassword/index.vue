<template>
  <div class="container tabItem resetPwd">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm forms" style="margin: 50px auto 0;">
      <el-form-item label="账   号" prop="account">
        <el-input ref="account" focus v-model.trim="ruleForm.account" @blur="accountBlur" @change="accountChange"></el-input>
      </el-form-item>
      <el-form-item label="姓   名" prop="userName">
        <el-input v-model="ruleForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone"  v-if="noPhone">
        <el-input v-model.trim="ruleForm.phone" ></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="verifyCode"  v-if="noPhone">
        <el-input v-model.trim="ruleForm.verifyCode" style="width: 230px;display: block;float: left;" ></el-input>
        <!--<el-button type="warning" size="mini" round @click="getCode" :disabled="isDisabled">{{getCodeText}}</el-button>-->
        <el-button class="getCode" type="warning" @click="getCode" :disabled="isDisabled">{{getCodeText}}</el-button>
      </el-form-item>
      <el-form-item label="旧密码" prop="oldPwd">
        <el-input v-model.trim="ruleForm.oldPwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input v-model.trim="ruleForm.newPwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPwd">
        <el-input v-model.trim="ruleForm.confirmPwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-model="checked">加入河北大学微门户</el-checkbox>
        <span @click="showNotice">
          <img src="../../../assets/icon/helpPwd.svg" width="24" height="24" style="vertical-align: -6px">
        </span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { sendSmsCode, verifyHasMobile, modifyPassword } from '@/api/auth'

export default {
  name: 'modifyPassword',
  head () {
    return {
      title: '修改密码'
    }
  },
  data () {
    let matchNewPwd = (rule, value, callback) => { // 就是我们的回调函数，需要大家注意的是，这个没有在return的对象中，在data中
      if (!this.ruleForm.newPwd) {
        callback(new Error('请先输入新密码'))
      } else {
        if (value !== this.ruleForm.newPwd) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
    }
    return {
      checked: true,
      join: true,
      ruleForm: {
        account: '',
        userName: '',
        phone: '',
        verifyCode: '',
        oldPwd: '',
        newPwd: '',
        confirmPwd: '',
        weWorkVerify: true
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/, message: '手机号格式错误' }
        ],
        verifyCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        oldPwd: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          // eslint-disable-next-line
          { pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[])+$)([^(0-9a-zA-Z)]|[]|[a-z]|[A-Z]|[0-9]){6,12}$/g, message: '请至少输入字母，数字，字符中的两种,6-12位长度' }
        ],
        confirmPwd: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          // eslint-disable-next-line
          { pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[])+$)([^(0-9a-zA-Z)]|[]|[a-z]|[A-Z]|[0-9]){6,12}$/g, message: '请至少输入字母，数字，字符中的两种,6-12位长度' },
          { validator: matchNewPwd, trigger: 'blur' }
        ]
      },
      getCodeText: '获取验证码',
      isDisabled: false,
      noPhone: false
    }
  },
  directives: {
    'mtfocus' (el, binding, vnode) {
      const value = binding.value
      const mtinput = el.querySelector('input')
      mtinput.onfocus = () => {
      }
      mtinput.onblur = () => {
        value.methods.call(this, value)
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs['account'].focus()
    })
  },
  methods: {
    accountChange () {
      if (!this.ruleForm.account) {
        this.resetForm('ruleForm')
      }
    },
    accountBlur () {
      const that = this
      setTimeout(() => {
        if (that.ruleForm.account) {
          verifyHasMobile(that.ruleForm.account).then((resp) => {
            if (resp.status === 200) {
              that.noPhone = false
              that.$confirm('您已完善手机号，手机号码为' + resp.data.replace(/(.{3}).*(.{4})/, '$1****$2') + '，是否使用此手机号？请确保手机号与本人微信绑定的手机号相同。', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '更换手机号',
                type: 'warning'
              }).then(() => {
              }).catch(() => {
                that.noPhone = true
              })
            }
            if (resp.status === 211) {
              that.$message({
                showClose: true,
                message: resp.message,
                type: 'warning'
              })
            } else if (resp.status === 210) {
              that.$message({
                showClose: true,
                message: resp.message,
                type: 'warning',
                duration: 1000,
                onClose () {
                  that.noPhone = true
                }
              })
            }
          })
        }
      }, 200)
    },
    getCode () {
      if (this.ruleForm.phone === '') {
        this.$message({
          showClose: true,
          message: '手机号不能为空',
          type: 'warning',
          duration: 2000
        })
        return
      }
      sendSmsCode(this.ruleForm.phone).then(() => {
        this.$message({
          showClose: true,
          message: '发送成功',
          type: 'success'
        })
        this.isDisabled = true
        let time = 60
        let codeTime = setInterval(() => {
          time--
          this.getCodeText = time + 's后重新获取'
          if (time === 0) {
            this.getCodeText = '重新获取'
            this.isDisabled = false
            clearInterval(codeTime)
          }
        }, 1000)
      })
    },
    checkweWorkVerify (e) {
      this.ruleForm.weWorkVerify = e
    },
    showNotice () {
      this.$alert('1. 微信验证用于关联您在河北大学微门户中的身份，为您开放更多个性化应用权限。<br />2. 请使用河北大学统一认证用户信息验证您的身份。', '温馨提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        callback: action => {}
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.checked === true) {
            this.join = true
          } else {
            this.join = false
          }
          modifyPassword(
            this.ruleForm.account,
            this.ruleForm.userName,
            this.ruleForm.oldPwd,
            this.ruleForm.newPwd,
            this.ruleForm.confirmPwd,
            this.ruleForm.phone,
            this.ruleForm.verifyCode,
            this.ruleForm.weWorkVerify,
            this.join
          ).then(resp => {
            if (resp.status === 200) {
              this.$message({
                showClose: true,
                message: '修改成功!',
                type: 'success',
                duration: 2000
              })
              setTimeout(() => {
                this.resetForm(formName)
              }, 1000)
            }
          }).catch(e => { console.log(e) })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  /*.container {*/
    /*.form{*/
      /*width: 430px;*/
      /*margin: 50px auto;*/
    /*}*/
  /*}*/
  /* 单选 */
  label.bui-radios-label input {
    position: absolute;
    opacity: 0;
    visibility: hidden;
  }

  label.bui-radios-label .bui-radios {
    display: inline-block;
    position: relative;
    width: 13px;
    height: 13px;
    background: #FFFFFF;
    border: 1px solid #979797;
    border-radius: 50%;
    vertical-align: -2px;
  }

  label.bui-radios-label input:checked + .bui-radios:after {
    position: absolute;
    content: "";
    width: 7px;
    height: 7px;
    background-color: #fff;
    border-radius: 50%;
    top: 3px;
    left: 3px;
  }

  label.bui-radios-label input:checked + .bui-radios {
    background: #00B066;
    border: 1px solid #00B066;
  }

  label.bui-radios-label input:disabled + .bui-radios {
    background-color: #e8e8e8;
    border: solid 1px #979797;
  }

  label.bui-radios-label input:disabled:checked + .bui-radios:after {
    background-color: #c1c1c1;
  }

  label.bui-radios-label.bui-radios-anim .bui-radios {
    -webkit-transition: background-color ease-out .3s;
    transition: background-color ease-out .3s;
  }
  .getCode{
    width: 110px;
    height: 40px;
    margin-left: 10px;
    padding: 0;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;}
  .getCode span{
    display: block;
    height: 40px;
    line-height: 40px;
  }
</style>
