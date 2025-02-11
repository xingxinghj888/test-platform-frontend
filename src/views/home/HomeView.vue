<template>
	<el-container>
		<!-- 左侧侧边栏 -->
		<el-aside :style="{width:ustore.isCollapse? '65px':'200px'}">
			<LeftMenu></LeftMenu>
		</el-aside>
		<el-container>
			<!-- 页面头部内容 -->
			<el-header>
				<Header></Header>
			</el-header>
			<!-- 页面主体内容 -->
			<el-main>
				<!-- 标签栏 -->
				<Tabs></Tabs>
				<!-- 主题内容区域 -->
				<router-view></router-view>
			</el-main>
			<!-- 页面底部内容 -->
			<el-footer>
				<Footer></Footer>
			</el-footer>
		</el-container>
	</el-container>

</template>

<script setup>
	import LeftMenu from "./components/LeftMenu.vue"
	import Footer from './components/Footer.vue'
	import Header from './components/Header.vue'
	import Tabs from "./components/Tabs.vue"

	import {
		UserStore
	} from '@/stores/module/UserStore'
	import {
		ProjectStore
	} from '@/stores/module/ProStore'
	const ustore = UserStore()
	const pstore = ProjectStore()
	// 调用获取项目所有的接口的方法
	pstore.getInterFaceList()
	// 获取项目下的所有业务流
	pstore.getSceneList()
</script>


<style scoped lang="scss">
	.el-container {
		height: 100%;

		.el-aside {
			border-right: solid 1px #6a6a6a;
		}

		.el-header {
			border-bottom: solid 1px #6a6a6a;
			padding: 0;
			height: 55px;
		}

		.el-footer {
			border-top: solid 1px #6a6a6a;
			height: 29px;
		}

		// 设置中间主要内容的高度为屏幕可见高度的100% 减去 上下内容的总高度，确保他们加起来的内容高度 不超过屏幕可见的100%就不会自动生成那个滚动条
		.el-main {
			padding: 0;
			height: calc(100vh - 90px);
		}
	}
</style>