<template>
	<div class="head_box">
		<!-- 1.头部左侧 -->
		<div class="left_box">
			<!--1.1 图标 -->
			<el-icon size="28" @click="switchCollapse">
				<Expand v-if="ustore.isCollapse" />
				<Fold v-else />
			</el-icon>
			<!-- 1.2显示时间 -->
			<div class="time_info">
				{{nTime}}
			</div>
			<!-- 1.3选择框 -->
			<el-select v-model="env" placeholder="请选择测试环境">
				<el-option v-for='item in envList ' :key="item.id" :label="item.name" :value="item.id" />
			</el-select>
		</div>


		<!--  头部中间内容 -->
		<div class="center_box">自动化测试平台</div>

		<!-- 头部右侧内容 -->
		<div class="right_box">
			<el-icon size="25" @click="screenfull.toggle()">
				<Rank />
			</el-icon>
			<!-- 头像展示区域 -->

			<el-dropdown>
				<span class="el-dropdown-link">
					<img src="@/assets/images/avatar02.png" />
				</span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item @click="selectPro">选择项目</el-dropdown-item>
						<el-dropdown-item @click="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>
</template>

<script setup>
	import {
		ElNotification
	} from 'element-plus'
	import {
		useRouter
	} from 'vue-router'
	import {
		ref
	} from 'vue';
	import {
		UserStore
	} from '@/stores/module/UserStore.js'
	const ustore = UserStore()
	// ====================修改菜单折叠缩放的值===========================
	function switchCollapse() {
		ustore.isCollapse = !ustore.isCollapse
	}


	// ==============顶部实时时间的显示=============
	let nTime = ref()

	function getNowTime() {
		let nowTime = new Date()
		let y = nowTime.getFullYear()
		let m = nowTime.getMonth() + 1
		let d = nowTime.getDate()
		let H = nowTime.getHours()
		let M = nowTime.getMinutes()
		let S = nowTime.getSeconds()
		if (H < 10) {
			H = '0' + H
		}
		if (S < 10) {
			S = '0' + S
		}
		if (M < 10) {
			M = '0' + M
		}
		return `${y}年${m}月${d}日${H}:${M}:${S}`
	}
	setInterval(() => {
		nTime.value = getNowTime()
	}, 1000)

	// =================测试环境的管理后面再写=====================
	import {
		ProjectStore
	} from '@/stores/module/ProStore'
	// 我们要用pinia中的数据进行双向绑定，得先把pinia的store对象转换成响应式对象，不然pinia中数据发生变化，这里不会变
	import {
		storeToRefs
	} from 'pinia';
	const pstore = ProjectStore()
	const pstoreRef = storeToRefs(pstore)
	const envList = pstoreRef.envList
	let env = pstoreRef.env



	// ==================================选择项目和退出登录=======================
	const router = useRouter()

	function selectPro() {
		//重置Pinia中持久化存储的项目数据
		pstore.reset();
		// 切换到项目管理页面
		router.push({
			name: "pro_manage"
		});
	}

	function logout() {
		// 跳转到登录页面，清空登录用户的信息和pinia中的缓存数据
		router.push({
			name: "login"
		})
		// 给出提示
		ElNotification({
			title: '已为您注销登录',
			type: 'success',
		})
		// 清除token
		ustore.token = ''
		// 修改登录的状态
		ustore.isAuthenticated = false
	}
	// =================================页面全屏展示====================
	import screenfull from 'screenfull';
</script>

<style scoped lang="scss">
	.head_box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: url('@/assets/images/header-line.png');
		background-repeat: no-repeat;
		background-size: cover;
		height: 55px;

		// 左侧内容的样式
		.left_box {
			flex: 1;
			display: flex;
			align-items: center;
			height: 55px;

			.time_info {
				color: #00aaff;
				font-weight: bold;
				margin-right: 10px;
			}

			.el-icon {
				margin: 0 10px;
			}

			.el-select {
				width: 150px; // 设置选择框的宽度
			}

		}

		// 中间部分样式
		.center_box {
			background: url('@/assets/images/header-center-bg.png');
			background-repeat: no-repeat;
			background-size: cover;
			height: 50px;
			width: 550px;
			line-height: 50px;
			text-align: center;
			font-weight: bold;
			font-size: 22px;
			color: #00aaff;

		}


		// 右侧样式
		.right_box {
			display: flex;
			align-items: center;
			justify-content: right;
			padding-right: 20px;
			flex: 1;

			img {
				padding-left: 10px;
				width: 40px;
				height: 40px;
			}
		}
	}
</style>