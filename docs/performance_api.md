# 性能测试模块接口文档

## 1. 测试计划管理

### 1.1 获取测试计划列表
- 请求方法：GET
- 请求路径：/api/performance/plans/
- 响应格式：
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "string",
      "name": "string",
      "project": "string",
      "description": "string",
      "creator": "string",
      "createTime": "string",
      "lastRunTime": "string",
      "status": "string",
      "flows": ["string"]
    }
  ]
}
```

### 1.2 创建测试计划
- 请求方法：POST
- 请求路径：/api/performance/plans/
- 请求参数：
```json
{
  "name": "string",
  "project_id": "string",
  "description": "string",
  "creator": "string",
  "flows": ["string"]
}
```
- 响应格式：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "string"
  }
}
```

### 1.3 更新测试计划
- 请求方法：PUT
- 请求路径：/api/performance/plans/{id}/
- 请求参数：
```json
{
  "name": "string",
  "description": "string",
  "flows": ["string"]
}
```
- 响应格式：
```json
{
  "code": 200,
  "message": "success"
}
```

### 1.4 删除测试计划
- 请求方法：DELETE
- 请求路径：/api/performance/plans/{id}/
- 响应格式：
```json
{
  "code": 200,
  "message": "success"
}
```

### 1.5 复制测试计划
- 请求方法：POST
- 请求路径：/api/performance/plans/copy/
- 请求参数：
```json
{
  "name": "string",
  "project_id": "string",
  "description": "string",
  "creator": "string",
  "flows": ["string"]
}
```
- 响应格式：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "string"
  }
}
```

## 2. 业务流管理

### 2.1 获取业务流列表
- 请求方法：GET
- 请求路径：/api/performance/flows/
- 请求参数：
  - project_id: string (查询参数)
- 响应格式：
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "string",
      "name": "string"
    }
  ]
}
```