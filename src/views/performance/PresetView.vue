<template>
  <div class="card">
    <!-- 标题 -->
    <div class="title">预设配置</div>
    <!-- 预设配置列表 -->
    <div class="preset_list">
      <el-empty description="暂无数据" v-if="!presetList.length" />
      <el-table v-else :data="presetList" style="width: 100%">
        <el-table-column prop="name" label="配置名称" />
        <el-table-column prop="type" label="配置类型" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 配置表单 -->
    <div class="config_form">
      <div class="title">配置详情</div>
      <el-form :model="presetForm" label-width="120px">
        <el-form-item label="配置名称">
          <el-input v-model="presetForm.name" />
        </el-form-item>
        <el-form-item label="配置类型">
          <el-select v-model="presetForm.type">
            <el-option label="请求头" value="header" />
            <el-option label="请求参数" value="params" />
            <el-option label="响应断言" value="assert" />
          </el-select>
        </el-form-item>
        <el-form-item label="配置内容">
          <el-input v-model="presetForm.content" type="textarea" rows="4" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="savePreset">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 预设配置列表数据
const presetList = ref([])

// 预设配置表单数据
const presetForm = ref({
  name: '',
  type: '',
  content: ''
})

// 编辑配置
const handleEdit = (row) => {
  presetForm.value = { ...row }
}

// 删除配置
const handleDelete = (row) => {
  // TODO: 实现删除逻辑
}

// 保存配置
const savePreset = () => {
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

  .preset_list {
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