<template>
	<el-collapse :model-value="['1','2','3','4','5','6','7']">
		<el-collapse-item name="1">
			<template #title>
				<img src="@/assets/icons/icon-api-a.png" width="20">
				<b>API信息</b>
			</template>
			<el-input v-model="caseData.interface.url" style="max-width: 600px" readonly disabled=ture>
				<template #prepend>
					<el-select v-model="caseData.interface.method" placeholder="选择请求方法" style="width: 115px">
						<el-option label="GET" value="get" />
						<el-option label="POST" value="post" />
						<el-option label="PUT" value="put" />
						<el-option label="PATCH" value="patch" />
						<el-option label="DELETE" value="delete" />
					</el-select>
				</template>
			</el-input>
		</el-collapse-item>
		<el-collapse-item name="2">
			<template #title>
				<img src="@/assets/icons/case.png" width="20">
				<b>用例名称</b>
			</template>
			<el-input v-model="caseData.title" style="max-width: 600px">
				<template #prepend>
					<span>用例名称</span>
				</template>
			</el-input>
		</el-collapse-item>
		<el-collapse-item name="3">
			<template #title>
				<img src="@/assets/icons/instruction.png" width="20">
				<b>前置脚本</b>
			</template>
			<div class='script_code'>
				<div class="code">
					<Editor v-model="caseData.setup_script" lang="python" height='300px'></Editor>
				</div>
				<div class='mod'>
					<div class="add_code">
						<el-button @click='addSetupScript("func")' plain size="small">调用全局工具函数</el-button>
					</div>
					<div class="add_code">
						<el-button @click='addSetupScript("global")' plain size="small">设置全局变量</el-button>
					</div>
					<div class="add_code">
						<el-button @click='addSetupScript("env")' plain size="small">设置局部变量</el-button>
					</div>
					<div class="add_code">
						<el-button @click='addSetupScript("sql")' plain size="small">执行sql查询</el-button>
					</div>
				</div>
			</div>

		</el-collapse-item>
		<el-collapse-item name="4">
			<template #title>
				<img src="@/assets/icons/keyhole.png" width="20">
				<b>请求头</b>
			</template>
			<Editor lang='json' v-model="caseData.headers"></Editor>
		</el-collapse-item>
		<el-collapse-item name="5">
			<template #title>
				<img src="@/assets/icons/API_api.png" width="20">
				<b>查询参数</b>
			</template>
			<Editor lang='json' v-model="caseData.request.params"></Editor>
		</el-collapse-item>
		<el-collapse-item name="6">
			<template #title>
				<img src="@/assets/icons/body.png" width="20">
				<b>请求体</b>
			</template>
			<el-radio-group v-model="bodyType">
				<el-radio-button value="json">Json</el-radio-button>
				<el-radio-button value="data">X-www-form-urlencoded</el-radio-button>
				<el-radio-button value="form-data">form-data</el-radio-button>
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
		</el-collapse-item>
		<el-collapse-item name="7">
			<template #title>
				<img src="@/assets/icons/instruction.png" width="20">
				<b>后置断言脚本</b>
			</template>
			<div class='script_code'>
				<div class="code">
					<Editor v-model="caseData.teardown_script" lang="python" height='300px'></Editor>
				</div>
				<div class='mod'>
					<el-scrollbar height="300px">
						<div class="add_code">
							<el-button @click="addTearDownCodeMod('func')" plain size="small">调用全局工具函数</el-button>
						</div>
						<div class="add_code">
							<el-button @click="addTearDownCodeMod('getBody')" plain size="small">获取响应体</el-button>
						</div>
						<div class="add_code">
							<el-button @click="addTearDownCodeMod('global')" plain size="small">设置全局变量</el-button>
						</div>
						<div class="add_code">
							<el-button @click="addTearDownCodeMod('env')" plain size="small">设置局部变量</el-button>
						</div>
						<div class="add_code">
							<el-button @click="addTearDownCodeMod('sql')" plain size="small">执行sql查询</el-button>
						</div>
						<div class="add_code">
							<el-button @click="addTearDownCodeMod('JSextract')" plain
								size="small">Jsonpath提取数据</el-button>
						</div>
						<div class="add_code">
							<el-button @click="addTearDownCodeMod('REextract')" plain size="small">正则提取数据</el-button>
						</div>
						<div class="add_code">
							<el-button @click="addTearDownCodeMod('http')" plain size="small">HTTP状态码断言</el-button>
						</div>
						<div class="add_code">
							<el-button @click="addTearDownCodeMod('eq')" plain size="small">断言相对</el-button>
						</div>
						<div class="add_code">
							<el-button @click="addTearDownCodeMod('contain')" plain size="small">断言包含</el-button>
						</div>
					</el-scrollbar>
				</div>
			</div>
		</el-collapse-item>
	</el-collapse>

	<el-affix :offset="40" position="bottom">
		<div class="btns" v-if="caseObj.id">
			<el-button @click="runCase" type="primary" plain size="small" icon="Promotion">运行</el-button>
			<el-button @click="copyCase" type="primary" plain size="small" icon="CopyDocument">复制</el-button>
			<el-button @click="saveCase" type="primary" plain size="small" icon="FolderChecked">保存</el-button>
			<el-button @click="clickDelete" type="danger" plain size="small" icon="delete">删除</el-button>
		</div>
	</el-affix>
	<!-- 测试用例运行的结果 -->
	<el-drawer v-model="isShowDrawer">
		<template #header>
			<b>运行结果</b>
		</template>
		<template #default>
			<!-- 添加表单 -->
			<Result :result='responseData'></Result>
		</template>
	</el-drawer>

