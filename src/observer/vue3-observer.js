function observerProxy(obj) {
    let handler = {
        get(target, key, receiver) {
            console.log('获取：' + key)
            // 如果是对象，就递归添加 proxy 拦截
            if (typeof target[key] === 'object' && target[key] !== null) {
                return new Proxy(target[key], handler)
            }
            return Reflect.get(target, key, receiver)
        },
        set(target, key, value, receiver) {
            console.log(key + "-数据改变了")
            return Reflect.set(target, key, value, receiver)
        }
    }
    return new Proxy(obj, handler)
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

let objTest = observerProxy(obj)

// console.log(objTest)
// objTest.name = 'loading'
objTest.flag.book.name = 'ts'
// objTest.flag.interest.push('打豆豆')