<template>
	<div class='pro_page'>
		<div class="pro_box">
			<!-- 顶部内容 -->
			<div class="welcome">
				<span>欢迎使用自动化测试平台</span>
				<el-button icon="CirclePlus" style="float: right;" size="small" @click="showDlg">添加项目</el-button>
			</div>
			<!-- 项目列表 -->
			<div class="pro_list">
				<el-carousel trigger="click" type="card" height="600px">
				    <el-carousel-item v-for="(item,index) in proList" :key="index">
						<!-- 项目卡片 -->
				     <div class="pro_card">
						 <div @click="enterPro(item)">
							 <!-- 图片 -->
							  <img src="@/assets/images/pro01.png" >
							  <!-- 项目名称 -->
							 <div class="pro_name" >
							 	{{item.name}}
							 </div>
						 </div>
						<!-- 按钮 -->
						<div class="btn_box">
							<el-button @click="clickEdit(item)" plain icon="Edit" size="small"></el-button>
							<el-button @click="clickDel(item.id)" plain icon="Delete" size="small" ></el-button>
						</div>
						
					  </div>
					 
				    </el-carousel-item>
				  </el-carousel>
			</div>
			
			
		</div>
	</div>
	<!-- 添加 项目的弹窗-->
	  
	    <el-dialog v-model="isDlgShow" title="添加项目">
	      <el-form :model="formData" label-width="80">
	        <el-form-item label="项目名称" >
	          <el-input v-model="formData.name" autocomplete="off" />
	        </el-form-item>
			<el-form-item label="负责人"  >
			  <el-input v-model="formData.leader" autocomplete="off" />
			</el-form-item>
	      </el-form>
	      <template #footer>
	        <div class="dialog-footer">
	          <el-button @click="isDlgShow = false">取消</el-button>
	          <el-button type="primary" @click="createPro">确认
	          </el-button>
	        </div>
	      </template>
	    </el-dialog>
		
		<!-- 修改 项目的弹窗-->
		  
		    <el-dialog v-model="isUpdateShow" title="编辑项目">
		      <el-form :model="formUpdateData" label-width="80">
		        <el-form-item label="项目名称" >
		          <el-input v-model="formUpdateData.name" autocomplete="off" />
		        </el-form-item>
				<el-form-item label="负责人"  >
				  <el-input v-model="formUpdateData.leader" autocomplete="off" />
				</el-form-item>
		      </el-form>
		      <template #footer>
		        <div class="dialog-footer">
		          <el-button @click="isUpdateShow = false">取消</el-button>
		          <el-button type="primary" @click="updatePro">确认
		          </el-button>
		        </div>
		      </template>
		    </el-dialog>
	
</template>

<script setup>
	import api from '@/api/index'
	import {ref,reactive} from 'vue'
	import { ElNotification,ElMessageBox,ElMessage } from 'element-plus'
	import {useRouter} from 'vue-router'
	import {ProjectStore} from '@/stores/module/ProStore'
	// 创建路由对象
	const router = useRouter()
	//========== 1.获取项目列表==================
	// 1.1定义一个变量来保存项目列表
	let proList = ref([])
	async function getProList(){
		const response = await api.getProListApi()
		if(response.status === 200){
			proList.value = response.data
		}
	}
	getProList()
	
	// 实现项目添加的功能
	let isDlgShow = ref(false)
	let formData = reactive({
		name:"",
		leader:""
	})
	// 显示添加项目窗口
	function showDlg(){
		isDlgShow.value=true
	}
	// 发送请求添加项目
	async function createPro(){
		const response = await api.createProApi(formData)
		if(response.status===201){
			// 弹出成功提示
			ElNotification({
			    title: '项目创建成功',
			    type: 'success',
			  })
			  // 关闭窗口
			isDlgShow.value=false
			// 刷新页面数据
			getProList()
		}
	}
	// ==================2.实现项目修改的功能===================
	let isUpdateShow = ref(false)
	let formUpdateData = ref({
		name:"",
		leader:""
	})
	// 点击编辑按钮时，调用的方法
	function clickEdit(pro){
		isUpdateShow.value=true
		// 注意：要使用解构表达式，不然没点确认按钮卡片中的名字就修改
		formUpdateData.value={...pro}
	}
	// 发送请求修改项目信息
	async function updatePro(){
		let pro_id = formUpdateData.value.id
		const response = await api.editProApi(pro_id,formUpdateData.value)
		if (response.status===200){
			// 弹出成功提示
			ElNotification({
			    title: '项目修改成功',
			    type: 'success',
			  })
			  // 关闭窗口
			  isUpdateShow.value=false
			  // 刷新页面数据
			  getProList()
		}
	}

	
	
	// 3.====================实现项目删除的功能====================
	function clickDel(pro_id){
		// 调用后端的接口进行删除
		 ElMessageBox.confirm(
		    '删除操作不可恢复，是否确认删除?',
		    '提示',
		    {
		      confirmButtonText: '确认',
		      cancelButtonText: '取消',
		      type: 'warning',
		    }
		  )
		    .then(async() => {
				// 调用后端删除接口
				const response = await api.dleteProApi(pro_id)
				if (response.status===204){
					ElMessage({
					  type: 'success',
					  message: '已成功删除该项目',
					})
					// 刷新页面数据
					getProList()
				}
		     
		    })
		    .catch(() => {
		      ElMessage({
		        type: 'info',
		        message: '已取消删除操作',
		      })
		    })
	}
	// ============选中并进入项目==================
	function enterPro(pro){
		const proStore = ProjectStore()
		proStore.pro = pro
		
		// 跳转到home页面

		router.push({
			name:"home"
		})

	}
</script>

<style lang="scss" scoped>
	@import './promanage.scss'
	
</style>