const devURL = 'http://localhost:8080/plugin-workbench/'   // 开发地址
const proURL = '/plugin-workbench'   // 线上地址

// 配置 线上和线下接口开发地址
console.log(process.env.NODE_ENV)
export const baseURL = process.env.NODE_ENV === 'development' ? devURL : proURL
export const homeUrl = '/plugin-workbench/index/mobile'


export const getUserToken = () => {
    let u = navigator.userAgent
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 //android终端
}


// 错误代码提示
export const showErrorTip = (msg) => {
    let errorMsgDOM = document.querySelector("#failed-data-text")
    let errorTipDOM = document.querySelector("#failed-jurisdiction")
    
    errorMsgDOM.textContent = msg
    errorTipDOM.style.display = "block"
    
}