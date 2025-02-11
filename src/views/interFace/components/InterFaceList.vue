<template>
	<el-button @click="clickAdd" size="small" type='primary' plain>添加接口</el-button>
	<el-table :data="interfaces" style="width: 100%">
		<el-table-column prop="name" label="接口名称" width="180" />
		<el-table-column prop="url" label="接口地址" width="180" />
		<el-table-column prop="method" label="请求方法" />
		<el-table-column label="操作">
			<template #default="scope">
				<!-- 点击编辑按钮时，要把编辑的接口数据传进去，接口数据在那里呢？在作用域插槽里，scope.row插槽里面 -->
				<el-button @click="clickEdit(scope.row)" size="small" type='primary' icon='Edit' plain></el-button>
				<el-button @click="deleteInterface(scope.row.id)" size="small" type="danger" icon='Delete'
					plain></el-button>
			</template>
		</el-table-column>
	</el-table>
	<!-- 抽屉弹窗 -->
	<el-drawer v-model="isShowDrawer" :direction="direction">
		<template #header>
			<b>{{dlgTitle}}</b>
		</template>
		<template #default>
			<!-- 中间内容：添加的表单 ，添加和编辑的窗口其实是一样的区别是标题不同，我们可以只写一个-->

			<el-form :model="formData" label-width="auto" style="max-width: 600px">
				<el-form-item label="接口名称">
					<el-input v-model="formData.name" />
				</el-form-item>
				<el-form-item label="接口地址">
					<el-input v-model="formData.url" />
				</el-form-item>
				<el-form-item label="请求方法">
					<el-select v-model="formData.method">
						<el-option label="GET" value="get" />
						<el-option label="POST" value="post" />
						<el-option label="PUT" value="put" />
						<el-option label="PATCH" value="patch" />
						<el-option label="DELETE" value="delete" />
					</el-select>
				</el-form-item>
				<el-form-item label="接口类型">
					<el-select v-model="formData.type">
						<el-option label="项目接口" value="1" />
						<el-option label="第三方接口" value="2" />
					</el-select>
				</el-form-item>
			</el-form>
		</template>
		<template #footer>
			<div style="flex: auto">
				<el-button @click="isShowDrawer=false">取消</el-button>
				<el-button v-if="dlgTitle==='添加接口'" type="primary" @click="addInterface">确定</el-button>
				<el-button v-else type="primary" @click="updateInterface">确定</el-button>
			</div>
		</template>
	</el-drawer>
</template>

<script setup>
	import {
		ref,
		reactive
	} from 'vue'
	import api from '@/api';
	import {
		ElNotification,
		ElMessageBox,
		ElMessage
	} from 'element-plus'
	import {
		ProjectStore
	} from '@/stores/module/ProStore';
	const pstore = ProjectStore()
	// 定义组件的props
	const prop = defineProps({
		interfaces: []
	})
	// 是否显示添加接口的窗口
	let isShowDrawer = ref(false)
	let dlgTitle = ref("添加接口")
	let formData = reactive({
		name: "",
		url: "",
		method: "get",
		type: "1",
		project: pstore.pro.id
	})
	// 点击添加的方法
	function clickAdd() {
		dlgTitle.value = '添加接口'
		isShowDrawer.value = true
		// 如果原来有值就清空
		formData.name = ''
		formData.url = ''
		formData.method = 'get'
		formData.type = '1'
	}
	// 点击确认添加执行
	async function addInterface() {
		const response = await api.createInterFaceApi(formData)
		if (response.status === 201) {
			// 关闭窗口
			isShowDrawer.value = false
			ElNotification({
				title: '添加成功',
				type: 'success',
			})
		}
		// 添加成功之后刷新页面数据，即接口列表
		pstore.getInterFaceList()
	}
	// // 点击取消关闭弹窗
	// function cancelClick() {
	//   isShowDrawer.value = false
	// }
	// 保存当前编辑接口的id
	let editInterId = null
	// 点击编辑接口

	function clickEdit(item) {
		// 显示编辑框
		dlgTitle.value = '编辑接口'
		isShowDrawer.value = true
		formData.name = item.name
		formData.url = item.url
		formData.method = item.method
		formData.type = item.type
		// 保存当前编辑接口的id
		editInterId = item.id
	}
	// 编辑完成调用后端修改接口信息的方法
	async function updateInterface() {
		const response = await api.updateInterFaceApi(editInterId, formData)
		if (response.status === 200) {
			// 关闭窗口
			isShowDrawer.value = false
			ElNotification({
				title: '修改成功',
				type: 'success',
			})
		}
		// 编辑成功后刷新页面数据
		pstore.getInterFaceList()
	}
	// 删除方法
	function deleteInterface(id) {
		// 调用后端的接口进行删除
		ElMessageBox.confirm(
				'删除操作不可恢复，是否确认删除该接口?',
				'提示', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
			.then(async () => {
				// 调用后端删除接口
				const response = await api.deleteInterFaceApi(id)
				if (response.status === 204) {
					ElMessage({
						type: 'success',
						message: '已成功删除该接口',
					})
					// 刷新页面数据
					pstore.getInterFaceList()
				}

			})
			.catch(() => {
				ElMessage({
					type: 'info',
					message: '已取消删除操作',
				})
			})
	}
</script>

<style>
</style>