<template>
  <div class="tabItem steps2" style="display: block;">
    <div class="step4">
      <div class="steps">
        <div class="steps" style="width: 888px;">
          <ul>
            <li class="bgStep1_1">基本资料</li>
            <li class="bgStep2_2">上传照片</li>
            <li class="bgStep3_3">设置新密码</li>
            <li class="bgStep4_4 bgStep4_4Selected">完成</li>
          </ul>
        </div>
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
