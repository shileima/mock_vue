export function createElement (tag, data = {}, ...children) {
    let key = data.key
    if (key) {
        delete data.key
    }
    return vnode(tag, data, key, children, undefined)
}
export function createTextNode (text) {
    return vnode(undefined, undefined, undefined, undefined, text)
}
function vnode (tag, data, key, children, text) {
    return {
        tag,
        data,
        key,
        children,
        text
    }
}

// 将 template => ast 语法树 => 生成 render 方法 => 生成虚拟 dom => 生成真实 dom
