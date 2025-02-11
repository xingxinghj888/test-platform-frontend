import PlanView from '@/views/performance/PlanView.vue'
import ReportView from '@/views/performance/ReportView.vue'
import PresetView from '@/views/performance/PresetView.vue'

export default [
  {
    path: '/performance/plan',
    name: 'PerformancePlan',
    component: PlanView,
    meta: {
      title: '性能测试计划'
    }
  },
  {
    path: '/performance/report',
    name: 'PerformanceReport',
    component: ReportView,
    meta: {
      title: '性能测试报告'
    }
  },
  {
    path: '/performance/preset',
    name: 'PerformancePreset',
    component: PresetView,
    meta: {
      title: '预设配置'
    }
  }
]