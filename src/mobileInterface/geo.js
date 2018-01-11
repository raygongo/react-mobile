import 'es6-promise/auto';
import mi from './mobileInterface';
import CallbackHandler from './callback';
/** 地理位置相关操作 */
export default class Geology {
    /**
     * 获取当前坐标
     *
     * (不需要进行二次转换)
     */
    static getLocation() {
        // 需要先判断 方法已经被挂载 如果已经挂载了 需要设置轮训 直到删除了方法 才激活接口
        // if(window['locationRetBack']){
        //     let timeId = setInterval(()=>{
        //         if(!window['locationRetBack']){
        //             alert("定时器中的gps")
        //             // 调取时 清除定时器
        //             clearInterval(timeId)
        //             return Geology.startGetLocation()
        //         }
        //     },500)
        // } else{
            return Geology.startGetLocation()
        // }
    }
    static startGetLocation(){
        if (mi.isAndroid) {
            const promise = CallbackHandler.registerCallbackPromise('locationRetBack').then(function (response) {
                window['locationRetBack'] = null
                return response[0];
            });
            // mi.getLocation();
            if(window.callback){
                //激活接口
                console.log("激活接口：Android")
                window.callback['startLocation']()
            }
            return promise;
        }
        else {
            const promise = CallbackHandler.registerCallbackPromise('locationRetBack').then(function (response) {
                window['locationRetBack'] = null
                return response[0];
            });
            // mi.getLocationForIOS();
            if(window['gpsLocationOnMars']){
                //激活接口
               console.log("激活接口：ios")
                window['gpsLocationOnMars']()
            }
            return promise;
        }
    }
}
