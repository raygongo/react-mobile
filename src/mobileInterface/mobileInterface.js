/** 是否为安卓环境 */
export const isAndroid = !!window.callback;
/** 调用移动端接口，有一些针对不同终端的逻辑 */
const invokeInterface = window.callback ? createAndroidInvoker() : createIOSInvoker();
/** 调用接口 */
function doInvoke(name, opts) {
    if (window[name]) {
        // IOS
        opts ? window[name](opts) : window[name]()
    }
    else if (window.callback && window.callback[name]) {
        // 安卓
        opts ? window.callback[name](opts): window.callback[name]();
    }
    else {
        throw `接口 ${name} 不存在！`;
    }
}
/**
 * 安卓端接口调用函数
 * 对于安卓端，在前一个接口调用的 500ms 内，不能接着调用任何接口
 */
function createAndroidInvoker() {
    const timeout = 500, queue = [];
    let interval;
    return function fun(name, opts) {
        // 如果在接口调用的间隔之内，则将调用放入队列
        if (interval) {
            queue.push({ name, opts });
            return;
        }
        // 设置接口调用间隔
        (function waitInvoke() {
            interval = setTimeout(function () {
                //从队列中取出等待中的接口进行调用
                const param = queue.shift();
                if (param) {
                    doInvoke(param.name, param.opts);
                    waitInvoke();
                }
                else {
                    interval = 0;
                }
            }, timeout);
        })();
        doInvoke(name, opts);
    };
}
/**
 * IOS 端接口调用函数
 * 在页面刚打开时，IOS 端接口可能还未注入到页面上，
 * 为此，需要先设置一些延迟
 */
function createIOSInvoker() {
    let queue = [];
    //检查接口函数是否已经注入，如果没有，则设置一个延迟
    let proxyInvoke = window.openCamera ? doInvoke : (function () {
        let delayCount = 0;
        function delayDone() {
            if (!window.openCamera) {
                delay();
                return;
            }
            //延时结束，将接口调用恢复成正常的接口
            proxyInvoke = doInvoke;
            //将队列中的接口依次调用
            let param;
            while (param = queue.shift()) {
                doInvoke(param.name, param.opts);
            }
        }
        function delay() {
            //if (document.readyState === 'complete') {
            setTimeout(function () {
                if (++delayCount >= 50) {
                    throw 'IOS 接口不存在！';
                }
                delayDone();
            }, 200);
            /*} else {
                document.addEventListener('DOMContentLoaded', delayDone);
            }*/
        }
        delay();
        return function (name, opts) {
            //在延时结束前，将所有对接口的调用加入队列中
            queue.push({ name, opts });
        };
    })();
    return function (name, opts) {
        proxyInvoke(name, opts);
    };
}
export default {
    /** 是否是安卓客户端 */
    isAndroid: isAndroid,
    /** 执行文件下载 */
    downloadFile(opts) {
        invokeInterface('downloadFile', opts);
    },
    /** 取消文件下载 */
    cancelDownload(opts) {
        invokeInterface('cancelDownload', opts);
    },
    /** 检查文件是否已经下载过 */
    checkFileDownloaded(opts) {
        invokeInterface('checkFileDownloaded', opts);
    },
    /** 打开本地文件 */
    openLocalFile(opts) {
        invokeInterface('openLocalFile', opts);
    },
    /**
     * 显示Toast提示，显示时长有系统控制
     * @param msg 消息内容
     * @param time 显示时长：毫秒，默认 2000 毫秒
     * - 在android设备上，time大于2000，将会弹出较长时间的信息窗口，小于等于2000会弹出较短时间的信息窗口，具体时间根据android版本决定。
     * - 在IOS设备上，会根据设定的时间来弹出设定时间的信息窗口。
     */
    showToast(msg, time = 2000) {
        invokeInterface('showToast', { msg, time: time.toString() });
    },
    /**
     * 打开工作组会话
     * @param jid 工作组JID
     */
    openGroupChat(jid) {
        invokeInterface('openGroupChat', { jid });
    },
    /**
     * 打开点对点会话
     * @param jid 用户JID，如：wanli_10000001@isphere
     */
    openUserChat(jid) {
        invokeInterface('openUserChat', { jid });
    },
    /**
     * 打开用户资料
     * @param jid 用户JID，如：wanli_10000001@isphere
     */
    openUserInfo(jid) {
        invokeInterface('openUserInfo', { jid });
    },
    /** 扫描二维码并返回结果字符串 */
    scanQRCode() {
        invokeInterface('scanQRCode');
    },
    /** 选择成员 */
    openUserSelector(selected) {
        invokeInterface('openUserSelector', selected);
    },
    /** 定位 */
    getLocation() {
        invokeInterface('startLocation');
    },
    /**
     * 获取位置，IOS专用接口，Android 下无法使用
     *
     * 注意：请勿直接使用此接口，而应该调用 Geology 模块下的函数
     */
    getLocationForIOS() {
        invokeInterface('gpsLocationOnMars');
    },
    /** 上传文件 */
    uploadFile(file) {
        invokeInterface('uploadFile', file);
    },
    /** 取消上传中的文件 */
    cancelUpload(file) {
        invokeInterface('cancelUpload', file);
    },
    /** 打开文件选择器 */
    openFileSelector(option) {
        invokeInterface('openFileSelector', {
            fileNum: option.fileNum.toString()
        });
    },
    /** 打开图片选择器 */
    openImgSelector(option) {
        invokeInterface('openImgSelector', {
            loadCamera: option.loadCamera ? option.loadCamera.toString() : 'false',
            fileNum: option.fileNum ? option.fileNum.toString() : '1'
        });
    },
    /** 相机拍照 */
    openCamera(option) {
        invokeInterface('openCamera', {
            height: option.height.toString(),
            width: option.width.toString()
        });
    },
    /** 关闭 Web View */
    closeWebView() {
        invokeInterface('closeWebView');
    },
    /** 跳转到登录页面 */
    gotoLogin(option = { isClearLoginInfo: false }) {
        var interOption = {
            isClearLoginInfo: option.isClearLoginInfo.toString()
        };
        invokeInterface('gotoLogin', interOption);
    },
    /** 获取用户的token信息 */
    getTokenParams() {
        invokeInterface('getTokenParams');
    },
    /** 打开组件 */
    openComponent(options) {
        invokeInterface('openComponent', JSON.stringify(options));
    }
};
