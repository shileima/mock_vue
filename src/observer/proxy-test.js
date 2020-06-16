
let obj = {
    name: '蔺相如',
    flag: {
        book: {
            name: 'js',
            page: 325
        },
        interest: ['睡觉', '旅游'],
    }
}

function reactive(target) {
    const handler = {
        get(target, key, receiver) {
            console.log('proxy get ' + key);
            if (typeof target[key] === 'object' && target[key] !== null) {
                return new Proxy(target[key], handler)
            }
            return Reflect.get(target, key, receiver)
        },
        set(target, key, value, receiver) {
            console.log('proxy set ' + key + '=' + value);
            return Reflect.set(target, key, value, receiver)
        }
    }
    return new Proxy(target, handler)
}

let proxyObj = reactive(obj)
proxyObj.name = '郭守敬'
console.log('----------');
proxyObj.flag.interest.push('打豆豆')
console.log('----------');
proxyObj.flag.book.name = 'ts'
console.log('----------');
console.log(proxyObj);
