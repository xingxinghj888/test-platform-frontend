<template>
	<div class="main_box">
		<!-- 左侧 -->
		<div class="card left_box">
			<!-- 顶部标题 -->
			<div class="title_box">
				<img src="@/assets/icons/data.png" width="25">
				<div class="name">测试环境</div>
				<el-button @click='addEnv' size="small" icon='CirclePlus' plain>添加</el-button>
			</div>
			<!-- 环境列表 -->
			<el-menu :default-active="EnvInfo.id ? EnvInfo.id.toString() : ''">
				<el-menu-item @click='selectEnv(item)' :index="item.id.toString()" v-for='item in envList'
					key="item.id">
					<img src="@/assets/icons/data.png" width="20" style="margin-right: 10px;">
					<span>{{item.name}}</span>
				</el-menu-item>
			</el-menu>
		</div>
		<!-- 中间 -->
		<div class="card center_box">
			<el-divider content-position="left">基本信息</el-divider>
			<el-input v-model="env_name" placeholder="环境名称">
				<template #prepend>环境名称</template>
			</el-input>
			<el-input v-model="env_host" placeholder="BaseURL" style="margin-top: 5px;">
				<template #prepend>服务器域名</template>
			</el-input>
			<el-divider content-position="left">请求头/数据库</el-divider>
			<el-tabs type="border-card">
				<el-tab-pane label="全局请求头">
					<Editor lang="json" v-model="env_headers"></Editor>
				</el-tab-pane>
				<el-tab-pane label="数据库配置">
					<Editor lang="json" v-model="env_db"></Editor>
				</el-tab-pane>

			</el-tabs>

			<el-divider content-position="left">全局变量</el-divider>
			<el-tabs type="border-card">
				<el-tab-pane label="全局变量">
					<Editor lang="json" v-model="env_global_variable"></Editor>
				</el-tab-pane>
				<el-tab-pane label="调试运行变量">
					<Editor lang="json" v-model="env_debug_global_variable"></Editor>
				</el-tab-pane>
			</el-tabs>
			<el-affix :offset="40" position="bottom">
				<div class="btns" v-show='EnvInfo.id'>
					<el-button @click='saveEnv' type="primary" size="small">保存编辑</el-button>
					<el-button @click='copyEnv' type="primary" size="small">复制环境</el-button>
					<el-button @click='clickDeleteEnv' type="danger" size="small">删除环境</el-button>
				</div>
			</el-affix>

		</div>
		<!-- 右侧 -->
		<div class="card right_box">
			<el-divider content-position="left">全局工具函数</el-divider>
			<Editor lang="python" v-model="env_global_func" height='calc(100% - 50px)'></Editor>
		</div>

	</div>


</template>

<script setup>
	import api from '@/api/index'
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		ProjectStore
	} from '@/stores/module/ProStore'
	import {
		ElMessage,
		ElMessageBox,
		ElNotification
	} from 'element-plus'
	import Editor from '@/components/Editor'

	let envList = ref([])
	const pstore = ProjectStore()
	let EnvInfo = ref({})
	let env_name = ref('')
	let env_host = ref('')
	let env_headers = ref('{}')
	let env_db = ref('{}')
	let env_global_variable = ref('{}')
	let env_debug_global_variable = ref('{}')
	let env_global_func = ref('')

	// 选择环境的方法
	function selectEnv(env) {
	  EnvInfo.value = env
	  env_name.value = env.name
	  env_host.value = env.host
	  env_headers.value = JSON.stringify(env.header, null, 2)
	  env_db.value = JSON.stringify(env.db, null, 2)
	  env_global_variable.value = JSON.stringify(env.global_variable || {}, null, 2)
	  env_debug_global_variable.value = JSON.stringify(env.debug_global_variable || {}, null, 2)
	  env_global_func.value = env.global_func || ''
	}

	// 在组件挂载时获取环境列表
	onMounted(async () => {
	  await getEnvList()
	  if (envList.value.length > 0) {
	    selectEnv(envList.value[0])
	  }
	})
	async function getEnvList() {
		const project = pstore.pro.id
		const response = await api.getEnvListApi(project)
		if (response.status === 200) {
			envList.value = response.data
			// 在pinia中保存测试环境列表
			pstore.envList = response.data

		}
	}
	// ----------添加测试环境==================
	async function addEnv() {
		const response = await api.addEnvApi({
			project: pstore.pro.id,
			name: "new Env",
			host: "http://127.0.0.1",
			headers: '{}',
			db: '{}'
		})
		if (response.status === 201) {
			// 给出提示
			ElNotification({
				title: '测试环境创建成功',
				type: 'success',
			})
			// 更新页面数据
			await getEnvList()
			// 设置新环境为当前选中项
			selectEnv(response.data)
		}
	}
	function clickDeleteEnv() {
		ElMessageBox.confirm(
				'此操作不可恢复，确认要删除该测试环境?',
				'警告', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
			.then(async () => {
				const response = await api.deleteEnvApi(EnvInfo.value.id)
				if (response.status === 204) {
					// 提示
					ElNotification({
						title: '删除成功',
						type: 'success',
					})
					// 更新页面数据
					await getEnvList()
					// 重新设置一个选中的测试环境
					if (envList.value.length > 0) {
						selectEnv(envList.value[0])
					}
				}
			})
			.catch(() => {

			})
	}
	async function copyEnv() {
		const params = EnvInfo.value
		// console.log('复制的环境信息为：', params)
		params.name += '_Copy'
		const response = await api.addEnvApi(params)
		if (response.status === 201) {
			// 给出提示
			ElNotification({
				title: '复制成功',
				type: 'success',
			})
			// 更新页面数据
			getEnvList()
		}
	}
	// 保存环境
	async function saveEnv() {
		const env_id = EnvInfo.value.id
		// 修改时传递的参数
		const params = {
			name: env_name.value,
			host: env_host.value,
			global_func: env_global_func.value,
			db: JSON.parse(env_db.value),
			header: JSON.parse(env_headers.value),
			global_variable: JSON.parse(env_global_variable.value),
			debug_global_variable: JSON.parse(env_debug_global_variable.value),
		}
		const response = await api.editEnvApi(env_id, params)
		if (response.status === 200) {
			// 给出提示
			ElNotification({
				title: '保存成功',
				type: 'success',
			})
			// 更新页面数据
			await getEnvList()
		}
	}
</script>

<style lang="scss" scoped>
	.main_box {
		height: calc(100% - 42px);
		width: 100%;
		display: flex;

		// 左侧样式
		.left_box {
			width: 200px;

			.title_box {
				display: flex;
				height: 40px;
				align-items: center;
				justify-content: center;
				border-bottom: solid 1px #6a6a6a;

				.name {
					font-weight: bold;
					font-size: 18px;
					margin: 0 10px;
				}
			}

			.el-menu {
				border: none;

				.el-menu-item {
					height: 35px;
					line-height: 35px;
				}
			}


		}

		// 中间样式
		.center_box {
			width: 500px;
			padding: 5px;

			.btns {
				text-align: center;
			}
		}

		// 右侧样式
		.right_box {
			flex: 1;
		}

	}
</style>