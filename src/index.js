import { initMixin } from './init'
import { renderMixin } from './render'
import { lifecycleMixin } from './lifecycle'
import { initGlobalApi } from "./global-api/index.js";

function Vue(options) {
    this._init(options)
}

// 给原型扩展方法
initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)

// 给构造函数扩展全局方法
initGlobalApi(Vue)

// ----------------------------- diff ---------------------------------
// diff 是比较两个树（虚拟dom）的差异，把前后的dom节点渲染成虚拟dom，通过对虚拟节点对比，更新真实dom


import { compileToFunction } from './compiler/index';
import { createEle, patch} from './vdom/patch';

let vm1 = new Vue({ data: { name: 'loading'} })
let vm2 = new Vue({ data: { name: 'shilei'} })

let render1 = compileToFunction(`<div key="div" style="background: red;color: white" id="a" c="c">
    <li key="A" a="1" style="color: white">A1</li>
    <li key="B">B1</li>
    <li key="C">C1</li>
    <li key="D">D</li>
</div>`)
let oldVnode = render1.call(vm1)

let realElement = createEle(oldVnode)

document.body.appendChild(realElement)

let render2 = compileToFunction(`<div key="div" style="background: yellow;" id="b" class="title" c="newc">
    <li key="C" class="c">C2</li>
    <li key="D">D</li>
    <li key="M" style="color:red">M2</li>
    <li key="E">E</li>
</div>`)

let newVnode = render2.call(vm2)

setTimeout(() => {
    patch(oldVnode, newVnode)
}, 3000);

export default Vue
