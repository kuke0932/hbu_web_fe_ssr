<template>
  <div class="tabItem steps2" style="display: block;">
    <div class="step3">
    <div class="steps">
      <ul>
        <li class="bgStep1">基本信息</li>
        <li class="bgStep2">提交资料</li>
        <li class="bgStep3 bgStep3Selected">完成</li>
      </ul>
    </div>

    <div class="stepCon byMobile" style="margin-top: 100px;">
      <img src="/img/pc/success.png" width="150" height="103" alt="">
      <div class="successTip">
        申请已提交，请等待审核！<br />
        审核通过后会以短信的形式发送到您手机上，请注意查收！
      </div>
    </div>
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
  }
}
</script>
