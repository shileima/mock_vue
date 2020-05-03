import Watcher from './observer/watcher'
import { patch } from './vdom/patch'
export function lifecycleMixin (Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this
        console.log(vnode)
        // 通过虚拟节点渲染出真实dom
        vm.$el = patch(vm.$el, vnode) // 用虚拟节点创建出 真实节点 替换掉 原始真实的$el
    }
}
export function mountComponent (vm, el) {
    const options = vm.$options // 有 render 方法
    vm.$el = el // 真实的 dom
    console.log(options, vm.$el)

    // Watcher 是来渲染页面的
    // _render 是生成虚拟 dom 的
    // _update 是来生成真实 dom 的


    // 渲染页面
    let updateComponent = () => {
        vm._update(vm._render()) // 先调用内部 _render，后 _uodate
    }
    // 渲染 watcher 每个组件都有一个 watcher
    new Watcher(vm, updateComponent, () => { }, true) // true 标示是一个渲染 watcher
}

