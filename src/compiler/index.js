import { parseHTML } from './parser-html.js'

export function compileToFunction (template) {
    // 解析 html字符串，将 html字符串 => ast 语法书
    let root = parseHTML(template)
    console.log(root, 'root')
    return function () {

    }
}