</template>

<script setup>
	import {
		ref,
		reactive,
		watch
	} from "vue"
	import {
		ElNotification,
		ElMessageBox,
		ElMessage
	} from 'element-plus'
	import Editor from '@/components/Editor'
	import api from "@/api";
	import {
		ProjectStore
	} from "@/stores/module/ProStore";
	import Result from '@/components/Result.vue'
	const prop = defineProps({
		case_id: ""
	})
	let bodyType = ref('json')
	const caseData = reactive({
		title: "",
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
	// 定义用例数据对象
	let caseObj = {}
	// 侦听case_id的变化,参数1--要侦听的数据
	watch(() => prop.case_id, (val) => {
		// 如果侦听到的case_id不为空（默认我们是赋值的空）,执行getCaseInfo函数
		if (val !== '') {
			getCaseInfo(val)
		}
	})
	// 调用获取用例详情的接口
	async function getCaseInfo(id) {
		const response = await api.getCaseInfoApi(id)
		// 判断一下返回的相应状态码
		if (response.status === 200) {
			// 请求成功，保存用例对象
			caseObj = response.data
			// 把用例数据绑定到编辑页面
			caseData.title = caseObj.title
			caseData.interface = caseObj.interface
			caseData.setup_script = caseObj.setup_script
			caseData.teardown_script = caseObj.teardown_script
			caseData.file = caseObj.file
			// 上面的简单，headers要处理一下，因为这里需要的是字符串，后端返回的是json,缩进4格
			caseData.headers = JSON.stringify(caseObj.headers, 0, 4)
			// caseObj.request.json || {} 确保即使 caseObj.request.json 为空，也会有一个空对象作为默认值。
			// JSON.stringify() 将 JavaScript 对象转换成 JSON 格式的字符串， 确保 caseData.request.json 总是以字符串形式存储。
			// 这样可以避免在后续处理中出现 null 或 undefined 的问题， 并且确保数据格式一致。
			caseData.request.json = JSON.stringify(caseObj.request.json || {})
			caseData.request.data = JSON.stringify(caseObj.request.data || {})
			caseData.request.params = JSON.stringify(caseObj.request.params || {})
		}
	}
	const pstore = ProjectStore()
	// 删除测试用例的方法
	function clickDelete() {
		ElMessageBox.confirm(
			'删除操作不可恢复，是否确认删除该测试用例?',
			'提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			}
		).then(async () => {
			try {
				// 调用后端删除接口
				const response = await api.deleteCaseApi(prop.case_id);
				if (response.status === 204) {
					ElNotification({
						title: '删除成功',
						type: 'success',
					});
					// 刷新页面数据
					await pstore.getInterFaceList();
					resetData()
				} else {
					// 处理非204状态码的情况
					ElNotification({
						title: '删除失败',
						message: '服务器返回了非预期的状态码',
						type: 'error',
					});
				}
			} catch (error) {
				// 处理异步调用中可能出现的错误
				ElNotification({
					title: '删除失败',
					message: error.message || '未知错误',
					type: 'error',
				});
			}
		}).catch(() => {
			ElNotification({
				type: 'info',
				title: '已取消删除操作',
			});
		});

	}
	// 删除用例后，清空右侧页面中绑定的数据
	function resetData() {
		caseData.title = ''
		caseData.interface = {
				method: "get",
				url: "",

			},
			caseData.setup_script = ''
		caseData.teardown_script = ''
		caseData.file = []
		caseData.headers = '{}'
		caseData.request.json = '{}'
		caseData.request.data = '{}'
		caseData.request.params = '{}'
		caseObj = {}
	}
	// 复制用例
	async function copyCase() {
		const response = await api.createCaseApi({
			title: caseObj.title + '-COPY',
			interface: caseObj.interface.id
		})
		if (response.status === 201) {
			ElNotification({
				title: 'Copy成功',
				type: 'success',
			});
			// 刷新页面数据
			await pstore.getInterFaceList();
		}
		pstore.getInterFaceList()
	}
	async function saveCase() {
		// 参数准备
		const params = {
			title: caseData.title,
			headers: JSON.parse(caseData.headers),
			request: {
				params: JSON.parse(caseData.request.params),
			},

			setup_script: caseData.setup_script,
			teardown_script: caseData.teardown_script
		}
		if (bodyType.value === 'json') {
			params.request.json = JSON.parse(caseData.request.json)
		} else if (bodyType.value === 'data') {
			params.request.data = JSON.parse(caseData.request.data)
		} else {
			params.file = caseData.file
		}
		// 调用修改用例的接口
		const response = await api.updateCaseApi(prop.case_id, params)
		if (response.status === 200) {
			ElNotification({
				title: '保存成功',
				type: 'success',
			});
			// 刷新页面数据
			await pstore.getInterFaceList();
		}
	}
	// ======================运行用例====================
	// 保存用例运行的结果
	let responseData = ref({})
	// 是否显示结果的窗口
	let isShowDrawer = ref(false)
	async function runCase() {
		// 准备参数
		const params = {
			env: pstore.env,
			cases: {
				title: caseData.title,
				interface: caseData.interface,
				headers: JSON.parse(caseData.headers),
				request: {
					params: JSON.parse(caseData.request.params),
				},
				setup_script: caseData.setup_script,
				teardown_script: caseData.teardown_script,
			}
		}
		if (bodyType.value === 'json') {
			params.cases.request.json = JSON.parse(caseData.request.json)
		} else if (bodyType.value === 'data') {
			params.cases.request.data = JSON.parse(caseData.request.data)
		} else {
			params.cases.file = caseData.file
		}
		// 调用运行用例接口
		const response = await api.runInterFaceCaseApi(params)
		if (response.status === 200) {
			console.log('运行成功')
			responseData.value = response.data
		}
		isShowDrawer.value = true

	}

	// 生成前置脚本
	function addSetupScript(item) {
		if (item === "func") {
			caseData.setup_script += '\n# 调用全局工具函数random_mobile随机生成一个手机号码\nmobile = global_func.random_mobile()'
		} else if (item === "global") {
			caseData.setup_script += '\n# 设置全局变量\ntest.save_global_variable("变量名","变量值")'
		} else if (item === "env") {
			caseData.setup_script += '\n# 设置局部变量\ntest.save_env_variable("变量名","变量值")'
		} else if (item === "sql") {
			caseData.setup_script +=
				'\n # ----执行sql语句(需要在环境中配置数据库连接信息)----\n # db.连接名.execute_all(sql语句) \nsql = "SELECT count(*) as count FROM test.member"\nres = db.aliyun.execute_all(sql)'
		}

	}
	// 生成后置脚本
	function addTearDownCodeMod(item) {
		if (item === "getBody") {
			caseData.teardown_script += '\n# Demo:获取响应体(json)  \nbody = response.json()';
			caseData.teardown_script += '\n# Demo2:获取响应体(字符串)  \nbody = response.text';
		} else if (item === "JSextract") {
			caseData.teardown_script +=
				'\n# Demo:jsonpath提取response中的msg字段  \nmsg = test.json_extract(response.json(),"$..msg")';
		} else if (item === "REextract") {
			caseData.teardown_script += '\n# Demo:正则提取响应体中的数据  \nres = test.re_extract(response.text,"正则表达式",)';
		} else if (item === "sql") {
			caseData.setup_script +=
				'\n # ----执行sql语句(需要在环境中配置数据库连接信息)----\n # db.连接名.execute_all(sql语句) \nsql = "SELECT count(*) as count FROM test.member"\nres = db.aliyun.execute_all(sql)'
		} else if (item === "global") {
			caseData.teardown_script += '\n# 设置局部变量\ntest.save_global_variable("变量名","变量值")'
		} else if (item === "env") {
			caseData.teardown_script += '\n# 设置局部变量\ntest.save_env_variable("变量名","变量值")'
		} else if (item === "func") {
			caseData.teardown_script += '\n# 调用全局工具函数random_mobile随机生成一个手机号码\nmobile = global_func.random_mobile()'
		} else if (item === "http") {
			caseData.teardown_script +=
				'\n# 断言http状态码 \n# Demo:断言http状态码是否为200  \ntest.assertion("相等",200,response.status_cede)';
		} else if (item === "eq") {
			caseData.teardown_script += '\n# 断言相等 \ntest.assertion("相等","预期结果","实际结果")';
		} else if (item === "contain") {
			caseData.teardown_script += '\n# 断言包含:预期结果中的内容在实际结果中是否存在 \ntest.assertion("包含","预期结果","实际结果")';
		}
	}
	// 展示执行结果
</script>

<style lang="scss" scoped>
	.script_code {
		display: flex;

		.code {
			flex: 1;
		}

		.mod {
			width: 180px;

			.add_code {
				margin-left: 5px;
				margin-bottom: 5px;
			}

		}

	}

	.btns {
		text-align: center;
	}
</style>