
export function patch(oldVnode, newVnode) {
    // console.log(oldVnode, vnode)
    // 判断是更新还是渲染
    // console.log(oldVnode, 'oldVnode')
    const isRealElement = oldVnode.nodeType
    if (isRealElement) {
        const oldEle = oldVnode  // id="app"
        const parentEle = oldEle.parentNode
        // 创建一个新的元素来替换原来老元素
        let el = createEle(newVnode)
        parentEle.insertBefore(el, oldEle.nextSibling)
        parentEle.removeChild(oldEle)
        return el
    } else {
        console.log('diff');

        // diff 算法是同层比较，非跨级比较
        // 先比较树根是否一样
        if(oldVnode.tag !== newVnode.tag){
            oldVnode.el.parentNode.replaceChild(createEle(newVnode),oldVnode.el)

        }

        // 标签一致，都是tag或都是text
        if(!oldVnode.tag){
            if(oldVnode.text !== newVnode.text){
                oldVnode.el.textContent = newVnode.text
            }
        }

        // 一定是标签一致，有tag，但是属性可能不一样
        let el = newVnode.el = oldVnode.el
        updateProperties(newVnode, oldVnode.data) // 属性更新完成，树根完成更新～～

        // 比较子节点
        let oldChildren = oldVnode.children || [];
        let newChildren = newVnode.children || [];

        if(oldChildren.length >0 && newChildren.length >0){
            // 核心代码，递归对比子节点，通过对比新旧子节点的变化，更新el元素
            updateChildren(el,oldChildren,newChildren)
        } else if(oldChildren.length > 0) {
            el.innerHTML = ''
        } else if (newChildren.length > 0){
            for(let i=0; i<newChildren.length; i++){
                let child = newChildren[i]
                el.appendChild(createEle(child))
            }
        }
        return el
    }
}
function isSameVnode(oldVnode,newVnode){
    // debugger;
    return (oldVnode.key == newVnode.key) && (oldVnode.tag === newVnode.tag)
}
function  updateChildren(parent,oldChildren,newChildren){
    let oldStartIndex = 0 // 老元素开始索引
    let oldStartVnode = oldChildren[0] // 老元素开始
    let oldEndIndex = oldChildren.length - 1 // 老元素结束索引
    let oldEndVnode = oldChildren[oldEndIndex]  // 老元素结束

    let newStartIndex = 0 // 老元素开始索引
    let newStartVnode = newChildren[0] // 老元素开始
    let newEndIndex = newChildren.length - 1 // 老元素结束索引
    let newEndVnode = newChildren[newEndIndex]  // 老元素结束

    while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex){
        // 情境一、从头部开始比较 (后插入元素) ABCD-->ABCDE
        if(isSameVnode(oldStartVnode,newStartVnode)){
            patch(oldStartVnode, newStartVnode)
            oldStartVnode = oldChildren[++oldStartIndex]
            newStartVnode = newChildren[++newStartIndex]
        }
        // 情境二、从尾部开始比较 （前插入元素）ABCD-->EABCD
        else if (isSameVnode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode)
            oldEndVnode = oldChildren[--oldEndIndex]
            newEndVnode = newChildren[--newEndIndex]
        }
        // 情境三、头尾都不一样 头移尾 倒叙比较 （元素颠倒） ABCD-->DCBA
        else if(isSameVnode(oldStartVnode, newEndVnode)){
            patch(oldStartVnode,newEndVnode)
            parent.insertBefore(oldStartVnode.el,oldEndVnode.el.nextSibling)
            oldStartVnode = oldChildren[++oldStartIndex]
            newEndVnode = newChildren[--newEndIndex]
        }

    }

    if(newStartIndex <= newEndIndex){
        for(let i = newStartIndex; i<= newEndIndex; i++){
            let ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el
            console.log(ele,'ele');

            parent.insertBefore(createEle(newChildren[i]),ele)
        }
    }
}

export function createEle(vnode) { // 根据虚拟节点创建真实节点
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
function updateProperties(vnode, oldProps = {}) {
    let newProps = vnode.data
    let el = vnode.el

    let newStyle = (newProps && newProps.style) || {};
    let oldStyle = (oldProps && oldProps.style) || {};
    console.log(oldStyle, newStyle);

    // 删除之前的样式
    for (let key in oldStyle){
        if(!newStyle[key]){
            el.style[key] = ''
        }
    }

    // 删除之前的属性
    for(let key in oldProps){
        if(!newProps[key]){
            el.removeAttribute(key)
        }
    }

    // 用新值覆盖旧值
    for (let key in newProps) {
        if (key === 'style') {
            for (let stylename in newProps.style) {
                console.log(el,'stylename');

                el.style[stylename.trim()] = newProps.style[stylename]
            }
        } else if (key === 'class') {
            el.className = newProps.class
        } else {
            el.setAttribute(key, newProps[key])
        }
    }
}
