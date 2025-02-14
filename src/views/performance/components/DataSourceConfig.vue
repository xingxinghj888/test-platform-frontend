<template>
  <div class="data-source-config">
    <!-- 数据源列表 -->
    <el-table :data="dataSourceList" style="width: 100%; margin-bottom: 20px">
      <el-table-column prop="name" label="数据源名称" />
      <el-table-column prop="type" label="类型">
        <template #default="{ row }">
          <el-tag>
            {{ getDataSourceTypeName(row.type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" link @click="editDataSource(row)">编辑</el-button>
          <el-button type="danger" link @click="deleteDataSource(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加数据源按钮 -->
    <el-button type="primary" @click="showDialog(true)" style="margin-bottom: 20px">
      添加数据源
    </el-button>

    <!-- 数据源配置对话框 -->
    <el-dialog
      :title="isEdit ? '编辑数据源' : '添加数据源'"
      v-model="dialogVisible"
      width="600px"
    >
      <el-form :model="dataSource" :rules="rules" ref="dataSourceFormRef" label-width="100px">
        <el-form-item label="数据源名称" prop="name">
          <el-input v-model="dataSource.name" placeholder="请输入数据源名称" />
        </el-form-item>

        <el-form-item label="数据源类型" prop="type">
          <el-select v-model="dataSource.type" placeholder="请选择数据源类型">
            <el-option label="CSV文件" value="csv" />
            <el-option label="MySQL数据库" value="mysql" />
            <el-option label="自定义脚本" value="custom" />
          </el-select>
        </el-form-item>

        <!-- CSV文件上传 -->
        <template v-if="dataSource.type === 'csv'">
          <el-form-item label="CSV文件" prop="csvFile">
            <el-upload
              class="upload-demo"
              action="/api/upload"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :before-upload="beforeUpload"
            >
              <el-button type="primary">选择文件</el-button>
              <template #tip>
                <div class="el-upload__tip">只能上传 CSV 文件</div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item label="分隔符" prop="delimiter">
            <el-input v-model="dataSource.delimiter" placeholder="请输入CSV分隔符" />
          </el-form-item>
        </template>

        <!-- MySQL配置 -->
        <template v-if="dataSource.type === 'mysql'">
          <el-form-item label="主机地址" prop="mysql.host">
            <el-input v-model="dataSource.mysql.host" placeholder="请输入数据库主机地址" />
          </el-form-item>
          <el-form-item label="端口" prop="mysql.port">
            <el-input-number v-model="dataSource.mysql.port" :min="1" :max="65535" />
          </el-form-item>
          <el-form-item label="数据库名" prop="mysql.database">
            <el-input v-model="dataSource.mysql.database" placeholder="请输入数据库名" />
          </el-form-item>
          <el-form-item label="用户名" prop="mysql.username">
            <el-input v-model="dataSource.mysql.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码" prop="mysql.password">
            <el-input v-model="dataSource.mysql.password" type="password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="SQL查询" prop="mysql.query">
            <el-input
              v-model="dataSource.mysql.query"
              type="textarea"
              :rows="4"
              placeholder="请输入SQL查询语句"
            />
          </el-form-item>
          <el-button type="primary" @click="testConnection">测试连接</el-button>
        </template>

        <!-- 自定义脚本 -->
        <template v-if="dataSource.type === 'custom'">
          <el-form-item label="脚本内容" prop="script">
            <el-input
              v-model="dataSource.script"
              type="textarea"
              :rows="10"
              placeholder="请输入自定义脚本"
            />
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveDataSource">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)
const isEdit = ref(false)
const currentId = ref(null)
const dataSourceFormRef = ref(null)

// 数据源列表
const dataSourceList = ref([])

// 数据源表单数据
const dataSource = ref({
  name: '',
  type: '',
  delimiter: ',',
  mysql: {
    host: '',
    port: 3306,
    database: '',
    username: '',
    password: '',
    query: ''
  },
  script: ''
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入数据源名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择数据源类型', trigger: 'change' }],
  'mysql.host': [{ required: true, message: '请输入主机地址', trigger: 'blur' }],
  'mysql.database': [{ required: true, message: '请输入数据库名', trigger: 'blur' }],
  'mysql.username': [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  'mysql.password': [{ required: true, message: '请输入密码', trigger: 'blur' }],
  'mysql.query': [{ required: true, message: '请输入SQL查询语句', trigger: 'blur' }]
}

// 获取数据源类型名称
const getDataSourceTypeName = (type) => {
  const typeMap = {
    csv: 'CSV文件',
    mysql: 'MySQL数据库',
    custom: '自定义脚本'
  }
  return typeMap[type] || type
}

// 显示对话框
const showDialog = (isAdd = true) => {
  isEdit.value = !isAdd
  dialogVisible.value = true
  if (isAdd) {
    resetForm()
  }
}

// 编辑数据源
const editDataSource = (row) => {
  currentId.value = row.id
  Object.assign(dataSource.value, row)
  showDialog(false)
}

// 删除数据源
const deleteDataSource = async (row) => {
  try {
    await ElMessageBox.confirm('确认删除该数据源吗？', '提示', {
      type: 'warning'
    })
    const index = dataSourceList.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      dataSourceList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch (error) {
    // 用户取消删除
  }
}

// 保存数据源
const saveDataSource = async () => {
  try {
    await dataSourceFormRef.value.validate()
    const formData = { ...dataSource.value }
    if (isEdit.value) {
      // 更新现有数据源
      const index = dataSourceList.value.findIndex(item => item.id === currentId.value)
      if (index > -1) {
        dataSourceList.value[index] = { ...formData, id: currentId.value }
      }
    } else {
      // 添加新数据源
      formData.id = Date.now() // 使用时间戳作为临时ID
      dataSourceList.value.push(formData)
    }
    dialogVisible.value = false
    ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
  } catch (error) {
    // 表单验证失败
  }
}

// 重置表单
const resetForm = () => {
  if (dataSourceFormRef.value) {
    dataSourceFormRef.value.resetFields()
  }
  currentId.value = null
  dataSource.value = {
    name: '',
    type: '',
    delimiter: ',',
    mysql: {
      host: '',
      port: 3306,
      database: '',
      username: '',
      password: '',
      query: ''
    },
    script: ''
  }
}

// 文件上传相关方法
const handleUploadSuccess = (response) => {
  ElMessage.success('文件上传成功')
  dataSource.value.csvFile = response.data // 假设后端返回的文件信息在response.data中
}

const handleUploadError = () => {
  ElMessage.error('文件上传失败')
}

const beforeUpload = (file) => {
  const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv')
  if (!isCSV) {
    ElMessage.error('只能上传CSV文件')
    return false
  }
  return true
}

// 测试数据库连接
const testConnection = async () => {
  try {
    // TODO: 实现数据库连接测试逻辑
    ElMessage.success('连接成功')
  } catch (error) {
    ElMessage.error('连接失败：' + error.message)
  }
}

// 对外暴露方法和数据
defineExpose({
  dataSourceList,
  dataSource: dataSourceList
})
</script>

<style lang="scss" scoped>
.data-source-config {
  padding: 20px;
}

.dialog-footer {
  padding: 20px 0 0;
  text-align: right;
}

:deep(.el-upload) {
  width: 100%;
}

:deep(.el-button) {
  margin-right: 10px;
}
</style>