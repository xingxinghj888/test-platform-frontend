<template>
	<div class="tabs_box">
		<el-tabs v-model='activeTab' @tab-click="clickTab" @tab-remove='clickDel' type="card">
			<el-tab-pane v-for='i in ustore.tabs' :key="i.path" :label="i.name" :name="i.path" closable></el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup>
	import {
		UserStore
	} from '@/stores/module/UserStore'
	import {
		useRouter,
		useRoute
	} from 'vue-router'
	import { ref, watch } from 'vue'

	const ustore = UserStore()
	const router = useRouter()
	const route = useRoute()

	// 当前激活的tab
	const activeTab = ref(route.path)

	// 监听路由变化
	watch(() => route.path, (newPath) => {
		activeTab.value = newPath
	})

	// 点击选项卡
	function clickTab(tab) {
		router.push(tab.props.name)
	}
	// 点击删除的方法
	function clickDel(path) {
		// 删除标签前获取当前标签索引
		const currentIndex = ustore.tabs.findIndex(tab => tab.path === path)
		// 如果是当前激活的标签，先确定要跳转的目标
		if (path === activeTab.value) {
			// 如果还有其他标签
			if (ustore.tabs.length > 1) {
				// 如果删除的是最后一个标签，跳转到前一个标签
				if (currentIndex === ustore.tabs.length - 1) {
					router.push(ustore.tabs[currentIndex - 1].path)
				} else {
					// 否则跳转到下一个标签
					router.push(ustore.tabs[currentIndex + 1].path)
				}
			} else {
				// 如果是最后一个标签，跳转到首页或其他默认页面
				router.push('/')
			}
		}
		// 删除标签
		ustore.deleteTabs(path)
	}
</script>

<style scoped lang="scss">
	.tabs_box {
		height: 40px;
		border-bottom: solid 1px #6a6a6a;
	}
</style>