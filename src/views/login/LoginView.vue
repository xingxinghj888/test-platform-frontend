<template>
	<div class='login_page'>

		<div class="login_box">
			<!-- 左侧内容 -->
			<div class="left_box">
				<!-- 显示图片 -->
				<img src="@/assets/images/login_left4.png" class='img_box'>
			</div>
			<!-- 右侧登录表单 -->
			<div class="login_right_box">
				<div class="header">
					<div class="logo">
						<img src="@/assets/images/logo3.png">
					</div>
					<div class="title">自动化测试平台</div>
				</div>
				<div class="login_form">
					<el-form :model="loginForm" :rules="loginRules" ref="loginFormRef">
						<el-form-item prop="username">
							<el-input prefix-icon="Avatar" v-model="loginForm.username" placeholder="请输入账号"/>
						</el-form-item>
						<el-form-item prop="password">
							<el-input prefix-icon="Lock" type="password" v-model="loginForm.password"
								placeholder="请输入密码" />
						</el-form-item>
						<el-form-item>
							<el-button @click='resetFrom(loginFormRef)' icon="CircleClose" round
								style="width: 185px;">重置</el-button>
							<el-button @click='loginSubmit(loginFormRef)' type="primary" icon="Avatar" round
								style="width: 185px;">登录</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
	</div>



</template>

<script setup>
	import { ref, reactive } from 'vue'
	import api from '@/api/index'
	import {ElNotification } from 'element-plus'
	import {useRouter} from 'vue-router'
	import {UserStore} from '@/stores/module/UserStore'
	// 登录的表单数据
	const loginForm = reactive({
		username: "",
		password: ""
	})
	// 创建路由对象
	const router = useRouter()
	
	// 实例化用户的store对象
	const  ustore = UserStore()
	
	
	
	// 提交登录的方法
	 function loginSubmit(elForm){
		// 进行表单预校验
		elForm.validate(async function(res){
			if (!res) return
			// 校验通过
			const response=await api.loginApi(loginForm)
			if (response.status === 200){
				// 给出提示
				ElNotification({
					title: '登录成功',
					message: '欢迎登录自动化测试平台',
					type: 'success',
				  })
				  // 保存用户的token使用pinia来保存
				  const token = response.data.token
				  ustore.saveToken(token)
				  ustore.isAuthenticated = true
				  ustore.saveUserName(loginForm.username)
				  // 跳转到项目管理页面（路由跳转先把路由导入）
				  router.push({name:"pro_manage"})
			}else{
				ElNotification({
					title: '登录失败',
					message: response.data,
					type: 'error',
				  })
			}
			
			
		})
	}
		
	
	//校验账号密码
	const loginRules = reactive({
		username:[{ required: true, message: '账号不能为空', trigger: 'blur' }],
		password:[{ required: true, message: '密码不能为空', trigger: 'blur' }]
	})
	// 表单引用对象
	const loginFormRef = ref()
	// 重置表单的方法
	function resetFrom(elForm){
		if(!elForm) return
		elForm.resetFields()
	}
	
	
</script>

<style lang='scss' scoped>
	@import './login.scss'
</style>