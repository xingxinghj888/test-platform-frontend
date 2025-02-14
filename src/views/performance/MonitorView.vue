<template>
  <div class="main_box">
    <!-- 实时状态面板 -->
    <el-card class="status-panel">
      <template #header>
        <div class="card-header">
          <span>实时状态</span>
          <div class="control-buttons">
            <el-button type="primary" @click="startTest" :disabled="isRunning">启动测试</el-button>
            <el-button @click="pauseTest" :disabled="!isRunning">暂停</el-button>
            <el-button type="danger" @click="stopTest" :disabled="!isRunning">停止</el-button>
          </div>
        </div>
      </template>
      <el-row :gutter="20" class="status-info">
        <el-col :span="4">
          <div class="status-item">
            <div class="label">当前并发用户</div>
            <div class="value">{{ currentUsers }}</div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="status-item">
            <div class="label">总请求数</div>
            <div class="value">{{ totalRequests }}</div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="status-item">
            <div class="label">成功请求</div>
            <div class="value success">{{ successRequests }}</div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="status-item">
            <div class="label">失败请求</div>
            <div class="value error">{{ failedRequests }}</div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="status-item">
            <div class="label">平均响应时间</div>
            <div class="value">{{ avgResponseTime }}ms</div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="status-item">
            <div class="label">当前RPS</div>
            <div class="value">{{ currentRps }}</div>
          </div>
        </el-col>
      </el-row>
      <el-progress :percentage="testProgress" :status="testStatus" class="test-progress" />
    </el-card>

    <!-- 实时监控图表 -->
    <el-row :gutter="20" class="charts-container">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">响应时间趋势</div>
          </template>
          <div class="chart" ref="responseTimeChartRef"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">RPS趋势</div>
          </template>
          <div class="chart" ref="rpsChartRef"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">错误率趋势</div>
          </template>
          <div class="chart" ref="errorRateChartRef"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">系统资源使用率</div>
          </template>
          <div class="chart" ref="resourceChartRef"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 请求详情列表 -->
    <el-card class="request-list">
      <template #header>
        <div class="card-header">
          <span>请求详情</span>
          <el-button type="primary" link @click="clearErrors">清空</el-button>
        </div>
      </template>
      <el-table :data="requestList" style="width: 100%" height="300">
        <el-table-column prop="timestamp" label="时间" width="180" />
        <el-table-column prop="name" label="请求名称" />
        <el-table-column prop="url" label="请求URL" show-overflow-tooltip />
        <el-table-column prop="responseTime" label="响应时间(ms)" width="120" />
        <el-table-column prop="status" label="状态码" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="error" label="错误信息" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'

// 测试状态数据
const isRunning = ref(false)
const testProgress = ref(0)
const testStatus = ref('')
const currentUsers = ref(0)
const totalRequests = ref(0)
const successRequests = ref(0)
const failedRequests = ref(0)
const avgResponseTime = ref(0)
const currentRps = ref(0)

// 图表实例
let responseTimeChart = null
let rpsChart = null
let errorRateChart = null
let resourceChart = null

// 图表DOM引用
const responseTimeChartRef = ref(null)
const rpsChartRef = ref(null)
const errorRateChartRef = ref(null)
const resourceChartRef = ref(null)

// 初始化图表
const initCharts = () => {
  const chartConfigs = [
    { ref: responseTimeChartRef, title: '响应时间趋势', instance: 'responseTimeChart' },
    { ref: rpsChartRef, title: 'RPS趋势', instance: 'rpsChart' },
    { ref: errorRateChartRef, title: '错误率趋势', instance: 'errorRateChart' },
    { ref: resourceChartRef, title: '系统资源使用率', instance: 'resourceChart' }
  ]

  chartConfigs.forEach(({ ref: chartRef, title, instance }) => {
    if (chartRef.value) {
      const chart = echarts.init(chartRef.value)
      chart.setOption({
        title: { text: title },
        tooltip: { trigger: 'axis' },
        grid: { top: 40, right: 20, bottom: 30, left: 50 },
        xAxis: {
          type: 'time',
          splitLine: { show: false }
        },
        yAxis: {
          type: 'value',
          splitLine: { lineStyle: { type: 'dashed' } }
        },
        series: [{
          type: 'line',
          smooth: true,
          data: []
        }]
      })
      eval(`${instance} = chart`)
    }
  })
}

// 请求列表数据
const requestList = ref([])

// 测试控制方法
const startTest = async () => {
  try {
    // TODO: 实现测试启动逻辑
    isRunning.value = true
    testStatus.value = 'success'
    ElMessage.success('测试已启动')
  } catch (error) {
    ElMessage.error('启动测试失败')
  }
}

const pauseTest = async () => {
  try {
    // TODO: 实现测试暂停逻辑
    testStatus.value = 'warning'
    ElMessage.success('测试已暂停')
  } catch (error) {
    ElMessage.error('暂停测试失败')
  }
}

const stopTest = async () => {
  try {
    // TODO: 实现测试停止逻辑
    isRunning.value = false
    testStatus.value = 'danger'
    ElMessage.success('测试已停止')
  } catch (error) {
    ElMessage.error('停止测试失败')
  }
}

// 清空错误列表
const clearErrors = () => {
  requestList.value = []
}

// 获取状态类型
const getStatusType = (status) => {
  if (status >= 200 && status < 300) return 'success'
  if (status >= 400 && status < 500) return 'warning'
  if (status >= 500) return 'danger'
  return 'info'
}

// 生命周期钩子
onMounted(() => {
  initCharts()
  window.addEventListener('resize', () => {
    responseTimeChart?.resize()
    rpsChart?.resize()
    errorRateChart?.resize()
    resourceChart?.resize()
  })
})

onUnmounted(() => {
  responseTimeChart?.dispose()
  rpsChart?.dispose()
  errorRateChart?.dispose()
  resourceChart?.dispose()
})
</script>

<style lang="scss" scoped>
.main_box {
  padding: 20px;
  height: calc(100% - 42px);
  overflow-y: auto;

  .status-panel {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .status-info {
      margin: 20px 0;
    }

    .status-item {
      text-align: center;
      padding: 10px;
      background-color: #f5f7fa;
      border-radius: 4px;

      .label {
        color: #909399;
        font-size: 12px;
        margin-bottom: 5px;
      }

      .value {
        font-size: 24px;
        font-weight: bold;
        color: #303133;

        &.success {
          color: #67c23a;
        }

        &.error {
          color: #f56c6c;
        }
      }
    }

    .test-progress {
      margin-top: 20px;
    }
  }

  .charts-container {
    margin-bottom: 20px;

    .chart-card {
      margin-bottom: 20px;

      .card-header {
        font-weight: bold;
      }

      .chart {
        height: 300px;
      }
    }
  }

  .request-list {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>