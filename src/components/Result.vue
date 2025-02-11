<template>
	<!-- 使用 Element UI 的 el-tabs 组件显示测试结果的不同部分 -->
	<el-tabs type="border-card" class="demo-tabs" v-if='result.name'>
		<!-- 响应体标签页 -->
		<el-tab-pane label="响应体">
			<!-- 使用自定义的 Editor 组件显示响应体内容 -->
			<Editor lang="json" v-model='result.response_body'></Editor>
		</el-tab-pane>
		<!-- 响应头标签页 -->
		<el-tab-pane label="响应头">
			<!-- 遍历响应头数据并显示为标签 -->
			<div v-for='(v,k) in result.response_header'>
				<el-tag type="info">
					<b>{{k}} : {{v}}</b>
				</el-tag>
			</div>
		</el-tab-pane>
		<!-- 请求信息标签页 -->
		<el-tab-pane label="请求信息">
			<el-collapse>
				<!-- 请求基本信息折叠项 -->
				<el-collapse-item title="General" name="1">
					<div> Requests Methods:{{result.method}}</div>
					<div> Requests URL:{{result.url}}</div>
				</el-collapse-item>
				<!-- 请求头信息折叠项 -->
				<el-collapse-item title="Request Header" name="2">
					<div v-for='(v,k) in result.requests_header'>
						{{k}} : {{v}}
					</div>
				</el-collapse-item>
				<!-- 请求负载信息折叠项 -->
				<el-collapse-item title="Request Payload" name="3">
					{{result.requests_body}}
				</el-collapse-item>
			</el-collapse>
		</el-tab-pane>
		<!-- 日志标签页 -->
		<el-tab-pane label="日志">
			<div style="overflow-x: auto;">
				<!-- 遍历日志数据并根据日志级别显示不同颜色的标签 -->
				<div v-for='item in result.log_data'>
					<el-tag v-if='item[0] ==="INFO"' type="info">{{item[1]}}</el-tag>
					<el-tag v-else-if='item[0] ==="DEBUG"'>{{item[1]}}</el-tag>
					<el-tag v-else type="danger">{{item[1]}}</el-tag>
				</div>
			</div>
		</el-tab-pane>
		<!-- 断言结果标签页，禁用状态 -->
		<el-tab-pane disabled>
			<template #label>
				<span v-if='result.state==="成功"' style="color: #55aa7f;"> Assert:{{result.state}}</span>
				<span v-else style="color: #aa0000;"> Assert:{{result.state}}</span>
			</template>
		</el-tab-pane>
		<!-- HTTP状态码标签页，禁用状态 -->
		<el-tab-pane disabled>
			<template #label>
				<span v-if='result.status_cede < 300' style="color: #55aa7f;">Status:{{result.status_cede}}</span>
				<span v-else style="color: #aa0000;"> Status:{{result.status_cede}}</span>
			</template>
		</el-tab-pane>
		<!-- 运行时间标签页，禁用状态 -->
		<el-tab-pane disabled>
			<template #label>
				Time:{{result.run_time}}
			</template>
		</el-tab-pane>
	</el-tabs>

	<!-- 如果测试结果为失败，显示提交bug按钮 -->
	<div style="margin-top: 10px;width: 100%;text-align: center;" v-if="result.state === '失败'">
		<el-button v-show='!hideBtn' @click="addBugDlg = true" plain size="small">提交bug{{showbBtn}}</el-button>
	</div>
	<!-- 提交bug的弹窗 -->
	<el-dialog title="提交bug" v-model="addBugDlg" width="30%">
		<el-form :model="bugForm">
			<el-form-item label="所属接口">
				<!-- 下拉选择框，选择bug对应的接口 -->
				<el-select size="small" v-model="bugForm.interface" placeholder="bug对应的接口" style="width: 100%;">
					<el-option :label="iter.name + ' ' + iter.url" :value="iter.id" v-for="iter in interfaces"
						:key="iter.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="bug描述">
				<!-- 文本区域，输入bug描述 -->
				<el-input :autosize="{ minRows: 3, maxRows: 4 }" v-model="bugForm.desc" type="textarea"
					autocomplete="off"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button size="small" @click="addBugDlg = false">取 消</el-button>
				<el-button size="small" type="primary" plain @click="saveBug">确 定</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
	// 导入 Vue 的响应式 API 和组件
	import {
		ref,
		reactive,
		defineProps
	} from 'vue'
	import Editor from '@/components/Editor.vue'
	import api from '@/api/index'
	import {
		ElNotification
	} from 'element-plus'
	import {
		ProjectStore
	} from '@/stores/module/ProStore'

	// 定义组件的 props
	const prop = defineProps({
		result: {}, // 测试结果数据
		hideBtn: false // 是否隐藏提交bug按钮
	})

	// 实例化 store 对象
	const proStores = ProjectStore()
	const pro = proStores.pro
	const interfaces = proStores.interfaces

	// 定义折叠项的初始状态
	const activeNames = reactive(['1', '2', '3'])

	// 控制提交bug对话框的显示状态
	const addBugDlg = ref(false)

	// 定义提交bug表单的数据
	const bugForm = reactive({
		interface: null, // 选择的接口ID
		desc: '', // bug描述
		info: '', // 测试结果信息
		status: '未处理' // bug状态
	})

	// 保存bug的方法
	async function saveBug() {
		// 设置项目ID和测试结果信息
		bugForm.project = proStores.pro.id;
		bugForm.info = prop.result;

		// 调用API创建bug
		const response = await api.createBugs(bugForm);

		// 根据API响应显示通知
		if (response.status === 201) {
			ElNotification({
				type: 'success',
				title: 'bug提交成功',
				duration: 1000
			});
			// 关闭提交bug对话框
			addBugDlg.value = false;
		}
	}
</script>

<style>
	/* 可以在这里添加样式 */
</style>