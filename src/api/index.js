import axios from 'axios'
import {
	UserStore
} from '@/stores/module/UserStore'
import {
	ElNotification,
	ElMessage
} from 'element-plus'
// ========进行基本的配置============
// 1.1开发环境后端的域名设置
axios.defaults.baseURL = 'http://localhost:8000/'
// 1.1生产环境后端接口的域名设置
// axios.defaults.baseURL = 'http://123.60.169.137:8899/'
// 请求成功还是失败的状态码范围
axios.defaults.validateStatus = function(status) {
	return true
}
axios.defaults.withCredentials = true


// 添加请求拦截器
axios.interceptors.request.use(function(config) {
	// 在发送请求之前做些什么
	// 
	if (config.url !== '/api/users/login/') {
		// 在请求配置中添加token
		const ustore = UserStore()
		const token = ustore.token
		// 注意Bearer后面有空格
		config.headers.Authorization = 'Bearer ' + token
	}

	return config;
}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});



// 添加响应拦截器
axios.interceptors.response.use(function(response) {
	if (response.status === 401) {
		ElNotification({
			title: '请求失败',
			message: 'token已过期或者未传递，您无权限访问该接口:' + response.config.url,
			type: 'error',
		})

	}
	// 2xx 范围内的状态码都会触发该函数。
	// 对响应数据做点什么
	return response;
});

