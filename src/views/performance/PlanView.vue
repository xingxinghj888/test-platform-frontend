<template>
  <div class="main_box">
    <!-- 左侧内容 -->
    <div class="card left_box">
      <!-- 标题 -->
      <div class="title">性能测试计划</div>
      <!-- 计划列表 -->
      <div class="plan_list">
        <el-empty description="暂无数据" v-if="!planList.length" />
        <el-table v-else :data="planList" style="width: 100%">
          <el-table-column prop="name" label="计划名称" />
          <el-table-column prop="status" label="状态" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 右侧内容 -->
    <div class="card right_box">
      <!-- 标题 -->
      <div class="title">计划配置</div>
      <!-- 配置表单 -->
      <el-form :model="planForm" label-width="120px">
        <el-form-item label="计划名称">
          <el-input v-model="planForm.name" />
        </el-form-item>
        <el-form-item label="并发用户数">
          <el-input-number v-model="planForm.users" :min="1" />
        </el-form-item>
        <el-form-item label="持续时间(秒)">
          <el-input-number v-model="planForm.duration" :min="1" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="savePlan">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 计划列表数据
const planList = ref([])

// 计划表单数据
const planForm = ref({
  name: '',
  users: 1,
  duration: 60
})

// 编辑计划
const handleEdit = (row) => {
  planForm.value = { ...row }
}

// 删除计划
const handleDelete = (row) => {
  // TODO: 实现删除逻辑
}

// 保存计划
const savePlan = () => {
  // TODO: 实现保存逻辑
}
</script>

<style lang="scss" scoped>
.main_box {
  display: flex;
  height: calc(100% - 42px);
}

.left_box {
  flex: 1;
  padding: 10px;

  .title {
    font-weight: bold;
    text-align: center;
    height: 40px;
    line-height: 40px;
  }

  .plan_list {
    margin-top: 20px;
  }
}

.right_box {
  flex: 1;
  padding: 20px;

  .title {
    font-weight: bold;
    text-align: center;
    height: 40px;
    line-height: 40px;
  }
}
</style>