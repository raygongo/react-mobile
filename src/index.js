import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import OpenComponent from '@/mobileInterface/openComponent'

// 监听 iframe 的 跳转信息 
/**
 * 监听 iframe 的 跳转信息   
 * {url,cid}
 */
window.addEventListener('message', function (event) {
    if (event.data.url && event.data.cid) {
        OpenComponent.open({
            url: event.data.url,
            cid: event.data.cid
        })
    }
}, false);

ReactDOM.render( < App / > , document.getElementById('root'));