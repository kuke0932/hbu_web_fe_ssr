<template>
  <div id="app">
    <nuxt/>
  </div>
</template>

<style lang="less">
  * {
    margin:0;
    padding:0;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*margin-top:40px;*/
  }
  .header {
    background-color: #26a2ff;;
    color: white;
  }
  body {
    background-color: #f0f0f0;
  }
  .form .mint-field .mint-cell-title {
    width: 60px;
    text-align: left;
  }
  .mint-msgbox-input input{
    height: 30px!important;
  }
  #timerTable {
    .slot1 div{
      width: 100%;
    }
    .slot3 div{
      width: 100%;
    }
  }
  #classroom {
  .searchContent span {
    font-size: 0.7rem;
  }
  .cell2 .mint-cell-value {
    width: 100%;
    padding-left: 10px;
  span {
    display: inline-block;
    width: 100%;
  }
  }
  @media screen and (max-width: 320px) {
    .searchContent span {
      font-size: 0.6rem;
    }
  }
  }
  #books {
  .searchInfo {
  input {
    font-size: 0.8rem;
  }
  span {
    font-size: 0.8rem;
  }
  }
  }
  .mint-cell-title {
    text-align: left;
  }
  .register .mint-cell-title {
    width: 80px;
  }
  #resetPassword1 {
    .checkType {
      .mint-cell-title{
        flex: none!important;
        width: 105px;
      }
    }
  }
  .mint-cell-wrapper{
    background-image:-webkit-gradient(linear, left top, left bottom, from(#d9d9d9), color-stop(50%, #d9d9d9), color-stop(51%, transparent));
    background-image:linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 51%);
  }
  .mint-cell:last-child{
    background-image: none;
  }
  #borrowReturn .navbar .mint-tab-item-label, #auditList .navbar .mint-tab-item-label{
    font-size: 14px;
  }
  .confirm_cancel{
    width: 100%;
    color: #26a2ff;
    position: relative;
    height: 40px;
    border-bottom: 1px solid #eaeaea;
    span{
      width: 50%;
      text-align: center;
      float:left;
      line-height: 40px
    }
  }
  #modify .registerForm {
    .radioBox .mint-cell-title {
      flex: none;
      width: 105px;
    }
  }
</style>
