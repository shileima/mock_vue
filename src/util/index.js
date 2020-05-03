
/* 判断对象 */
export function isObject (data) {
    return typeof data === 'object' && data !== null;
}
/* 定义 Object.defineProperty */
export function def (data, key, value) {
    Object.defineProperty(data, key, {
        enumerable: false,
        configurable: false,
        value
    })
}
/* 代理属性存取 */
export function proxy (vm, source, key) {
    console.log(vm, source, key)
    Object.defineProperty(vm, key, {
        get () {
            return vm[source][key]
        },
        set (newVal) {
            vm[source][key] = newVal
        }
    })
}