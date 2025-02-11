<template>
	<!-- 定义一个大盒子，在分为左右两个小盒子 -->
	<div class="main_box">
		<!-- 左侧内容 -->
		<div class="card left_box">
			<!-- 标题 -->
			<div class="title">接口调试</div>
			<!-- 接口调试组件 -->
			<InterfaceDebug></InterfaceDebug>
		</div>
		<!-- 右侧内容 -->
		<div class="card right_box">
			<!-- 标题 -->
			<div class="title">项目接口管理</div>

			<!-- 先搞一个选项卡 -->
			<el-tabs type="border-card" class="demo-tabs">

				<el-tab-pane label="项目接口">
					<InterFaceList :interfaces='pstore.interfaces1'></InterFaceList>
				</el-tab-pane>
				<el-tab-pane label="第三方接口">
					<InterFaceList :interfaces='pstore.interfaces2'></InterFaceList>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script setup>
	import InterfaceDebug from './components/InterfaceDebug.vue'
	import {
		ProjectStore
	} from '@/stores/module/ProStore'
	import InterFaceList from './components/InterFaceList.vue'

	const pstore = ProjectStore()
</script>

<style lang="scss" scoped>
	.main_box {
		// 左右布局使用flex浮动
		display: flex;
		height: calc(100% - 42px);
	}

	.left_box {
		flex: 1.1;
		padding: 5px;

		.title {
			font-weight: bold;
			text-align: center;
			height: 40px;
			line-height: 40px;

		}
	}

	.right_box {
		flex: 1;

		.title {
			font-weight: bold;
			text-align: center;
			height: 40px;
			line-height: 40px;

		}

	}
</style>