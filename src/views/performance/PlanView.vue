<template>
  <div class="main_box">
    <!-- 左侧内容 -->
    <div class="card left_box">
      <!-- 工具栏 -->
      <div class="toolbar">
        <el-button type="primary" @click="showCreateDialog">新建计划</el-button>
        <el-button type="danger" :disabled="!selectedPlans.length" @click="batchDelete">批量删除</el-button>
        <el-button :disabled="!selectedPlans.length" @click="batchCopy">批量复制</el-button>
      </div>
      <!-- 计划列表 -->
      <div class="plan_list">
        <el-table :data="planList" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="计划名称" />
          <el-table-column prop="project" label="所属项目" />
          <el-table-column prop="creator" label="创建人" />
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column prop="lastRunTime" label="最后执行时间" />
          <el-table-column prop="status" label="执行状态">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" @click="handleCopy(scope.row)">复制</el-button>
              <el-button size="small" type="primary" @click="showFlowsDrawer(scope.row)">关联业务流</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 新建/编辑计划弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="50%">
      <el-form :model="planForm" :rules="rules" ref="planFormRef" label-width="120px">
        <el-form-item label="计划名称" prop="name">
          <el-input v-model="planForm.name" placeholder="请输入计划名称" />
        </el-form-item>
        <el-form-item label="所属项目" prop="project">
          <el-input v-model="planForm.project" :disabled="true" placeholder="当前项目" />
        </el-form-item>
        <el-form-item label="计划描述">
          <el-input v-model="planForm.description" type="textarea" rows="3" placeholder="请输入计划描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="savePlan">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 复制计划弹窗 -->
    <el-dialog title="复制计划" v-model="copyDialogVisible" width="30%">
      <el-form :model="copyForm" :rules="copyRules" ref="copyFormRef" label-width="100px">
        <el-form-item label="新计划名称" prop="name">
          <el-input v-model="copyForm.name" placeholder="请输入新计划名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="copyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmCopy">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 关联业务流抽屉 -->
    <el-drawer v-model="flowsDrawerVisible" title="关联业务流" size="30%" :destroy-on-close="true">
      <div class="flows-drawer-content" v-if="flowsDrawerVisible">
        <el-select
          v-model="selectedPlan.flows"
          multiple
          filterable
          placeholder="请选择关联业务流"
          style="width: 100%"
        >
          <el-option
            v-for="flow in availableFlows"
            :key="flow.id"
            :value="flow.name"
            :label="flow.name"
          />
        </el-select>
        <div class="drawer-footer">
          <el-button @click="flowsDrawerVisible = false">取消</el-button>
          <el-button type="primary" @click="saveFlows">确定</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ProjectStore } from '@/stores/module/ProStore'
import { UserStore } from '@/stores/module/UserStore'
import { getPlanList, createPlan, updatePlan, deletePlan, copyPlan, getFlowList } from '@/api/performance'
import { request } from '@/utils/request'

// 状态管理
const proStore = ProjectStore()
const uStore = UserStore()

// 用户信息
const userInfo = ref(null)

// 数据列表
const planList = ref([])
const availableFlows = ref([])

// 选中数据
const selectedPlans = ref([])
const selectedPlan = ref({})

// 对话框控制
const dialogVisible = ref(false)
const copyDialogVisible = ref(false)
const flowsDrawerVisible = ref(false)
const dialogTitle = ref('')

// 表单引用
const planFormRef = ref(null)
const copyFormRef = ref(null)

// 表单数据
const planForm = ref({
  name: '',
  project: '',
  description: '',
  flows: []
})

