let has = {} // 用对象实现去重
let queue = []
let pending = false

function flushSchedualQueue() {
    for (let i = 0; i < queue.length; i++) {
        let watcher = queue[i]
        watcher.run()
    }
}

export function queueWatcher(watcher) {

    const id = watcher.id
    if (has[id] == null) {
        has[id] = true  // 记录是否注册过这个 watcher
        queue.push(watcher)

        if (!pending) {  // 更新时，没有刷新队列条件下，异步开始刷新队列

            setTimeout(flushSchedualQueue, 0);
            pending = true  // 正在刷新中...
        }
    }
}
