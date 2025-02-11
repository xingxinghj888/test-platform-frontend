import {
	createRouter,
	createWebHashHistory
} from 'vue-router'
import {
	UserStore
} from '@/stores/module/UserStore'

const routes = [{
		path: '/',
		name: 'index',
		redirect: '/users/login'
	},
	// 登录页面的路由
	{
		path: '/users/login',
		name: 'login',
		component: () => import( /* webpackChunkName: "about" */ '../views/login/LoginView.vue')
	},
	{
		path: '/project/manage',
		name: 'pro_manage',
		component: () => import( /* webpackChunkName: "about" */ '../views/proManage/ProManageView.vue')
	},
	{
		path: '/project/home',
		name: 'home',
		component: () => import( /* webpackChunkName: "about" */ '../views/home/HomeView.vue'),
		redirect: '/project/testEnv',
		children: [{
				path: '/project/testEnv',
				name: 'testEnv',
				component: () => import( /* webpackChunkName: "about" */ '../views/testEnv/TestEnvView.vue'),
				meta: {
					name: "测试环境",
				}
			},
			{
				path: '/project/interFace',
				name: 'interFace',
				component: () => import( /* webpackChunkName: "about" */
					'../views/interFace/interFaceView.vue'),
				meta: {
					name: "接口管理",
				}
			},
			{
				path: '/project/interCase',
				name: 'interCase',
				component: () => import( /* webpackChunkName: "about" */
					'../views/interCase/interCaseView.vue'),
				meta: {
					name: "接口用例",
				}
			},
			{
				path: '/project/testScent',
				name: 'scent',
				component: () => import( /* webpackChunkName: "about" */
					'../views/testScent/testScentView.vue'),
				meta: {
					name: "业务流测试",
				}
			},
			{
				path: '/project/testtask',
				name: 'testtask',
				component: () => import( /* webpackChunkName: "about" */ '../views/testTask/TestTaskView.vue'),
				meta: {
					name: "测试计划",
				}
			},
			{
				path: '/project/crontab',
				name: 'crontab',
				component: () => import( /* webpackChunkName: "about" */ '../views/crontab/crontabView.vue'),
				meta: {
					name: "定时任务",
				}
			},
			{
				path: '/project/bugs',
				name: 'bugs',
				component: () => import( /* webpackChunkName: "about" */ '../views/bugs/bugView.vue'),
				meta: {
					name: "bug管理",
				}
			},
			{
				path: '/project/records',
				name: 'records',
				component: () => import( /* webpackChunkName: "about" */ '../views/records/recordsView.vue'),
				meta: {
					name: "数据看板",
				}
			},
			{
				path: '/records/report/:id',
				name: 'report',
				component: () => import( /* webpackChunkName: "about" */ '../views/testReport/Report.vue'),
				meta: {
					name: "测试报告",
				}
			},
			{
				path: '/project/performance/plan',
				name: 'performance_plan',
				component: () => import( /* webpackChunkName: "about" */ '../views/performance/PlanView.vue'),
				meta: {
					name: "性能测试计划",
				}
			},
			{
				path: '/project/performance/preset',
				name: 'performance_preset',
				component: () => import( /* webpackChunkName: "about" */ '../views/performance/PresetView.vue'),
				meta: {
					name: "预设配置",
				}
			},
			{
				path: '/project/performance/report',
				name: 'performance_report',
				component: () => import( /* webpackChunkName: "about" */ '../views/performance/ReportView.vue'),
				meta: {
					name: "报告管理",
				}
			},
		]
	},


]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

// 添加路由导航守卫
router.beforeEach(async (to, from) => {
	const ustore = UserStore()

	// 把路由访问的记录保存到pinia中（即UserStore的Tabs中）
	// 判断当前访问的路由有没有name，有就表名是需要显示在标签栏的，我们需要存储到pinia
	if (to.meta.name) {
		ustore.addTabs(to)
	}

	// 获取用户是否登录的状态
	let isAuthenticated = ustore.isAuthenticated

	// 检查 token 是否有效
	if (!isAuthenticated && to.name !== 'login') {
		// 将用户重定向到登录页面
		ElNotification({
			title: '提示',
			message: '您的登录已过期，请重新登录',
			type: 'warning',
		})
		return {
			name: 'login'
		}
	}

	// 如果 token 有效，继续导航
	return true
})

export default router