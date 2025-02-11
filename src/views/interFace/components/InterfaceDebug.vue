<template>
	<!-- url地址 -->
	<el-input v-model="caseData.interface.url" style="max-width: 600px" placeholder="输入接口地址">
		<template #prepend>
			<el-select v-model="caseData.interface.method" placeholder="选择请求方法" style="width: 115px">
				<el-option label="GET" value="get" />
				<el-option label="POST" value="post" />
				<el-option label="PUT" value="put" />
				<el-option label="PATCH" value="patch" />
				<el-option label="DELETE" value="delete" />
			</el-select>
		</template>
		<template #append>
			<el-button @click="runInterFaceCase">运行</el-button>
		</template>
	</el-input>
	<!-- 请求信息 -->
	<el-divider content-position="left">请求信息</el-divider>
	<!-- 标签页 -->
	<el-tabs type="border-card" class="demo-tabs">
		<el-tab-pane label="请求头(headers)">
			<Editor lang='json' v-model="caseData.headers"></Editor>
		</el-tab-pane>
		<el-tab-pane label="查询参数(params)">
			<Editor lang='json' v-model="caseData.request.params"></Editor>
		</el-tab-pane>
		<el-tab-pane label="请求体(body)">
			<!-- 请求体三个选项，选择一个，下方显示对应的编译框-->
			<!-- 单选框要绑定一个参数类型 bodyType-->
			<el-radio-group v-model="bodyType">
				<el-radio value="json">Json</el-radio>
				<el-radio value="data">X-www-form-urlencoded</el-radio>
				<el-radio value="form-data">form-data</el-radio>
			</el-radio-group>
			<!-- 绑定json参数 -->
			<div v-if="bodyType==='json'">
				<Editor lang='json' v-model="caseData.request.json"></Editor>
			</div>
			<!-- 绑定表单参数 -->
			<div v-else-if="bodyType==='data'">
				<Editor lang='json' v-model="caseData.request.data"></Editor>
			</div>
			<div v-else>
				<Editor lang='json' v-model="caseData.request.data"></Editor>
			</div>
		</el-tab-pane>
		<!-- 前后置脚本是一个python编译器 -->
		<el-tab-pane label="前置脚本">
			<Editor lang='python' v-model="caseData.setup_script"></Editor>
		</el-tab-pane>
		<el-tab-pane label="后置脚本">
			<Editor lang='python' v-model="caseData.teardown_script"></Editor>
		</el-tab-pane>
	</el-tabs>
	<!-- 响应信息 -->
	<el-divider content-position="left">响应信息</el-divider>
	<!-- 标签页 -->
	<!-- Result标签，父级有一个result属性，把响应结果赋值给它 -->
	<Result :result='responseData'></Result>
</template>

<script setup>
	// 因为数据时多级嵌套的，所以加reactive
	import {
		ref,
		reactive
	} from 'vue'
	// 导入编辑器组件
	import Editor from '@/components/Editor.vue'
	import Result from '@/components/Result.vue'
	import api from '@/api/index'
	import {
		ProjectStore
	} from '@/stores/module/ProStore'
	//todo: 少了个括号
	const pstore = ProjectStore()

	// 定义用例数据
	const caseData = reactive({
		interface: {
			method: "get",
			url: "",

		},
		headers: '{}',
		request: {
			json: '{}',
			data: '{}',
			params: '{}'

		},
		file: [],
		setup_script: '',
		teardown_script: ''

	})
	let bodyType = ref('json')
	// =====发请求：运行接口用例=========
	// 定义一个响应式变量，存储接口响应数据
	let responseData = ref({})
	async function runInterFaceCase() {

		// 定义接口用例的参数
		const params = {
			// 环境是哪个呢？之前我们在顶部选择测试环境，保存在了pinia中，那么现在把它导入
			env: pstore.env,
			cases: {
				title: "调试运行",
				interface: caseData.interface,
				headers: JSON.parse(caseData.headers),
				setup_script: caseData.setup_script,
				teardown_script: caseData.teardown_script,
				file: caseData.file,
				request: {
					// 查询参数可以和请求体参数一起传的
					params: JSON.parse(caseData.request.params)
				},

			}
		}
		// 判断一下请求体参数类型，来决定request的值
		if (bodyType.value === 'json') {
			params.cases.request.json = JSON.parse(caseData.request.json)
		} else if (bodyType.value === 'data') {
			params.cases.request.data = JSON.parse(caseData.request.data)
		} else if (bodyType.value === 'data') {
			params.cases.request.data = JSON.parse(caseData.request.data)
		} else if (bodyType.value === 'form-data') {
			params.cases.request.file = caseData.request.file
		}
		console.log(params)
		// 发请求，没传参数
		const response = await api.runInterFaceCaseApi(params)
		if (response.status === 200) {
			console.log('运行成功')
			// 将响应结果复制给定义好的变量#reactive定义的对象，不能通过value直接赋值修改，只能对象.属性一个一个修改，不能一次修改对象中的所有的属性
			responseData.value = response.data
		}
	}
</script>

<style>

</style>