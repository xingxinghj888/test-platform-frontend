<template>
  <div class="main_box">
    <!-- 左侧内容 -->
    <div class="card left_box">
      <!-- 标题 -->
      <div class="title">预设配置列表</div>
      <!-- 配置列表 -->
      <el-table :data="configList" style="width: 100%">
        <el-table-column prop="name" label="配置名称" />
        <el-table-column prop="type" label="配置类型" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 右侧内容 -->
    <div class="card right_box">
      <!-- 标题 -->
      <div class="title">配置详情</div>
      <!-- 配置表单 -->
      <el-form :model="configForm" label-width="120px">
        <el-form-item label="配置名称">
          <el-input v-model="configForm.name" />
        </el-form-item>
        <el-form-item label="配置类型">
          <el-select v-model="configForm.type" placeholder="请选择配置类型">
            <el-option label="请求头" value="header" />
            <el-option label="请求参数" value="parameter" />
            <el-option label="响应断言" value="assertion" />
          </el-select>
        </el-form-item>
        <el-form-item label="配置描述">
          <el-input v-model="configForm.description" type="textarea" />
        </el-form-item>
        <el-form-item label="配置内容">
          <el-input v-model="configForm.content" type="textarea" rows="10" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveConfig">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 配置列表数据
const configList = ref([])

// 配置表单数据
const configForm = ref({
  name: '',
  type: '',
  description: '',
  content: ''
})

// 编辑配置
const handleEdit = (row) => {
  configForm.value = { ...row }
}

// 删除配置
const handleDelete = (row) => {
  // TODO: 实现删除逻辑
}

// 保存配置
const saveConfig = () => {
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