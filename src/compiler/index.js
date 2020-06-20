import { parseHTML } from './parser-html.js'

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function genProps(attrs) {
    // console.log(attrs)
    let str = ''
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i]
        // style="color: red;font-size: 14px;"
        if (attr.name === 'style') {
            let obj = {}
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(':')
                obj[key] = value
            })
            attr.value = obj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}`
}
function genChildren(el) {
    const children = el.children
    if (children && children.length > 0) {
        return `${children.map(c => gen(c)).join(',')}`
    } else {
        return false
    }
}
function gen(node) {
    if (node.type == 1) {
        return generate(node)
    } else {
        let text = node.text
        let tokens = []
        let match, index;
        let lastIndex = defaultTagRE.lastIndex = 0
        while (match = defaultTagRE.exec(text)) {
            index = match.index
            if (index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, index)))
            }
            tokens.push(`_s(${match[1].trim()})`)
            lastIndex = index + match[0].length
        }
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }
        return `_v(${tokens.join('+')})`
    }
}
function generate(el) {
    const children = genChildren(el)
    let code = `_c("${el.tag}", ${
        el.attrs.length ? genProps(el.attrs) : 'undefined'
        }${
        children ? `,${children}` : ''
        })
    `
    return code
}
export function compileToFunction(template) {
    // 解析 html字符串，将 html字符串 => ast 语法书
    let root = parseHTML(template)
    // console.log(root, 'root')
    // 将 ast 语法树再次转换成 js 语法
    // _c("div",{id:"app"},_c("p",undefined,_v("hello", + _s(name))),_v("hello"))
    let code = generate(root)
    // console.log(code)
    let renderFn = new Function(`with(this){ return ${code}}`)
    // console.log(renderFn)
    return renderFn
}
