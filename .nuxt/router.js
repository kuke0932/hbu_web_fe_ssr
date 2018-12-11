import Vue from 'vue'
import Router from 'vue-router'

const _e1f15736 = () => import('..\\src\\pages\\opinion\\index.vue' /* webpackChunkName: "pages_opinion_index" */).then(m => m.default || m)
const _ecc2ebe2 = () => import('..\\src\\pages\\fleaMarket\\index.vue' /* webpackChunkName: "pages_fleaMarket_index" */).then(m => m.default || m)
const _7035ae70 = () => import('..\\src\\pages\\pc.vue' /* webpackChunkName: "pages_pc" */).then(m => m.default || m)
const _0349c560 = () => import('..\\src\\pages\\pc\\resetPassword\\index.vue' /* webpackChunkName: "pages_pc_resetPassword_index" */).then(m => m.default || m)
const _1b5db6a5 = () => import('..\\src\\pages\\pc\\modifyPassword\\index.vue' /* webpackChunkName: "pages_pc_modifyPassword_index" */).then(m => m.default || m)
const _6786ddee = () => import('..\\src\\pages\\pc\\resetPassword\\mp3.vue' /* webpackChunkName: "pages_pc_resetPassword_mp3" */).then(m => m.default || m)
const _158981b2 = () => import('..\\src\\pages\\pc\\resetPassword\\fp3.vue' /* webpackChunkName: "pages_pc_resetPassword_fp3" */).then(m => m.default || m)
const _56888d64 = () => import('..\\src\\pages\\pc\\resetPassword\\cp3.vue' /* webpackChunkName: "pages_pc_resetPassword_cp3" */).then(m => m.default || m)
const _46d703fe = () => import('..\\src\\pages\\pc\\resetPassword\\b1.vue' /* webpackChunkName: "pages_pc_resetPassword_b1" */).then(m => m.default || m)
const _567a75e3 = () => import('..\\src\\pages\\pc\\resetPassword\\cp2.vue' /* webpackChunkName: "pages_pc_resetPassword_cp2" */).then(m => m.default || m)
const _15a5b0b4 = () => import('..\\src\\pages\\pc\\resetPassword\\fp2.vue' /* webpackChunkName: "pages_pc_resetPassword_fp2" */).then(m => m.default || m)
const _156d52b0 = () => import('..\\src\\pages\\pc\\resetPassword\\fp4.vue' /* webpackChunkName: "pages_pc_resetPassword_fp4" */).then(m => m.default || m)
const _6778c66d = () => import('..\\src\\pages\\pc\\resetPassword\\mp2.vue' /* webpackChunkName: "pages_pc_resetPassword_mp2" */).then(m => m.default || m)
const _2e01bdbe = () => import('..\\src\\pages\\portal\\index.vue' /* webpackChunkName: "pages_portal_index" */).then(m => m.default || m)
const _08213dc0 = () => import('..\\src\\pages\\auth\\register.vue' /* webpackChunkName: "pages_auth_register" */).then(m => m.default || m)
const _58190308 = () => import('..\\src\\pages\\auth\\bindMobile.vue' /* webpackChunkName: "pages_auth_bindMobile" */).then(m => m.default || m)
const _add8b320 = () => import('..\\src\\pages\\portal\\timetable.vue' /* webpackChunkName: "pages_portal_timetable" */).then(m => m.default || m)
const _4c5ad686 = () => import('..\\src\\pages\\opinion\\opinionDetail.vue' /* webpackChunkName: "pages_opinion_opinionDetail" */).then(m => m.default || m)
const _d3e4423a = () => import('..\\src\\pages\\auth\\faceResetPassword3.vue' /* webpackChunkName: "pages_auth_faceResetPassword3" */).then(m => m.default || m)
const _cff3523e = () => import('..\\src\\pages\\portal\\score.vue' /* webpackChunkName: "pages_portal_score" */).then(m => m.default || m)
const _38c97524 = () => import('..\\src\\pages\\auth\\resetPassword1.vue' /* webpackChunkName: "pages_auth_resetPassword1" */).then(m => m.default || m)
const _5d8982b0 = () => import('..\\src\\pages\\portal\\bookDetails.vue' /* webpackChunkName: "pages_portal_bookDetails" */).then(m => m.default || m)
const _1d07aa7e = () => import('..\\src\\pages\\portal\\personal.vue' /* webpackChunkName: "pages_portal_personal" */).then(m => m.default || m)
const _7bedd89e = () => import('..\\src\\pages\\opinion\\addOpinion.vue' /* webpackChunkName: "pages_opinion_addOpinion" */).then(m => m.default || m)
const _69933821 = () => import('..\\src\\pages\\fleaMarket\\addProduct.vue' /* webpackChunkName: "pages_fleaMarket_addProduct" */).then(m => m.default || m)
const _291d9f02 = () => import('..\\src\\pages\\fleaMarket\\fleaMarketDetail.vue' /* webpackChunkName: "pages_fleaMarket_fleaMarketDetail" */).then(m => m.default || m)
const _d41efbd2 = () => import('..\\src\\pages\\complaintAudit\\auditDetail.vue' /* webpackChunkName: "pages_complaintAudit_auditDetail" */).then(m => m.default || m)
const _4fc99a1d = () => import('..\\src\\pages\\auth\\forgetPassword2.vue' /* webpackChunkName: "pages_auth_forgetPassword2" */).then(m => m.default || m)
const _02d78138 = () => import('..\\src\\pages\\complaintAudit\\auditList.vue' /* webpackChunkName: "pages_complaintAudit_auditList" */).then(m => m.default || m)
const _d400713c = () => import('..\\src\\pages\\auth\\faceResetPassword2.vue' /* webpackChunkName: "pages_auth_faceResetPassword2" */).then(m => m.default || m)
const _312651d0 = () => import('..\\src\\pages\\complaintAudit\\initPassword.vue' /* webpackChunkName: "pages_complaintAudit_initPassword" */).then(m => m.default || m)
const _780c8506 = () => import('..\\src\\pages\\portal\\borrowReturn.vue' /* webpackChunkName: "pages_portal_borrowReturn" */).then(m => m.default || m)
const _4f760584 = () => import('..\\src\\pages\\auth\\help.vue' /* webpackChunkName: "pages_auth_help" */).then(m => m.default || m)
const _00665732 = () => import('..\\src\\pages\\auth\\modifyPassword.vue' /* webpackChunkName: "pages_auth_modifyPassword" */).then(m => m.default || m)
const _7f2c3e3c = () => import('..\\src\\pages\\auth\\login.vue' /* webpackChunkName: "pages_auth_login" */).then(m => m.default || m)
const _2e84bfee = () => import('..\\src\\pages\\auth\\registerHelper.vue' /* webpackChunkName: "pages_auth_registerHelper" */).then(m => m.default || m)
const _51b0caa2 = () => import('..\\src\\pages\\portal\\classroom.vue' /* webpackChunkName: "pages_portal_classroom" */).then(m => m.default || m)
const _7601654c = () => import('..\\src\\pages\\portal\\setup.vue' /* webpackChunkName: "pages_portal_setup" */).then(m => m.default || m)
const _78ec4706 = () => import('..\\src\\pages\\auth\\complaintResetPassword2.vue' /* webpackChunkName: "pages_auth_complaintResetPassword2" */).then(m => m.default || m)
const _da47220e = () => import('..\\src\\pages\\portal\\books.vue' /* webpackChunkName: "pages_portal_books" */).then(m => m.default || m)
const _532711a0 = () => import('..\\src\\pages\\portal\\exam.vue' /* webpackChunkName: "pages_portal_exam" */).then(m => m.default || m)

