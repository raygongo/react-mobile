import 'es6-promise/auto';
import mi from './mobileInterface';
import CallbackHandler from './common/callbackHandler';
/** 二维码操作 */
export default class Token {
    /** 扫描二维码 */
    static getToken() {
        const promise = CallbackHandler.registerCallbackPromise('getTokenParamsRetBack').then(function (response) {
            return response;
        });
        mi.getTokenParams();
        return promise;
    }
}
