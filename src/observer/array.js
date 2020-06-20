
// 我要重写数组的那些方法 push pop shift unshift sort reverse splice 会改变数组
let oldArrayMethods = Array.prototype
export const arrayMethods = Object.create(oldArrayMethods);
const methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'sort',
    'reverse',
    'splice'
]
methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        // console.log('用户调用了' + method)
        const result = oldArrayMethods[method].apply(this, args)
        // 添加元素可能还是一个对象继续监控
        let inserted;
        let ob = this.__ob__;
        // console.log(ob, 'ob')
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break;
            case 'splice': // 3个参数，新增的数据在第三项
                inserted = args.slice(2)
                break;
            default:
                break;
        }
        if (inserted) ob.observerArray(inserted)

        return result
    }
})
