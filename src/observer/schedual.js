let has = {} // 用对象实现去重
let queue = []

function flushSchedualQueue() {
    for (let i = 0; i < queue.length; i++) {
        let watcher = queue[i]
        watcher.run()
    }
    queue = [];
    has = {}
}

export function queueWatcher(watcher) {

    const id = watcher.id
    if (has[id] == null) {
        has[id] = true  // 记录是否注册过这个 watcher
        queue.push(watcher)
        // 异步清空队列, flushSchedualQueue 调用渲染 watcher
        nextTick(flushSchedualQueue);
    }
}

// nextTick
let callbacks = []
let pending = false
function flushCallbacksQueue() {
    callbacks.forEach(fn => fn())
    pending = false
}
export function nextTick(fn) {
    callbacks.push(fn)

    if (!pending) {  // 更新时，没有刷新队列条件下，异步开始刷新队列
        setTimeout(() => {
            flushCallbacksQueue()
        }, 0);
        pending = true  // 正在刷新中...
    }
}
