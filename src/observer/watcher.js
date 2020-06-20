import { pushTarget, popTarget } from "./dep";
import { queueWatcher } from "./schedual.js";
let id = 0;
class Watcher {
    constructor(vm, exprOrFn, callback, options) {
        this.vm = vm
        this.exprOrFn = exprOrFn;
        this.callback = callback
        this.options = options
        this.deps = [] // 这个 watcher 会存放所有 dep
        this.depsId = new Set()

        if (typeof exprOrFn) {
            this.getter = exprOrFn
        }
        this.id = id++
        this.get()
    }
    run() {
        this.get()
    }
    get() {
        pushTarget(this)
        this.getter()
        popTarget()
    }
    addDep(dep) {
        let id = dep.id
        if (!this.depsId.has(id)) {
            this.depsId.add(id)
            this.deps.push(dep)
            dep.addSub(this) // 让当前 dep 订阅这个 watcher
        }
        // console.log(this.depsId, 'this.depsId');
    }
    update() {
        // this.get() // 这里 调用 get 还是 getter ？ 每次都更新浪费性能
        queueWatcher(this)
    }
}
export default Watcher
