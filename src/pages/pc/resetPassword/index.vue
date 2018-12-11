<template>
  <div class="tabItem" style="display: block;">
    <div class="tips" style="display: block;">
      <div class="tipDetail">
        <div class="welcome">欢迎使用河北大学统一认证平台密码找回服务</div>
        <div class="imgTips"><img src="/img/pc/tips.png" alt="tips"></div>
        1、用户初次登录后须绑定手机、设定密保问题或设置密保邮箱中至少一项。<br />
        2、如遇密码丢失等问题请用户优先使用密保问题、邮箱、手机号等方式在线找回密码。<br />
        3、初始密码有误或未设定密码保护问题的用户，可通过申诉方式提交相关资料找回密码，<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;审核结果及操作步骤将发送至电子邮箱。<br />
        4、人工重置请持个人身份证件到本部校区南院主楼426信息技术中心办理，电话5079705。<br />
      </div>
      <button class="beginFind" @click="next()">开&nbsp;始&nbsp;找&nbsp;回</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'baseInfo',
  head () {
    return {
      title: '找回密码'
    }
  },
  methods: {
    next () {
      this.$router.push({ path: '/pc/resetPassword/b1' })
    }
  }
}
</script>
<style>

  /* 找回密码提示 */
  .tabItem .tips{
  width: 100%;
  height: 598px;
  }
  .tabItem .tips .tipDetail{
    position: relative;
  width: 648px;
  padding: 44px;
  margin: 150px auto 0;
  text-align: left;
  font-size: 16px;
  line-height: 36px;
  color: #5f6368;
  border: 1px dashed #5490ff;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 10px;
  }
  .imgTips{
  width: 100px;
  height: 80px;
  position: absolute;
  left: 45px;
  top: -40px;
  background: #ffffff;
  }
  .imgTips img{
  display: block;
  margin: 0 auto;
  width: 80px;
  height: 80px;
  }
  .welcome{
  position: absolute;
  top: -90px;
  left: 0;
  width: 100%;
  color: #292b2d;
  font-size: 18px;
  text-align: center;}
  .tabItem .tips .beginFind{
  display: block;
  width: 200px;
  height: 46px;
  background: #5490ff;
  color: #ffffff;
  font-size: 16px;
  margin: 35px auto 0;
  }
</style>
