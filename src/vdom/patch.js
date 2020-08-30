
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

    let newStartIndex = 0 // 新元素开始索引
    let newStartVnode = newChildren[0] // 新元素开始
    let newEndIndex = newChildren.length - 1 // 新元素结束索引
    let newEndVnode = newChildren[newEndIndex]  // 新元素结束

    // 通过key来记住索引 描述节点的位置 [{ key: 'a' }, { key: 'b'}] --> {'A':1, 'B':2}
    function makeIndexByKey(children){
        let map = {}
        children.forEach((item,index)=>{
            map[item.key] = index
        })
        return map
    }
    let map = makeIndexByKey(oldChildren);
    while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex){
        // 如果旧的节点有null空值旧跳过
        if(!oldStartVnode){
            oldStartVnode = oldChildren[++oldStartIndex]
        }else if (!oldEndVnode){
            oldEndVnode = oldChildren[--oldEndIndex]
        }

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
        // 情景四、尾移头
        else if(isSameVnode(oldEndVnode, newStartVnode)){
            patch(oldEndVnode, newStartVnode)
            parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
            oldEndVnode = oldChildren[--oldEndIndex]
            newStartVnode = newChildren[++newStartIndex]
        }
        // 情景五、乱序排列
        else {
            console.log(map, 'map');
            let moveIndex = map[newStartVnode.key]

            if (moveIndex == undefined) { // 没有null，说明是一个新元素，直接插入到前面
                parent.insertBefore(createEle(newStartVnode),oldStartVnode.el)

            } else {
                let moveVnode = oldChildren[moveIndex]
                oldChildren[moveIndex] = null // 防止移走后数组塌陷，用null占个位
                patch(moveVnode, newStartVnode)
                parent.insertBefore(moveVnode.el, oldStartVnode.el)
            }
            newStartVnode = newChildren[++newStartIndex]
        }
    }

    if(newStartIndex <= newEndIndex){
        for(let i = newStartIndex; i<= newEndIndex; i++){
            let ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el
            console.log(ele,'ele');

            parent.insertBefore(createEle(newChildren[i]),ele)
        }
    }

    // 乱序对比时，如果新虚拟节点对比完成，老的元素多出来的真实节点就全部干掉
    if(oldStartIndex <= oldEndIndex){
        for(let i = oldStartIndex; i<=oldEndIndex; i++){
            let child = oldChildren[i];
            if(child != null){
                parent.removeChild(child.el)
            }
        }
    }
    // 结论：尽量采用唯一的索引标示key，如果用索引，例如倒序，会采用索引来复用，不够准确，
    // 本来根据diff算法移动就可以了 （如果是静态数据，用啥都可以）
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
