const isAndroid = ()=>  {

    return !!window['callback']
}

export class MobileInterface {
    // 获取token信息
    static getTokenParams(callbackName) {
        // 创建一个promise
        const promiseCallback = new Promise()
        // 1.注册函数
        if(isAndroid){
            window[callbackName] = (item) => {

            }
        }
    }

}