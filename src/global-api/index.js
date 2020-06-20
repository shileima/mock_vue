import { mergeOptions } from '../util/index.js'

export function initGlobalApi(Vue) {
    Vue.options = {}; // 全局api绑定到这个对象中

    Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin)
        console.log(this.options)

    }
}
