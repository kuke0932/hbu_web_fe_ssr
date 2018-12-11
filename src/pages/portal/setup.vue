<template>
  <div>
    <!--<swiper :options="swiperOption" ref="imgOverview" style="height: 100%;">-->
      <!--<swiper-slide>-->
        <!--<div class="swiper-zoom-container">-->
          <!--<img src="/img/sample375.jpg" alt="">-->
        <!--</div>-->
      <!--</swiper-slide>-->
    <!--</swiper>-->
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
// import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'setup',
  head () {
    return {
      title: '设置'
    }
  },
  components: {
    // swiper,
    // swiperSlide
  },
  data () {
    return {
      swiperOption: {
        width: window.innerWidth,
        zoom: true,
        initialSlide: 0
      }
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
