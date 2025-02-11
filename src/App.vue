<template>
	<el-watermark :font="font" :content="userName" :z-index="1">
		<el-config-provider :z-index="2000">
			<router-view />
			<el-loading v-model:visible="loading" :lock="true" text="加载中..." />
		</el-config-provider>
	</el-watermark>
</template>

<script setup>
	import api from '@/api/index'
	import { UserStore } from './stores/module/UserStore';
	import { ref, reactive } from 'vue'
	import { ElLoading } from 'element-plus'
	import { useRouter } from 'vue-router'
	
	const router = useRouter()
	const font = reactive({
		color: 'rgba(180, 180, 180, 0.15)',
		fontSize: 16,
		fontWeight: 'normal'
	})
	const loading = ref(false)
	const uStore = UserStore()
	const userName = uStore.$state.username
	
	// 全局路由守卫，处理加载状态
	router.beforeEach((to, from, next) => {
		if (to.path !== from.path) {
			loading.value = true
		}
		next()
	})
	
	router.afterEach(() => {
		loading.value = false
	})
	
	setInterval(async () => {
		// 校验用户的token 是否有效
		const uStore = UserStore()
		const response = await api.verifyTokenApi({
			'token': uStore.token
		})
		if (response.status === 200) {
			uStore.isAuthenticated = true
		} else {
			uStore.isAuthenticated = false
		}
	}, 1000 * 60 * 30)
</script>

<style lang="scss">
// 定义全局主题颜色变量
:root {
  --primary-color: #00aaff;
  --success-color: #67C23A;
  --warning-color: #E6A23C;
  --danger-color: #F56C6C;
  --info-color: #909399;
  --text-color: #303133;
  --border-color: #DCDFE6;
  --background-color: #F5F7FA;
}

// 全局基础样式
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
  background-color: var(--background-color);
}

// 全局加载样式优化
.el-loading-mask {
	background-color: rgba(255, 255, 255, 0.8);
	.el-loading-spinner {
		.el-loading-text {
			color: var(--primary-color);
			font-size: 16px;
			margin-top: 8px;
		}
	}
}

// 全局按钮样式优化
.el-button {
  &--primary {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    &:hover, &:focus {
      opacity: 0.8;
      transition: opacity 0.3s ease;
    }
  }
}

// 全局表单样式优化
.el-form {
  .el-form-item {
    margin-bottom: 20px;
    .el-form-item__label {
      font-weight: 500;
    }
  }
}

// 全局卡片样式优化
.el-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  .el-card__header {
    padding: 15px 20px;
    border-bottom: 1px solid var(--border-color);
    font-weight: 500;
  }
}
</style>