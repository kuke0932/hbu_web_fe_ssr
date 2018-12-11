// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
// import VConsole from 'vconsole'
Vue.config.productionTip = false

// 添加fastclick
FastClick.attach(document.body)

/* eslint-disable no-new */
// const vconsole = new VConsole()
// Vue.use(vconsole)

Vue.prototype.getQueryVariable = function (variable) {
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] === variable) {
      console.log(pair[1])
      const index = pair[1].indexOf('#')
      if (index >= 0) {
        return pair[1].substring(0, index)
      } else {
        return pair[1]
      }
    }
  }
  return null
}

/* 封装滑动按钮 */
Vue.directive('draggable', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    const eventPrevent = function () {
      event.preventDefault()
    }
    let flags = false
    let positionX, positionY, dx, dy, nx, ny, xPum, yPum
    el.ontouchstart = () => {
      flags = true
      let touch
      if (event.touches) {
        touch = event.touches[0]
      } else {
        touch = event
      }
      positionX = touch.clientX
      positionY = touch.clientY
      dx = el.offsetLeft
      dy = el.offsetTop
    }
    el.ontouchmove = () => {
      if (flags) {
        let touch
        if (event.touches) {
          touch = event.touches[0]
        } else {
          touch = event
        }
        nx = touch.clientX - positionX
        ny = touch.clientY - positionY
        xPum = dx + nx
        yPum = dy + ny

        // 此处的判断是为了防止拖拽框被拖出屏幕可视区域
        if (xPum < 0) {
          xPum = 0
        } else if (xPum > document.documentElement.clientWidth - el.offsetWidth) {
          xPum = document.documentElement.clientWidth - el.offsetWidth
        }
        if (yPum < 0) {
          yPum = 0
        } else if (yPum > document.documentElement.clientHeight - el.offsetHeight) {
          yPum = document.documentElement.clientHeight - el.offsetHeight
        }
        el.style.left = xPum + 'px'
        el.style.top = yPum + 'px'
        // 阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
        document.addEventListener('touchmove', eventPrevent, false)
      }
    }
    el.ontouchend = () => {
      document.removeEventListener('touchmove', eventPrevent)
      flags = false
    }
  }
})

/* 根据图书码编辑状态文字 */
const circulStatus = [
  { key: '01', value: '订购中' },
  { key: '02', value: '验收中' },
  { key: '03', value: '待编目' },
  { key: '04', value: '编目中' },
  { key: '05', value: '待典藏' },
  { key: '06', value: '典藏中' },
  { key: '10', value: '在架可借' },
  { key: '11', value: '本馆借出' },
  { key: '12', value: '本馆续借' },
  { key: '13', value: '本馆预约' },
  { key: '14', value: '本馆挂失' },
  { key: '15', value: '本馆遗失' },
  { key: '16', value: '怀疑遗失' },
  { key: '17', value: '赔书加工' },
  { key: '18', value: '出库装订' },
  { key: '1X', value: '剔旧' },
  { key: '90', value: '在架库本' },
  { key: '91', value: '库本借出' },
  { key: '92', value: '库本续借' },
  { key: '93', value: '库本预约' },
  { key: '94', value: '库本挂失' },
  { key: '95', value: '库本遗失' },
  { key: '96', value: '库本怀疑遗失' },
  { key: '97', value: '库本赔书加工' },
  { key: '98', value: '库本出库装订' },
  { key: '9X', value: '库本剔旧' },
  { key: 'Y0', value: '在库阅览' },
  { key: 'Y1', value: '阅览借出' },
  { key: 'Y4', value: '阅览挂失' },
  { key: 'Y5', value: '阅览遗失' },
  { key: 'Y6', value: '阅览怀疑遗失' },
  { key: 'Y7', value: '阅览赔书加工' },
  { key: 'Y8', value: '阅览出库装订' },
  { key: 'YX', value: '阅览剔旧' }
]
Vue.prototype.judgeCirculStatus = function (id) {
  let currentStatus = ''
  circulStatus.forEach(e => {
    if (e.key === id) {
      currentStatus = e.value
    }
  })
  return currentStatus
}
