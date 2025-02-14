import request from '../utils/request'

// 获取业务流列表
export function getFlowList(projectId) {
  return request({
    url: `/api/performance/flows/${projectId}/`,
    method: 'get'
  })
}

// 创建性能测试计划
export function createPlan(data) {
  return request({
    url: '/api/performance/plans/',
    method: 'post',
    data
  })
}

// 更新性能测试计划
export function updatePlan(id, data) {
  return request({
    url: `/api/performance/plans/${id}/`,
    method: 'put',
    data
  })
}

// 删除性能测试计划
export function deletePlan(id) {
  return request({
    url: `/api/performance/plans/${id}/`,
    method: 'delete'
  })
}

// 批量删除性能测试计划
export function batchDeletePlans(ids) {
  return request({
    url: '/api/performance/plans/batch/',
    method: 'delete',
    data: { ids }
  })
}

// 复制性能测试计划
export function copyPlan(data) {
  return request({
    url: '/api/performance/plans/copy/',
    method: 'post',
    data
  })
}

// 获取性能测试计划列表
export function getPlanList() {
  return request({
    url: '/api/performance/plans/',
    method: 'get'
  })
}