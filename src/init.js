import { initState } from './state'
import { compileToFunction } from './compiler/index.js';
import { mountComponent } from './lifecycle'
export function initMixin (Vue) {
    Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = options;
        // 初始化状态
        initState(vm)

        // 如果用户配置了 el 就要实现挂载
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function (el) {
        // 渲染顺序 render > template > el
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)
        if (!options.render) {
            let template = options.template
            if (!template && el) {
                template = el.outerHTML
            }
            const render = compileToFunction(template)
            options.render = render
        }
        // console.log(options.render)
        // 挂载组件
        // console.log(options.render.call(vm._data))
        mountComponent(vm, el)

    }
}