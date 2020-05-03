export function patch (oldVnode, vnode) {
    console.log(oldVnode, vnode)
    // 判断是更新还是渲染
    const isRealElement = oldVnode.nodeType
    if (isRealElement) {
        const oldEle = oldVnode  // id="app"
        const parentEle = oldEle.parentNode
        // 创建一个新的元素来替换原来老元素
        let el = createEle(vnode)
        parentEle.insertBefore(el, oldEle.nextSibling)
        parentEle.removeChild(oldEle)
    }
}
function createEle (vnode) { // 根据虚拟节点创建真实节点
    let { tag, children, key, data, text } = vnode
    // 是标签创建标签
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag)
        updateProperties(vnode)
        children.forEach(child => { // 递归创建儿节点并放到父节点上
            return vnode.el.appendChild(createEle(child))
        })
    } else { // 是文本
        // 虚拟 dom 映射真实 dom，方便后续更新操作
        vnode.el = document.createTextNode(text)
    }
    // console.log(vnode.el)
    return vnode.el
}
function updateProperties (vnode) {
    let newProps = vnode.data
    let el = vnode.el
    // console.log(el, newProps)
    for (let key in newProps) {
        if (key === 'style') {
            for (let stylename in newProps.style) {
                el.style[stylename] = newProps.style[stylename]
            }
        } else if (key === 'class') {
            el.className = newProps.class
        } else {
            el.setAttribute(key, newProps[key])
        }
    }
}