const copyForm = ref({
  name: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入计划名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  project: [
    { required: true, message: '请选择所属项目', trigger: 'change' }
  ]
}

const copyRules = {
  name: [
    { required: true, message: '请输入新计划名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ]
}

// 初始化
onMounted(async () => {
  const hasUserInfo = await initUserInfo()
  if (hasUserInfo) {
    await fetchData()
  }
})

// 初始化用户信息
const initUserInfo = async () => {
  try {
    if (!uStore.token) {
      ElMessage.warning('请先登录')
      return false
    }
    uStore.isAuthenticated = true
    userInfo.value = { username: uStore.username }
    return true
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
    return false
  }
}

// 获取数据
const fetchData = async () => {
  try {
    const [plansResponse, flowsResponse] = await Promise.all([
      getPlanList(),
      getFlowList(proStore.pro.id)
    ])
    
    if (plansResponse.data?.code === 200) {
      planList.value = plansResponse.data.data || []
    } else {
      throw new Error(plansResponse.data?.message || '获取计划列表失败')
    }

    if (flowsResponse.data?.code === 200) {
      availableFlows.value = flowsResponse.data.data || []
    } else {
      throw new Error(flowsResponse.data?.message || '获取业务流列表失败')
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error(error.message || '获取数据失败，请稍后重试')
  }
}

// 显示创建对话框
const showCreateDialog = () => {
  dialogTitle.value = '新建计划'
  planForm.value = {
    name: '',
    project: proStore.pro.name,
    description: '',
    flows: []
  }
  dialogVisible.value = true
}

// 保存计划
const savePlan = async () => {
  try {
    await planFormRef.value.validate()
    const isEdit = planForm.value.id !== undefined
    const requestData = {
      name: planForm.value.name,
      project_id: proStore.pro.id,
      description: planForm.value.description || '',
      creator: userInfo.value.username,
      flows: planForm.value.flows || []
    }
    
    const response = isEdit 
      ? await updatePlan(requestData.id, requestData)
      : await createPlan(requestData)

    if (response.status === 200) {
      ElMessage.success(isEdit ? '修改成功' : '创建成功')
      dialogVisible.value = false
      await getPlanList()
    } else {
      throw new Error(response.data?.message || (isEdit ? '修改失败' : '创建失败'))
    }
  } catch (error) {
    console.error('保存计划失败:', error)
    ElMessage.error(error.message || '保存失败，请检查输入是否正确')
  }
}

// 处理编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑计划'
  planForm.value = {
    id: row.id,
    name: row.name,
    project: proStore.pro.name,
    description: row.description || '',
    flows: row.flows || []
  }
  dialogVisible.value = true
}

// 处理删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该计划吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const response = await deletePlan(row.id)
    if (response.status === 200) {
      ElMessage.success('删除成功')
      await getPlanList()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除
const batchDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除选中的计划吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const deletePromises = selectedPlans.value.map(plan => deletePlan(plan.id))
    const results = await Promise.all(deletePromises)
    const allSuccess = results.every(res => res.status === 200)

    if (allSuccess) {
      ElMessage.success('批量删除成功')
      await getPlanList()
    } else {
      throw new Error('部分计划删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error(error.message || '批量删除失败')
    }
  }
}

// 处理复制
const handleCopy = (row) => {
  copyForm.value.name = `${row.name}_copy`
  selectedPlan.value = { ...row }
  copyDialogVisible.value = true
}

// 确认复制
const confirmCopy = async () => {
  try {
    await copyFormRef.value.validate()
    const newPlan = {
      name: copyForm.value.name,
      project_id: proStore.pro.id,
      description: selectedPlan.value.description,
      creator: userInfo.value.username,
      flows: selectedPlan.value.flows || []
    }
    
    const response = await copyPlan(newPlan)
    if (response.status === 200) {
      ElMessage.success('复制成功')
      copyDialogVisible.value = false
      await getPlanList()
    } else {
      throw new Error(response.data?.message || '复制失败')
    }
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error(error.message || '复制失败')
  }
}

// 批量复制
const batchCopy = async () => {
  try {
    const copyPromises = selectedPlans.value.map(plan => {
      const newPlan = {
        name: `${plan.name}_copy`,
        project_id: proStore.pro.id,
        description: plan.description,
        creator: userInfo.value.username,
        flows: plan.flows || []
      }
      return copyPlan(newPlan)
    })

    const results = await Promise.all(copyPromises)
    const allSuccess = results.every(res => res.status === 200)

    if (allSuccess) {
      ElMessage.success('批量复制成功')
      await getPlanList()
    } else {
      throw new Error('部分计划复制失败')
    }
  } catch (error) {
    console.error('批量复制失败:', error)
    ElMessage.error(error.message || '批量复制失败')
  }
}

// 显示业务流抽屉
const showFlowsDrawer = (row) => {
  selectedPlan.value = { ...row }
  flowsDrawerVisible.value = true
}

// 保存关联业务流
const saveFlows = async () => {
  try {
    const response = await updatePlan(selectedPlan.value.id, {
      flows: selectedPlan.value.flows
    })
    if (response.status === 200) {
      ElMessage.success('关联业务流保存成功')
      flowsDrawerVisible.value = false
      await getPlanList()
    } else {
      throw new Error(response.data?.message || '保存失败')
    }
  } catch (error) {
    console.error('保存关联业务流失败:', error)
    ElMessage.error(error.message || '保存失败')
  }
}

// 处理表格选择变化
const handleSelectionChange = (selection) => {
  selectedPlans.value = selection
}

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    '未执行': 'info',
    '执行中': 'warning',
    '已完成': 'success',
    '执行失败': 'danger'
  }
  return statusMap[status] || 'info'
}

</script>

<style lang="scss" scoped>
.main_box {
  display: flex;
  height: calc(100% - 42px);
  gap: 20px;
  padding: 20px;
}

.left_box {
  flex: 1;
  padding: 20px;

  .toolbar {
    margin-bottom: 20px;
  }

  .plan_list {
    margin-top: 20px;
  }
}

.flows-drawer-content {
  padding: 20px;

  .drawer-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background-color: #fff;
    border-top: 1px solid #dcdfe6;
    text-align: right;
  }
}
</style>