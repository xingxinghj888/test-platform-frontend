import PlanView from '@/views/performance/PlanView.vue'
import ConfigView from '@/views/performance/ConfigView.vue'
import MonitorView from '@/views/performance/MonitorView.vue'
import ReportView from '@/views/performance/ReportView.vue'

export default [
  {
    path: '/project/performance/plan',
    name: 'PerformancePlan',
    component: PlanView,
    meta: {
      title: '测试计划管理'
    }
  },
  {
    path: '/project/performance/config',
    name: 'PerformanceConfig',
    component: ConfigView,
    meta: {
      title: '测试配置管理'
    }
  },
  {
    path: '/project/performance/monitor',
    name: 'PerformanceMonitor',
    component: MonitorView,
    meta: {
      title: '测试执行监控'
    }
  },
  {
    path: '/performance/report',
    name: 'PerformanceReport',
    component: ReportView,
    meta: {
      title: '测试报告分析'
    }
  }
]