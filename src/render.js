import { createElement, createTextNode } from './vdom/create-element'
export function renderMixin(Vue) {
    // _c 创建元素的虚拟节点
    // _v 创建文本的虚拟节点
    // _s JSON。stringify

    Vue.prototype._c = function () {
        return createElement(...arguments) // tag、data、children1、children2
    }
    Vue.prototype._v = function (text) {
        return createTextNode(text)
    }
    Vue.prototype._s = function (val) {
        return val === null ? '' : (typeof val === 'object' ? JSON.stringify(val) : ' ' + val + ' ')
    }
    Vue.prototype._render = function () {
        // console.log('_render')
        const vm = this
        const { render } = vm.$options
        // console.log(render)
        let vnode = render.call(vm)
        return vnode
    }
}
