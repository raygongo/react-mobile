import React, { Component } from 'react'
import classNames from 'classnames'
import {
    Link
} from 'react-router-dom'
import Geology from '@/mobileInterface/geo'
import {homeUrl} from '@/config'

export default class TipItem extends Component {
    constructor() {
        super()
        this.state = {
            showAll: true,
        }
    }
    /**
     * 收缩应用
     */
    handelSlide() {
        // 如果是编辑模式 下 不能收缩
        if (this.props.isEdit) return
        this.setState({
            showAll: !this.state.showAll
        })
    }
    reloadIframe(mark){
        if(mark === this.props.mark){
            this.refs.iframe.src = this.props.url + window.CONFIG.TOKEN_PARMS+"&plugin_name="+this.props.mark
        }
    }
    /**
     * 编辑程序
     */
    handelEditItem() {
        alert('编辑')
    }
    handelMessage(event){
        let iframe = this.refs.iframe
        if(!event.data) return
        
        if (event.data.mi == "gpsLocation" && event.data.number == this.props.index) {
            // 需要先判断 方法已经被挂载 如果已经挂载了 需要设置轮训 直到删除了方法 才激活接口
            if(window['locationRetBack']){
                let timeId = setInterval(()=>{
                    if(!window['locationRetBack']){
                        clearInterval(timeId)
                        console.log("定时器中的gps")
                        // 调取时 清除定时器
                        Geology.getLocation().then((res)=>{
                            iframe.contentWindow.postMessage(res, "*")
                        })
                    }
                },800)
            } else{
                Geology.getLocation().then((res)=>{
                    iframe.contentWindow.postMessage(res, "*")
                })
            }
            
        }
    }
    /**
	 * 从客户端获取定位信息
	 */

	getLocalPosition(){
        // if(this.props.mark !== "plugin.")
		window.addEventListener('message', this.handelMessage.bind(this), false);
	}
    render() {
        // 判断下拉状态
        let edit = this.props.isEdit

        let classes = classNames({
            'app-feature-item': true,
            'slide-up': edit ? false : !this.state.showAll
        })
        let iconClass = classNames({
            'iconfont': true,
            'icon-arrow-down': true,
            'change': edit ? false : !this.state.showAll
        })
        let isAddClass = classNames({
            'edit-text-wrap': this.props.url,
            'add-text-wrap': !this.props.url
        })

        return (
            <div className={classes}>
                <i className={iconClass} onClick={this.handelSlide.bind(this)}></i>

                {
                    this.props.isEdit
                        ? <div className="edit-tip">
                            <div className="title">{this.props.name || '未设置'}</div>
                            <Link to={`${homeUrl}/app/${this.props.mark || 0}/${this.props.index}`} className={isAddClass} >{this.props.url ? '更换' : '添加'}</Link>
                        </div>
                        : <iframe 
                            ref="iframe" 
                            scrolling="no" 
                            width={`${window.innerWidth}px`}
                            src={this.props.url + window.CONFIG.TOKEN_PARMS+"&cid="+this.props.mark+`&order_number=${this.props.index}`} frameBorder="0" ></iframe>
                }
            </div>
        )
    }
    componentDidMount(){
        // 页面加载完成后 监听postMessage信息
        this.getLocalPosition()
    }
    
    componentWillUnmount() {
        // 组件卸载 需要卸载监听的iframe的postMessage事件
        window.removeEventListener('message',this.handelMessage)
    }
    
}