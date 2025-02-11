import { createPinia } from 'pinia'
import piniaPluginPer from 'pinia-plugin-persistedstate'
// 创建一个pinia实例
const pinia = createPinia()
// 将持久化的插件注册到pinia中
pinia.use(piniaPluginPer)
export default pinia