Vue.use(Router)


if (process.client) {
  window.history.scrollRestoration = 'manual'
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected
  if (to.matched.length < 2) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise((resolve) => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}


export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,
    routes: [
		{
			path: "/opinion",
			component: _e1f15736,
			name: "opinion"
		},
		{
			path: "/fleaMarket",
			component: _ecc2ebe2,
			name: "fleaMarket"
		},
		{
			path: "/pc",
			component: _7035ae70,
			name: "pc",
			children: [
				{
					path: "resetPassword",
					component: _0349c560,
					name: "pc-resetPassword"
				},
				{
					path: "modifyPassword",
					component: _1b5db6a5,
					name: "pc-modifyPassword"
				},
				{
					path: "resetPassword/mp3",
					component: _6786ddee,
					name: "pc-resetPassword-mp3"
				},
				{
					path: "resetPassword/fp3",
					component: _158981b2,
					name: "pc-resetPassword-fp3"
				},
				{
					path: "resetPassword/cp3",
					component: _56888d64,
					name: "pc-resetPassword-cp3"
				},
				{
					path: "resetPassword/b1",
					component: _46d703fe,
					name: "pc-resetPassword-b1"
				},
				{
					path: "resetPassword/cp2",
					component: _567a75e3,
					name: "pc-resetPassword-cp2"
				},
				{
					path: "resetPassword/fp2",
					component: _15a5b0b4,
					name: "pc-resetPassword-fp2"
				},
				{
					path: "resetPassword/fp4",
					component: _156d52b0,
					name: "pc-resetPassword-fp4"
				},
				{
					path: "resetPassword/mp2",
					component: _6778c66d,
					name: "pc-resetPassword-mp2"
				}
			]
		},
		{
			path: "/portal",
			component: _2e01bdbe,
			name: "portal"
		},
		{
			path: "/auth/register",
			component: _08213dc0,
			name: "auth-register"
		},
		{
			path: "/auth/bindMobile",
			component: _58190308,
			name: "auth-bindMobile"
		},
		{
			path: "/portal/timetable",
			component: _add8b320,
			name: "portal-timetable"
		},
		{
			path: "/opinion/opinionDetail",
			component: _4c5ad686,
			name: "opinion-opinionDetail"
		},
		{
			path: "/auth/faceResetPassword3",
			component: _d3e4423a,
			name: "auth-faceResetPassword3"
		},
		{
			path: "/portal/score",
			component: _cff3523e,
			name: "portal-score"
		},
		{
			path: "/auth/resetPassword1",
			component: _38c97524,
			name: "auth-resetPassword1"
		},
		{
			path: "/portal/bookDetails",
			component: _5d8982b0,
			name: "portal-bookDetails"
		},
		{
			path: "/portal/personal",
			component: _1d07aa7e,
			name: "portal-personal"
		},
		{
			path: "/opinion/addOpinion",
			component: _7bedd89e,
			name: "opinion-addOpinion"
		},
		{
			path: "/fleaMarket/addProduct",
			component: _69933821,
			name: "fleaMarket-addProduct"
		},
		{
			path: "/fleaMarket/fleaMarketDetail",
			component: _291d9f02,
			name: "fleaMarket-fleaMarketDetail"
		},
		{
			path: "/complaintAudit/auditDetail",
			component: _d41efbd2,
			name: "complaintAudit-auditDetail"
		},
		{
			path: "/auth/forgetPassword2",
			component: _4fc99a1d,
			name: "auth-forgetPassword2"
		},
		{
			path: "/complaintAudit/auditList",
			component: _02d78138,
			name: "complaintAudit-auditList"
		},
		{
			path: "/auth/faceResetPassword2",
			component: _d400713c,
			name: "auth-faceResetPassword2"
		},
		{
			path: "/complaintAudit/initPassword",
			component: _312651d0,
			name: "complaintAudit-initPassword"
		},
		{
			path: "/portal/borrowReturn",
			component: _780c8506,
			name: "portal-borrowReturn"
		},
		{
			path: "/auth/help",
			component: _4f760584,
			name: "auth-help"
		},
		{
			path: "/auth/modifyPassword",
			component: _00665732,
			name: "auth-modifyPassword"
		},
		{
			path: "/auth/login",
			component: _7f2c3e3c,
			name: "auth-login"
		},
		{
			path: "/auth/registerHelper",
			component: _2e84bfee,
			name: "auth-registerHelper"
		},
		{
			path: "/portal/classroom",
			component: _51b0caa2,
			name: "portal-classroom"
		},
		{
			path: "/portal/setup",
			component: _7601654c,
			name: "portal-setup"
		},
		{
			path: "/auth/complaintResetPassword2",
			component: _78ec4706,
			name: "auth-complaintResetPassword2"
		},
		{
			path: "/portal/books",
			component: _da47220e,
			name: "portal-books"
		},
		{
			path: "/portal/exam",
			component: _532711a0,
			name: "portal-exam"
		}
    ],
    
    
    fallback: false
  })
}
