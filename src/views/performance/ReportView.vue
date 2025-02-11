<template>
  <div class="main_box">
    <!-- 左侧内容 -->
    <div class="card left_box">
      <!-- 标题 -->
      <div class="title">性能测试报告</div>
      <!-- 报告列表 -->
      <div class="report_list">
        <el-empty description="暂无数据" v-if="!reportList.length" />
        <el-table v-else :data="reportList" style="width: 100%">
          <el-table-column prop="name" label="报告名称" />
          <el-table-column prop="create_time" label="创建时间" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="small" @click="viewReport(scope.row)">查看</el-button>
              <el-button size="small" type="danger" @click="deleteReport(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 右侧内容 -->
    <div class="card right_box">
      <!-- 标题 -->
      <div class="title">报告详情</div>
      <!-- 报告内容 -->
      <div v-if="currentReport" class="report_detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="测试计划">{{ currentReport.plan_name }}</el-descriptions-item>
          <el-descriptions-item label="开始时间">{{ currentReport.start_time }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{ currentReport.end_time }}</el-descriptions-item>
          <el-descriptions-item label="并发用户数">{{ currentReport.users }}</el-descriptions-item>
          <el-descriptions-item label="平均响应时间">{{ currentReport.avg_response_time }}ms</el-descriptions-item>
          <el-descriptions-item label="最大响应时间">{{ currentReport.max_response_time }}ms</el-descriptions-item>
          <el-descriptions-item label="错误率">{{ currentReport.error_rate }}%</el-descriptions-item>
        </el-descriptions>
        
        <!-- 性能指标图表 -->
        <div class="charts">
          <div class="chart_item">
            <div class="chart_title">响应时间趋势</div>
            <div class="chart_content" ref="responseTimeChart"></div>
          </div>
          <div class="chart_item">
            <div class="chart_title">并发用户数趋势</div>
            <div class="chart_content" ref="userChart"></div>
          </div>
        </div>
      </div>
      <div v-else class="empty_tip">
        请选择要查看的报告
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 报告列表数据
const reportList = ref([])

// 当前查看的报告
const currentReport = ref(null)

// 查看报告详情
const viewReport = (report) => {
  currentReport.value = report
  // TODO: 加载报告详细数据
}

// 删除报告
const deleteReport = (report) => {
  // TODO: 实现删除逻辑
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

  .report_list {
    margin-top: 20px;
  }
}

.right_box {
  flex: 1.5;
  padding: 20px;

  .title {
    font-weight: bold;
    text-align: center;
    height: 40px;
    line-height: 40px;
  }

  .report_detail {
    margin-top: 20px;

    .charts {
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;

      .chart_item {
        flex: 1;
        min-width: 300px;

        .chart_title {
          text-align: center;
          margin-bottom: 10px;
        }

        .chart_content {
          height: 300px;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
        }
      }
    }
  }

  .empty_tip {
    text-align: center;
    color: #909399;
    margin-top: 100px;
  }
}
</style>