import Watcher from './observer/watcher'
import { patch } from './vdom/patch'
export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this
        // console.log(vnode)
        // 通过虚拟节点渲染出真实dom
        vm.$el = patch(vm.$el, vnode) // 用虚拟节点创建出 真实节点 替换掉 原始真实的$el
    }
}
export function mountComponent(vm, el) {
    // const options = vm.$options // 有 render 方法
    // vm.$el = el // 真实的 dom

    // Watcher 是来渲染页面的
    // _render 是生成虚拟 dom 的
    // _update 是来生成真实 dom 的

    // 调用 beforeMount hook
    callHooks(vm, 'beforeMount')
    // 渲染页面
    let updateComponent = () => {
        console.log('update');
        // 内部先调用内部 _render --> vnode
        // update 将 vnode --> 真实 dom
        vm._update(vm._render())
    }
    // 渲染 watcher 每个组件都有一个 watcher
    new Watcher(vm, updateComponent, () => { }, true) // true 标示是一个渲染 watcher

    // 调用 mounted hook
    callHooks(vm, 'mounted')
}

export function callHooks(vm, hook) {
    let handlers = vm.$options[hook];
    if (handlers) {
        for (let i = 0; i < handlers.length; i++) {
            handlers[i].call(vm)
        }
    }
}
