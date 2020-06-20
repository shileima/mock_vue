
// Object.defineProperty 无法兼容 IE8
import { isObject, def } from '../util/index'
import { arrayMethods } from './array'
import Dep from './dep'
class Observer {
    constructor(value) {
        // value.__ob__ = this // 把当前实例挂载到数据上,为了调用observerArray方法，会造成循环递归调用
        def(value, '__ob__', this)
        if (Array.isArray(value)) {
            // 处理数组，数组索引由于性能问题不监控
            // push shift pop unshift
            value.__proto__ = arrayMethods
            // 如果数组内是对象，则监控
            this.observerArray(value)

        } else {
            // 如果对象层次过多，需要递归解析对象的属性，依次增加set 和 get 方法
            this.observerObject(value)
        }
    }
    observerArray(value) {
        for (let i = 0; i < value.length; i++) {
            observe(value[i])
            // this.observerObject(value[i])
        }
    }
    observerObject(data) {
        let keys = Object.keys(data);
        // console.log(keys, 'keys')
        keys.forEach(key => {
            defineReactive(data, key, data[key]); // 定义响应式数据
        })
    }
}
function defineReactive(data, key, value) {
    observe(value) // 递归深度监控数据变化
    let dep = new Dep() // 每一个属性都有一个dep，收集依赖用的
    Object.defineProperty(data, key, {
        get() {
            if (Dep.target) {
                dep.depend() // 让 dep 去 watcher
            }
            // console.log(key, dep)
            // 数据变化后，通知 watcher 更新试图
            return value;
        },
        set(newValue) {
            if (newValue === value) return;
            // console.log('值发生变化了')
            observe(newValue) // 继续监控新设置的值
            value = newValue
            // 更新数据时，把当前组件对应的 watcher 重新执行一项
            // console.log(dep.subs, 'dep.subs');

            dep.notify()
        }
    })
}
export function observe(data) {
    let isObj = isObject(data)
    if (!isObj) {
        return
    }
    // 防止对象被重复观测
    if (data.__ob__ instanceof Observer) {
        return
    }
    return new Observer(data)
}
