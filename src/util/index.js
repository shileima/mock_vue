
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