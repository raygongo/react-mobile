import React, { Component } from 'react'
import classNames from 'classnames'
// import PropTypes from 'prop-types'
import TipItem from '../components/TipItem'
import { connect } from 'react-redux'
import { editMode, getHomeData, cancelEdit, submitEdit, getEditData } from '../actions/index.js'
import Token from '@/mobileInterface/token'

class Home extends Component {
    componentDidMount() {
        /**
         * 全局对象 挂载 刷新方法
         */
        window.refreshPlugin = ({ cid }) => {
            this.refreshPlugin(cid)
        }
        // 有数据的时候 返回 空
        if (this.props.isEdit) return
        // 没有数据 则发送请求
        this.props.getData()
    }
    refreshPlugin(mark) {
        Token.getToken().then((tokenParms)=> {
            window.CONFIG.TOKEN_PARMS = tokenParms.token
            for (let item in this.refs) {
                this.refs[item].reloadIframe(mark)
            }
        })

    }
    handelSubmitEdit() {
        // 判断 备份数据和 当前数据 是否一样 
        // 如果不一样说明 修改过
        // 提交dispatch 进行修改
        this.props.submitEdit({
            list: this.props.editApps
        })
    }
    /**
     * 渲染所有应用
     */
    getContentItems() {
        // 编辑模式下要重新渲染一套数据 从后台获取的 editApps
        let appList = this.props.apps
        if (this.props.isEdit) {
            appList = this.props.editApps
        }

        return appList.map((item, index) => {
            return (
                <TipItem 
                    ref={index} 
                    isEdit={this.props.isEdit} 
                    reloadIframe={this.refreshPlugin.bind(this)} 
                    key={index} 
                    index={index} 
                    {...item} />
            )
        })
    }
    /**
     * 进入编辑模式
     */
    handelOpenEdit() {

        // 判断当前 是不是编辑模式 
        // 如果是 则执行确定操作
        if (this.props.isEdit) {
            this.handelSubmitEdit()
        } else {
            this.props.getEditData()
        }
        // 如果不是 则进入编辑模式

    }
    /**
     * 取消编辑模式
     */
    handelCancelEdit() {
        this.props.getData()
    }
    render() {
        const appContainer = classNames({
            'app-container': true,
        })

        return (
            <div className={appContainer} >
                {
                    this.getContentItems()
                }
                {
                    this.props.feachSuccess ?
                        <div className="home-edit-btn" onClick={this.handelOpenEdit.bind(this)} >
                            <i className="iconfont icon-edit"></i>
                            {this.props.isEdit
                                ? "提交"
                                : "编辑"
                            }
                        </div>
                        : null

                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {

    return {
        ...state.HomeList
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        editMode: (isEdit) => dispatch(editMode(isEdit)),
        getData: () => dispatch(getHomeData()),
        getEditData: () => dispatch(getEditData()),
        cancelEdit: () => dispatch(cancelEdit()),
        submitEdit: ({ list, msId }) => dispatch(submitEdit({ list, msId }))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)

