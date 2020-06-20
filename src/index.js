import { initMixin } from './init'
import { renderMixin } from './render'
import { lifecycleMixin } from './lifecycle'
import { initGlobalApi } from "./global-api/index.js";

function Vue(options) {
    this._init(options)
}

// 给原型扩展方法
initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)

// 给构造函数扩展全局方法
initGlobalApi(Vue)

export default Vue
