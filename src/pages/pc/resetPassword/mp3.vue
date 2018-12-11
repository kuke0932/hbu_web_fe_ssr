<template>
  <div class="tabItem steps2" style="display: block;">
    <div class="step3">
      <div class="steps">
        <ul>
          <li class="bgStep1">第一步</li>
          <li class="bgStep2">第二步</li>
          <li class="bgStep3 bgStep3Selected">第三步</li>
        </ul>
      </div>

      <div class="stepCon byMobile" style="margin-top: 100px;">
        <img src="/img/pc/success.png" width="150" height="103" alt="">
        <div class="successTip">
          密码已成功找回,请注意保管新密码！
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
