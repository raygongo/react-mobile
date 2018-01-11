export default class regCallback {
    static registerCallbackPromise(callbackName){
        return new Promise((resolve, reject) => {
            regCallback.registerCallback(callbackName, resolve);
        });
    }
    static resolveResponse(param) {
        if (typeof param === 'string') {
            return JSON.parse(decodeURIComponent(atob(param)));
        }else{
            return param
        }
    }
    static registerCallback(callbackName, callback) {
        window[callbackName] =  (response) => {
            console.log("接受数据：：：",regCallback.resolveResponse(response))
            callback(regCallback.resolveResponse(response));
        };
    }
}