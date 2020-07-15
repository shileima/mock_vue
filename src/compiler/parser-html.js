const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // abc-aaa
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // <aaa:asdads>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >  <div>

const ELEMENT_TYPE = 1
const TEXT_TYPE = 3

export function parseHTML(html) {

    let root = null // ast 语法书的树根
    let currentParent; // 标示当前父亲是谁
    let stack = []

    // 常见数据结构 栈 队列 数组 链表 集合 hash表 树
    function createASTElement(tagName, attrs) {
        return {
            tag: tagName,
            type: ELEMENT_TYPE,
            children: [],
            attrs,
            parent: null
        }
    }

    function start(tagName, attrs) {
        // console.log('标签是' + tagName + '属性是：' + attrs)
        let element = createASTElement(tagName, attrs)
        if (!root) {
            root = element
        }
        currentParent = element // 吧当前元素标记为父 ast 树
        stack.push(element) // 将开始标签存放到栈中
    }

    function end(endTag) {
        // console.log('结束标签：', endTag)
        const element = stack.pop()
        currentParent = stack[stack.length - 1]
        if (currentParent) {
            element.parent = currentParent
            currentParent.children.push(element)
        }
    }

    function chars(text) {
        // console.log('文本是', text)
        text = text.replace(/\s/g, '')
        if (text) {
            currentParent.children.push({
                text,
                type: TEXT_TYPE
            })
        }
    }

    while (html) {
        let textEnd = html.indexOf('<')
        if (textEnd == 0) {
            let startTagMath = parseStartTag()
            if (startTagMath) {
                start(startTagMath.tagName, startTagMath.attrs);
                continue;
            }
            let endTagMatch = html.match(endTag)
            if (endTagMatch) {
                // console.log(endTagMatch, 'endTagMatch')
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue
            }
        }
        let text;
        if (textEnd >= 0) {
            text = html.substring(0, textEnd)
        }
        if (text) {
            advance(text.length)
            chars(text)
        }
    }
    function advance(n) {
        html = html.substring(n)
    }
    function parseStartTag() {
        let start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length) // 开始标签删除
            let end, attr;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length) // 解析并去掉属性
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
            }
            if (end) {
                advance(end[0].length) // 末尾标签 > 去掉
                return match
            }
        }
    }

    return root;
}
