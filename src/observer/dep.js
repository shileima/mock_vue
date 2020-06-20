// dep 和 watcher 是多对多的关系
let id = 0
class Dep {
    constructor() {
        this.id = id++
        this.subs = [] // 把 watcher 存放到 dep 里面
    }
    depend() {
        // 让 dep 记忆 watcher
        // 让 watcher 记忆 dep
        Dep.target.addDep(this)  // 让 watcher 存储 dep
    }
    addSub(watcher) {
        this.subs.push(watcher)
    }
    notify() {
        this.subs.forEach(watcher => {
            watcher.update()
        })
    }
}

Dep.target = null;
const stack = []
export function pushTarget(watcher) {
    Dep.target = watcher
    // stack.push(watcher)  // 针对计算属性
}
export function popTarget() {
    // stack.pop()
    // Dep.target = stack[stack.length - 1]
}


export default Dep