// 封装后端请求的接口
export default {
	// ========登录相关接口=============
	// 登录接口
	loginApi(params) {
		return axios.post('/api/users/login/', params)
	},
	// 校验token是否有效
	verifyTokenApi(params) {
		return axios.post('/api/users/token/verify', params)
	},
	// =========项目相关接口=================
	// 获取项目列表接口
	getProListApi() {
		return axios.get('/api/testPro/projects/')
	},
	// 添加项目
	createProApi(params) {
		return axios.post('/api/testPro/projects/', params)
	},
	// 删除项目
	dleteProApi(id) {
		// 使用模版字符串，${id}接收id
		return axios.delete(`/api/testPro/projects/${id}/`)
	},
	// 编辑项目
	editProApi(id, params) {
		return axios.patch(`/api/testPro/projects/${id}/`, params)
	},
	// 获取单个项目详情
	getProInfoApi(id) {
		return axios.get(`/api/testPro/projects/${id}/`)
	},
	// ======================测试环境相关接口======================
	// 获取测试环境列表
	getEnvListApi(pro_id) {
		return axios.get('/api/testPro/envs/', {
			params: {
				project: pro_id
			}
		})


	},
	// 添加测试环境
	addEnvApi(params) {
		return axios.post(`/api/testPro/envs/`, params)
	},
	// 修改测试环境
	editEnvApi(id, params) {
		return axios.patch(`/api/testPro/envs/${id}/`, params)
	},
	// 删除测试环境
	deleteEnvApi(env_id) {
		return axios.delete(`/api/testPro/envs/${env_id}/`)
	},
	// ==============接口管理相关接口==================

	// 添加接口
	createInterFaceApi(params) {
		return axios.post('/api/TestInterFace/interfaces/', params)
	},

	// 获取接口列表
	getInterFaceListApi(pro_id) {
		return axios.get('/api/TestInterFace/interfaces/', {
			params: {
				project: pro_id
			}
		})
	},
	// 编辑接口
	updateInterFaceApi(id, params) {
		return axios.patch(`/api/TestInterFace/interfaces/${id}/`, params)
	},
	// 删除接口
	deleteInterFaceApi(id) {
		return axios.delete(`/api/TestInterFace/interfaces/${id}/`)
	},
	// ==============定义接口用例相关接口======================
	// 接口用例运行
	runInterFaceCaseApi(params) {
		return axios.post('/api/TestInterFace/cases/run/', params)
	},
	// 获取用例详情的接口
	getCaseInfoApi(id) {
		return axios.get(`/api/TestInterFace/cases/${id}/`)
	},
	// 添加测试用例/api/TestInterFace/cases/
	createCaseApi(params) {
		return axios.post(`/api/TestInterFace/cases/`, params)
	},
	// 修改用例
	updateCaseApi(id, params) {
		return axios.patch(`/api/TestInterFace/cases/${id}/`, params)
	},
	// 删除用例
	deleteCaseApi(id) {
		return axios.delete(`/api/TestInterFace/cases/${id}/`)
	},
	// ===============定义测试业务流相关接口=======================
	// 获取测试业务流列表/api/testFlow/scenes/

	getSceneListApi(pro_id) {
		return axios.get(`/api/testFlow/scenes/`, {
			params: {
				project: pro_id
			}
		})
	},
	// 添加测试业务流
	createSceneApi(params) {
		return axios.post(`/api/testFlow/scenes/`, params)
	},
	// 删除测试业务流
	deleteSceneApi(sceneId) {
		return axios.delete(`/api/testFlow/scenes/${sceneId}/`)
	},
	// 编辑测试业务流
	updateSceneApi(scene_id, param) {
		return axios.patch(`/api/testFlow/scenes/${scene_id}/`, param)
	},
	// 运行测试业务流
	runTestSceneApi(params) {
		return axios.post('/api/testFlow/scenes/run/', params)
	},
	// 获取业务流中的所有用例/api/testFlow/icases/
	getSceneCaseListApi(sceneId) {
		return axios.get(`/api/testFlow/icases/`, {
			params: {
				scene: sceneId
			}
		})
	},
	// 业务流中添加用例（步骤）
	addCaseToSceneApi(params) {
		return axios.post('/api/testFlow/icases/', params)
	},
	// 删除业务流中的用例（步骤）
	deleteCaseFromSceneApi(id) {
		return axios.delete(`/api/testFlow/icases/${id}/`)
	},
	// 修改测试业务流中用例执行的顺序
	updateSceneCaseSortApi(params) {
		return axios.patch('/api/testFlow/icases/order/', params)
	},
	// ===============测试结果相关接口=============
	//获取所有测试运行记录的接口
	getAllRecords(params) {
		return axios.get('/api/testTask/records/', {
			params: params
		})
	},
	getRecordsInfo(id) {
		return axios.get(`/api/testTask/records/${id}/`)
	},
	// ====================测试计划(任务)相关接口的接口======================
	// 获取任务(计划)列表
	getTaskList(proId) {
		return axios.get('/api/testTask/tasks/', {
			project: proId
		})
	},

	// 创建测试任务(计划)
	createTask(params) {
		return axios.post(`/api/testTask/tasks/`, params)
	},
	// 修改测试任务(计划)
	updateTask(id, params) {
		return axios.patch(`/api/testTask/tasks/${id}/`, params)
	},
	// 删除测试任务(计划)
	deleteTask(id) {
		return axios.delete(`/api/testTask/tasks/${id}/`)
	},
	// 获取单个测试任务(计划)
	getTaskInfo(id) {
		return axios.get(`/api/testTask/tasks/${id}/`)
	},
	// 运行测试计划
	runTask(params) {
		return axios.post(`/api/testTask/tasks/run/`, params)
	},
	// 获取测试报告数据
	getTaskReport(recordsId) {
		return axios.get(`/api/testTask/report/${recordsId}/`)
	},
	// ========定时任务相关接口====
	//获取定时任务列表
	getCrons(projectId) {
		return axios.get(`/api/crontab/cronjob/`, {
			params: {
				project: projectId
			}
		})
	},
	// 删除定时任务
	delCron(id) {
		return axios.delete(`/api/crontab/cronjob/${id}/`)
	},
	// 添加定时任务
	createCron(params) {
		return axios.post(`/api/crontab/cronjob/`, params)
	},
	// 修改定时任务
	updateCron(id, params) {
		return axios.patch(`/api/crontab/cronjob/${id}/`, params)
	},
	//bug管理相关的接口
	//=====================bug管理======================
	// 获取所有bug
	getBugs(params) {
		return axios.get(`/api/bug/bugs/`, {
			params: params
		})
	},
	// 提交bug记录
	createBugs(params) {
		return axios.post(`/api/bug/bugs/`, params)
	},
	// 修改bug状态
	updateBug(id, params) {
		return axios.patch(`/api/bug/bugs/${id}/`, params)
	},
	// 查看bug详情
	getBugInfo(id) {
		return axios.get(`/api/bug/bugs/${id}/`)
	},
	// 文件管理
	// 上传文件接口信息
	uploadApi: {
		url: axios.defaults.baseURL + `/api/testPro/files/`,

	},
	// 获取文件列表
	getFiles() {
		return axios.get(`/api/testPro/files/`)
	},
	// 删除文件
	deleteFile(id) {
		return axios.delete(`/api/testPro/file/${id}/`)
	},
// ======================性能测试相关接口======================
// 性能测试计划相关接口
getPerfPlansApi(params) {
  return axios.get('/api/performance/plans/', {params})
},
createPerfPlanApi(params) {
  return axios.post('/api/performance/plans/', params)
},
updatePerfPlanApi(id, params) {
  return axios.patch(`/api/performance/plans/${id}/`, params)
},
deletePerfPlanApi(id) {
  return axios.delete(`/api/performance/plans/${id}/`)
},

// 性能测试配置相关接口
getPerfConfigsApi(params) {
  return axios.get('/api/performance/configs/', {params})
},
createPerfConfigApi(params) {
  return axios.post('/api/performance/configs/', params)
},
updatePerfConfigApi(id, params) {
  return axios.patch(`/api/performance/configs/${id}/`, params)
},
deletePerfConfigApi(id) {
  return axios.delete(`/api/performance/configs/${id}/`)
},

// 性能测试执行相关接口
startPerfTestApi(id) {
  return axios.post(`/api/performance/tests/${id}/start/`)
},
stopPerfTestApi(id) {
  return axios.post(`/api/performance/tests/${id}/stop/`)
},
pausePerfTestApi(id) {
  return axios.post(`/api/performance/tests/${id}/pause/`)
},
resumePerfTestApi(id) {
  return axios.post(`/api/performance/tests/${id}/resume/`)
},
getPerfTestStatusApi(id) {
  return axios.get(`/api/performance/tests/${id}/status/`)
},

// 性能测试报告相关接口
getPerfReportsApi(params) {
  return axios.get('/api/performance/reports/', {params})
},
getPerfReportDetailApi(id) {
  return axios.get(`/api/performance/reports/${id}/`)
},
deletePerfReportApi(id) {
  return axios.delete(`/api/performance/reports/${id}/`)
}

}