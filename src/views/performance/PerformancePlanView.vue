<template>
  <div class="performance-plan-view">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>性能测试计划管理</span>
          <el-button type="primary" @click="showAddDialog">新增测试计划</el-button>
        </div>
      </template>
      
      <!-- 测试计划列表 -->
      <el-table :data="planList" style="width: 100%">
        <el-table-column prop="name" label="计划名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="bindScene(scope.row)">绑定业务流</el-button>
            <el-button type="danger" @click="deletePlan(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增测试计划对话框 -->
    <el-dialog v-model="dialogVisible" title="新增测试计划" width="30%">
      <el-form :model="planForm" label-width="120px">
        <el-form-item label="计划名称">
          <el-input v-model="planForm.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="planForm.description" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="savePlan">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 绑定业务流抽屉 -->
    <el-drawer v-model="drawerVisible" title="选择测试业务流" size="50%">
      <el-table :data="sceneList" style="width: 100%">
        <el-table-column prop="name" label="业务流名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="selectScene(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useProStore } from '@/stores/module/ProStore'

export default {
  name: 'PerformancePlanView',
  setup() {
    const pstore = useProStore()
    const planList = ref([])
    const dialogVisible = ref(false)
    const drawerVisible = ref(false)
    const currentPlan = ref(null)
    const planForm = ref({
      name: '',
      description: ''
    })

    // 获取业务流列表
    const getSceneList = async () => {
      await pstore.getSceneList()
    }

    // 显示新增对话框
    const showAddDialog = () => {
      dialogVisible.value = true
      planForm.value = {
        name: '',
        description: ''
      }
    }

    // 保存测试计划
    const savePlan = () => {
      // TODO: 调用后端API保存测试计划
      planList.value.push({
        ...planForm.value,
        id: Date.now() // 临时ID
      })
      dialogVisible.value = false
    }

    // 显示绑定业务流抽屉
    const bindScene = (plan) => {
      currentPlan.value = plan
      drawerVisible.value = true
      getSceneList() // 获取业务流列表
    }

    // 选择业务流
    const selectScene = (scene) => {
      // TODO: 调用后端API保存绑定关系
      drawerVisible.value = false
    }

    // 删除测试计划
    const deletePlan = (plan) => {
      // TODO: 调用后端API删除测试计划
      planList.value = planList.value.filter(item => item.id !== plan.id)
    }

    onMounted(() => {
      // TODO: 获取测试计划列表
    })

    return {
      planList,
      dialogVisible,
      drawerVisible,
      planForm,
      sceneList: pstore.sceneList,
      showAddDialog,
      savePlan,
      bindScene,
      selectScene,
      deletePlan
    }
  }
}
</script>

<style scoped>
.performance-plan-view {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>