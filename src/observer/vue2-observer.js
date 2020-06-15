// 1.Object.defineProperty 拦截的是对象的属性，会改变原对象。proxy 是拦截整个对象，通过 new 生成一个新对象，不会改变原对象。
// 2.proxy 的拦截方式，除了上面的 get 和 set ，还有 11 种。选择的方式很多 Proxy，
// 也可以监听一些  Object.defineProperty 监听不到的操作，比如监听数组，监听对象属性的新增，删除等。

function observer(obj) {
    if (typeof obj === 'object') {
        for (let key in obj) {
            defineReactive(obj, key, obj[key])
        }
    }
}

function defineReactive(obj, key, value) {
    //针对value是对象，递归检测
    observer(value)
    //劫持对象的key
    Object.defineProperty(obj, key, {
        get() {
            console.log('获取：' + key)
            return value
        },
        set(val) {
            //针对所设置的val是对象
            observer(val)
            console.log(key + "-数据改变了")
            value = val
        }
    })
}

let obj = {
    name: '守候',
    flag: {
        book: {
            name: 'js',
            page: 325
        },
        interest: ['火锅', '旅游'],
    }
}

observer(obj)

// 改变数据
obj.flag.book.name = "emporor"