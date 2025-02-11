<template>
	<div class="logo">
		<!-- 顶部logo图标 -->
		<img src="@/assets/images/logo3.png" alt="">
	</div>
	<!-- 左侧菜单-->
	 <el-menu :default-active="$route.path" router  :collapse="ustore.isCollapse">
	       
	        <template v-for='item in MenuList' key="item.path">
	          <!-- 如果有子菜单，使用el-sub-menu -->
	          <el-sub-menu v-if="item.children" :index="item.path">
	            <template #title>
	              <img :src="item.iconImg" width="20" style="margin-right: 10px;">
	              <span>{{item.name}}</span>
	            </template>
	            <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
	              <img :src="child.iconImg" width="20" style="margin-right: 10px;">
	              <span>{{child.name}}</span>
	            </el-menu-item>
	          </el-sub-menu>
	          <!-- 如果没有子菜单，使用el-menu-item -->
	          <el-menu-item v-else :index="item.path">
	            <img :src="item.iconImg" width="20" style="margin-right: 10px;">
	            <span>{{item.name}}</span>
	          </el-menu-item>
	        </template>
	      </el-menu>
</template>

<script setup>
	import {UserStore} from '@/stores/module/UserStore'
	const ustore = UserStore()
	
	const MenuList = [
		{
			name: '项目环境',
			path: '/project/testEnv',
			iconImg: require("@/assets/icons/data.png")
		},
		{
			name: '接口管理',
			path: '/project/interFace',
			iconImg: require("@/assets/icons/dropbox.png")
		},
		{
			name: '接口用例',
			path: '/project/interCase',
			iconImg: require("@/assets/icons/icon-api-b.png")
		},

		{
			name: '业务流测试',
			path: '/project/testScent',
			iconImg: require("@/assets/icons/liucheng.png")
		},
		{
			name: '测试计划',
			path: '/project/testTask',
			iconImg: require("@/assets/icons/repair.png")
		},
		
		{
			name: '定时任务',
			path: '/project/crontab',
			iconImg: require("@/assets/icons/hourglass.png")
		},
		{
			name: 'bug管理',
			path: '/project/bugs',
			iconImg: require("@/assets/icons/debug.png")
		},
		{
			name: '数据看板',
			path: '/project/records',
			iconImg: require("@/assets/icons/analysis.png")
		},
		{
			name: '性能测试',
			path: '/project/performance',
			iconImg: require("@/assets/icons/chart-two.png"),
			children: [
				{
					name: '计划管理',
					path: '/project/performance/plan',
					iconImg: require("@/assets/icons/instruction.png")
				},
				{
					name: '报告管理',
					path: '/project/performance/report',
					iconImg: require("@/assets/icons/file-addition.png")
				},
				{
					name: '预设配置',
					path: '/project/performance/preset',
					iconImg: require("@/assets/icons/setting-two.png")
				}
			]
		}
	];
	
</script>

<style lang="scss" scoped>
	.logo{
		margin-top: 10px;
		height: 40px;
		text-align: center;	
		img{
			height: 40px;
		}
	}
	.el-menu{
		border-right: none;
	}
</style>