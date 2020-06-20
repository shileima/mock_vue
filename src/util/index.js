
/* 判断对象 */
export function isObject(data) {
    return typeof data === 'object' && data !== null;
}
/* 定义 Object.defineProperty */
export function def(data, key, value) {
    Object.defineProperty(data, key, {
        enumerable: false,
        configurable: false,
        value
    })
}
/* 代理属性存取 */
export function proxy(vm, source, key) {
    // console.log(vm, source, key)
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newVal) {
            vm[source][key] = newVal
        }
    })
}

let strats = {}; // 定义策略来处理不同的 options ； data created beforeMounted 等
const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed'
]
function mergeHook(parent, child) {
    // console.log(parent, child);

    if (child) {
        if (parent) {
            return parent.concat(child)
        } else {
            return [child]
        }
    } else {
        return parent
    }

}
LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook
})
export function mergeOptions(parent, child) {
    const options = {}
    for (let key in parent) {
        mergeFiled(key)
    }
    for (let key in child) {
        if (!parent.hasOwnProperty(key)) {
            mergeFiled(key)
        }
    }

    function mergeFiled(key) {
        if (strats[key]) {
            options[key] = strats[key](parent[key], child[key])
        } else if (isObject(parent[key]) && isObject(child[key])) {
            options[key] = { ...parent[key], ...child[key] }
        } else {
            options[key] = child[key] || parent[key]
        }

    }
    return options

}
