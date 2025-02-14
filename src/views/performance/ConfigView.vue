<template>
  <div class="main_box">
    <el-form :model="configForm" :rules="rules" ref="configFormRef" label-width="120px">
      <!-- 测试模式选择 -->
      <el-card class="config-card">
        <template #header>
          <div class="card-header">
            <img src="@/assets/icons/chart-two.png" width="25" style="margin-right: 10px;">
            <span>测试执行监控</span>
          </div>
        </template>
        <el-form-item prop="mode">
          <el-radio-group v-model="configForm.mode">
            <el-radio label="concurrent">并发用户模式</el-radio>
            <el-radio label="step">阶梯加压模式</el-radio>
            <el-radio label="error">错误率控制模式</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-card>

      <!-- 基础配置 -->
      <el-card class="config-card">
        <template #header>
          <div class="card-header">
            <span>基础配置</span>
          </div>
        </template>
        <el-form-item label="目标主机地址" prop="host">
          <el-input v-model="configForm.host" placeholder="请输入目标主机地址" />
        </el-form-item>
        <el-form-item label="并发用户数" prop="users" v-if="configForm.mode === 'concurrent'">
          <el-input-number v-model="configForm.users" :min="1" />
        </el-form-item>
        <el-form-item label="阶梯配置" v-if="configForm.mode === 'step'">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="初始用户数" prop="stepStart">
                <el-input-number v-model="configForm.stepStart" :min="1" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="步长" prop="stepSize">
                <el-input-number v-model="configForm.stepSize" :min="1" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="阶梯时间(秒)" prop="stepDuration">
                <el-input-number v-model="configForm.stepDuration" :min="1" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="错误率阈值" prop="errorRate" v-if="configForm.mode === 'error'">
          <el-input-number v-model="configForm.errorRate" :min="0" :max="100" :precision="2" />
        </el-form-item>
        <el-form-item label="测试持续时间(秒)" prop="duration">
          <el-input-number v-model="configForm.duration" :min="1" />
        </el-form-item>
        <el-form-item label="每秒请求数限制" prop="rps">
          <el-input-number v-model="configForm.rps" :min="0" />
        </el-form-item>
      </el-card>

      <!-- 数据源配置 -->
      <el-card class="config-card">
        <template #header>
          <div class="card-header">
            <span>数据源配置</span>
          </div>
        </template>
        <DataSourceConfig ref="dataSourceConfigRef" />
      </el-card>

      <!-- 高级配置 -->
      <el-card class="config-card">
        <template #header>
          <div class="card-header">
            <span>高级配置</span>
          </div>
        </template>
        <el-collapse v-model="activeNames">
          <el-collapse-item title="请求超时设置" name="timeout">
            <el-form-item label="连接超时(秒)" prop="connectTimeout">
              <el-input-number v-model="configForm.connectTimeout" :min="1" />
            </el-form-item>
            <el-form-item label="响应超时(秒)" prop="responseTimeout">
              <el-input-number v-model="configForm.responseTimeout" :min="1" />
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="思考时间设置" name="thinkTime">
            <el-form-item label="最小思考时间(秒)" prop="minThinkTime">
              <el-input-number v-model="configForm.minThinkTime" :min="0" />
            </el-form-item>
            <el-form-item label="最大思考时间(秒)" prop="maxThinkTime">
              <el-input-number v-model="configForm.maxThinkTime" :min="0" />
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="重试配置" name="retry">
            <el-form-item label="最大重试次数" prop="maxRetries">
              <el-input-number v-model="configForm.maxRetries" :min="0" />
            </el-form-item>
            <el-form-item label="重试间隔(秒)" prop="retryInterval">
              <el-input-number v-model="configForm.retryInterval" :min="1" />
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <!-- 监控配置 -->
      <el-card class="config-card">
        <template #header>
          <div class="card-header">
            <span>监控配置</span>
          </div>
        </template>
        <el-form-item label="监控指标">
          <el-checkbox-group v-model="configForm.monitors">
            <el-checkbox label="cpu">CPU使用率</el-checkbox>
            <el-checkbox label="memory">内存使用率</el-checkbox>
            <el-checkbox label="network">网络流量</el-checkbox>
            <el-checkbox label="disk">磁盘IO</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-card>

      <!-- 保存按钮 -->
      <div class="form-footer">
        <el-button type="primary" @click="saveConfig">保存配置</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import DataSourceConfig from './components/DataSourceConfig.vue'

// 表单引用
const configFormRef = ref(null)

// 折叠面板激活项
const activeNames = ref(['timeout', 'thinkTime', 'retry'])

// 配置表单数据
const configForm = ref({
  mode: 'concurrent',
  host: '',
  users: 1,
  stepStart: 1,
  stepSize: 1,
  stepDuration: 60,
  errorRate: 1,
  duration: 3600,
  rps: 0,
  connectTimeout: 5,
  responseTimeout: 30,
  minThinkTime: 0,
  maxThinkTime: 0,
  maxRetries: 0,
  retryInterval: 1,
  monitors: []
})

// 表单验证规则
const rules = {
  mode: [{ required: true, message: '请选择测试模式', trigger: 'change' }],
  host: [{ required: true, message: '请输入目标主机地址', trigger: 'blur' }],
  users: [{ required: true, message: '请设置并发用户数', trigger: 'blur' }],
  stepStart: [{ required: true, message: '请设置初始用户数', trigger: 'blur' }],
  stepSize: [{ required: true, message: '请设置步长', trigger: 'blur' }],
  stepDuration: [{ required: true, message: '请设置阶梯时间', trigger: 'blur' }],
  errorRate: [{ required: true, message: '请设置错误率阈值', trigger: 'blur' }],
  duration: [{ required: true, message: '请设置测试持续时间', trigger: 'blur' }]
}

// 数据源配置引用
const dataSourceConfigRef = ref(null)

// 保存配置
const saveConfig = async () => {
  try {
    await configFormRef.value.validate()
    // 获取数据源配置
    const dataSourceConfig = dataSourceConfigRef.value.dataSource
    // 合并配置数据
    const finalConfig = {
      ...configForm.value,
      dataSource: dataSourceConfig
    }
    // TODO: 实现保存逻辑
    console.log('保存的配置数据：', finalConfig)
    ElMessage.success('保存成功')
  } catch (error) {
    // 表单验证失败
  }
}

// 重置表单
const resetForm = () => {
  configFormRef.value.resetFields()
}
</script>

<style lang="scss" scoped>
.main_box {
  padding: 20px;
  height: calc(100% - 42px);
  overflow-y: auto;
}

.config-card {
  margin-bottom: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.form-footer {
  margin-top: 20px;
  text-align: center;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-card__header) {
  padding: 15px 20px;
  font-weight: bold;
  background-color: #f5f7fa;
}

:deep(.el-collapse-item__header) {
  font-weight: 500;
}

:deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}
</style>