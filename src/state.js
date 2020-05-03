
import { observe } from './observer/index' // index 不能省略
import { proxy } from './util/index'
export function initState (vm) {
    const opts = vm.$options;
    if (opts.props) {
        initProps(vm)
    }
    if (opts.methods) {
        initMethod(vm)
    }
    if (opts.data) {
        initData(vm)
    }
    if (opts.computed) {
        initComputed(vm)
    }
    if (opts.watch) {
        initWatch(vm)
    }

    function initProps () { }
    function initMethod () { }
    function initData (vm) {
        let data = vm.$options.data
        data = vm._data = typeof data === 'function' ? data.call(vm) : data
        // 用户直接 vm.name 需要代理到 vm._data.name
        for (let key in data) {
            proxy(vm, '_data', key)
        }
        observe(data)
    }
    function initComputed () { }
    function initWatch () { }
}