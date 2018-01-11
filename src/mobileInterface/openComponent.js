import 'es6-promise/auto';
import mi from './mobileInterface';
/** 二维码操作 */
export default class OpenComponent {
    /** 扫描二维码 */
    static open(options) {
        mi.openComponent(options);
    }
}
