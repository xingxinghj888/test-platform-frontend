<template>
	<div class=" main_box">
		<div class="card left_box">
			<!-- 顶部标题 -->
			<div class="title_box">
				<img src="@/assets/icons/icon-api-a.png" width="25">
				<div class="name">接口测试</div>
			</div>
			<el-tabs stretch v-model="activeTab">
				<!-- stretch属性：标签页的宽度是否自撑开 -->
				<el-tab-pane label="项目接口" name="api1">
					<!-- 层级菜单 -->
					<el-menu default-active="2">
						<!-- el-menu下面的菜单项或者层级菜单的index值必须是唯一的 -->
						<el-sub-menu :index="inter.id.toString()" v-for="inter in pstore.interfaces1" :key="inter.id">
							<template #title>
								<img src="@/assets/icons/icon-api-a.png" width="20">
								<el-tag v-if='inter.method=="get"' style="margin: 0 5px;" size="small"
									type="info">GET</el-tag>
								<el-tag v-else-if='inter.method=="post"' style="margin: 0 5px;" size="small"
									type="success">POST</el-tag>
								<el-tag v-else-if='inter.method=="patch"' style="margin: 0 5px;" size="small"
									type="warning">PATCH</el-tag>
								<el-tag v-else-if='inter.method=="put"' style="margin: 0 5px;" size="small"
									type="primary">PUT</el-tag>
								<el-tag v-else-if='inter.method=="delete"' style="margin: 0 5px;" size="small"
									type="danger">DELETE</el-tag>
								<span>{{inter.name}}</span>
							</template>
							<!-- el-menu下面的菜单项或者层级菜单的index值必须是唯一的 否则会同时激活多个相同index的菜单-->
							<el-menu-item @click="selectCase(_case.id)" :index="_case.id + _case.title"
								v-for="_case in inter.cases" key="_case.id" style="height: 35px;line-height: 35px;">
								<img src="@/assets/icons/case.png" width="20">
								<span style="margin: 0 5px;">{{_case.title}}</span>
							</el-menu-item>
							<!-- 添加用例 -->
							<el-menu-item @click="clickAddCase(inter.id)" :index="inter.id+'add'"
								style="height: 35px;line-height: 35px;">
								<img src="@/assets/icons/add-sub.png" width="20">
								<span style="margin: 0 5px;color: #17abe3;">添加用例</span>
							</el-menu-item>
						</el-sub-menu>
					</el-menu>
				</el-tab-pane>
				<el-tab-pane label="第三方接口" name="api2">
					<!-- 层级菜单 -->
					<el-menu default-active="2">
						<!-- el-menu下面的菜单项或者层级菜单的index值必须是唯一的 -->
						<el-sub-menu :index="inter.id.toString()" v-for="inter in pstore.interfaces2" :key="inter.id">
							<template #title>
								<img src="@/assets/icons/icon-api-a.png" width="20">
								<el-tag style="margin: 0 5px;" size="small" type="info">POST</el-tag>
								<span>{{inter.name}}</span>
							</template>
							<!-- el-menu下面的菜单项或者层级菜单的index值必须是唯一的 否则会同时激活多个相同index的菜单-->
							<el-menu-item @click="selectCase(_case.id)" :index="_case.id + _case.title"
								v-for="_case in inter.cases" key="_case.id" style="height: 35px;line-height: 35px;">
								<img src="@/assets/icons/case.png" width="20">
								<span style="margin: 0 5px;">{{_case.title}}</span>
							</el-menu-item>
							<!-- 添加用例 -->
							<el-menu-item @click="clickAddCase(inter.id)" :index="inter.id+'add'"
								style="height: 35px;line-height: 35px;">
								<img src="@/assets/icons/add-sub.png" width="20">
								<span style="margin: 0 5px;color: #17abe3;">添加用例</span>
							</el-menu-item>
						</el-sub-menu>
					</el-menu>
				</el-tab-pane>
			</el-tabs>

		</div>

		<div class="card right_box">
			<CaseEditor :case_id='activeCase'></CaseEditor>
		</div>
	</div>
	<!-- 添加用例的弹窗 -->
	<el-drawer v-model="isShowDrawer">
		<template #header>
			<b>添加用例</b>
		</template>
		<template #default>
			<!-- 添加表单 -->
			<el-input v-model="newCase.title" />
		</template>
		<template #footer>
			<div style="flex: auto">
				<el-button @click="isShowDrawer=false">取消</el-button>
				<el-button @click="addCase" type="primary">确定</el-button>
			</div>
		</template>
	</el-drawer>
</template>

<script setup>
	import {
		ProjectStore
	} from '@/stores/module/ProStore'
	import CaseEditor from '@/components/CaseEditor.vue'
	import api from '@/api/index'
	import {
		ElNotification
	} from 'element-plus'
	import {
		reactive,
		ref
	} from 'vue';

	const activeTab = ref('api1')
	const pstore = ProjectStore()
	// 定义一个响应式变量，激活的用例，默认是空
	// 页面激活的用例ID
	let activeCase = ref()
	// 定义点击事件的方法，把接收的用例id传进去，赋值给activeCase
	// 选中的用例
	function selectCase(id) {
		activeCase.value = id
	}
	let isShowDrawer = ref(false)
	let newCase = reactive({
		title: "",
		interface: null,
	})
	// 点击添加用例
	function clickAddCase(interId) {
		// 显示窗口
		isShowDrawer.value = true
		newCase.interface = interId
	}
	// 发送添加用例的请求
	async function addCase() {
		const response = await api.createCaseApi(newCase)
		if (response.status === 201) {
			// 弹出提示
			ElNotification({
				title: '添加成功',
				type: 'success',
			})
			// 用例添加成功后，更新页面数据
			await pstore.getInterFaceList()
			// 选中新的用例
			selectCase(response.data.id)
			// 关闭窗口
			isShowDrawer.value = false
		}
	}
</script>

<style lang="scss" scoped>
	.main_box {
		height: calc(100% - 42px);
		display: flex;
	}

	.left_box {
		width: 230px;


		// 左侧样式
		.title_box {
			display: flex;
			height: 40px;
			align-items: center;
			justify-content: center;
			border-bottom: solid 1px #6a6a6a;

			.name {
				font-weight: bold;
				margin-left: 5px;
			}
		}

		.el-menu {
			border-right: none;
		}
	}

	// 右侧样式
	.right_box {
		flex: 1;
		padding: 10px;
	}
</style>