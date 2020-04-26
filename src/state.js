
import { observe } from './observer/index' // index 不能省略
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
        observe(data)
    }
    function initComputed () { }
    function initWatch () { }
}