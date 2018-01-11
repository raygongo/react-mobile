import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { List, Switch, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import { connect } from 'react-redux'
import http from '@/ajax/'

import { getAppStore } from '@/ajax/api'
import { changeAppItem } from '../actions/index.js'
let SwitchList = ({ form, data = {}, targetMark, appIndex, changeItem }) => {
    const { getFieldProps } = form;
    const { list, type } = data
    return (
        <List
            renderHeader={() => type}
        >
            {list.map(({ ico, mark, name, pgeico, type, url, checked }, index) => {
                return <List.Item
                    extra={<Switch
                        {...getFieldProps(name, {
                            valuePropName: 'checked',
                        }) }
                        checked={checked}
                        platform="ios"
                        onClick={(checked) => { changeItem({ ico, mark, name, pgeico, type, url }, checked) }}
                    />}
                    key={mark}
                >
                    <img src={ico} alt={name} className="swich-img" />
                    <span className="swich-title">{name}</span>
                </List.Item>
            })}
        </List>
    );
};

SwitchList = createForm()(SwitchList);

class PickerApp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listData: [],
            targetMark: this.props.match.params.mark,
        }

    }
    static contextTypes = {
        router: PropTypes.object.isRequired
    };
    componentDidMount() {
        // 获取所有应用信息 
        // 获取数据的时候 给每一个属性 增加一个 checked属性 与url传进来的 mark作对比 进行赋值
        if (!window.AppListData) {
            http.get(getAppStore, {
                terminal: window.CONFIG.terminal,
                cn: window.CONFIG.cn
            })
                .then(data => {
                    window.AppListData = data
                    this.createAppData(window.AppListData)
                })
        } else {
            // 组装数据
            this.createAppData(window.AppListData)
        }

    }
    /**
     * 组装app数据
     */
    createAppData(data) {
        const target = []
        const urlMark = this.props.match.params.mark
        data.forEach(({ ico, mark, name, pgeico, type, url }) => {
            if (target.length) {
                target.forEach((item, index) => {
                    if (item.type == type) {
                        // 如果匹配上了 则将数据 装入目标数组
                        item.list.push({ ico, mark, name, pgeico, type, url, checked: urlMark == mark })
                    } else if (index === target.length - 1) {
                        // 说明未匹配上 则新增
                        let temp = {
                            type: type,
                            list: [{ ico, mark, name, pgeico, type, url, checked: urlMark == mark }]
                        }
                        target.push(temp)
                    }
                })
            } else {
                // 第一次进来 没有数据 则 新增数据
                let temp = {
                    type: type,
                    list: [{ ico, mark, name, pgeico, type, url, checked: urlMark == mark }]
                }
                target.push(temp)
            }
        })

        this.setState({
            listData: target
        })
    }

    /**
     * 确定切换app 提交更换 app的操作
     */
    handelChangeApp() {
        const urlMark = this.props.match.params.mark
        const targetIndex = this.props.match.params.index
        // 找出选中的app
        const tempList = this.state.listData
        let isAdd = tempList.some(({ list }) => {
            return list.some(item => {
                if (item.checked) {
                    // 1. 有选中的 执行 更换操作
                    let app = item
                    // 2. 执行更换app的操作
                    this.props.changeAppItem({ ico: app.ico, name: app.name, url: app.url, mark: app.mark }, targetIndex)
                    return true
                } else {
                    return false
                }
            })
        })
        if (!isAdd) {
            // 4.  取消操作 将app中的数据 置空
            this.props.changeAppItem({ ico: '', name: '', url: '', mark: '' }, targetIndex)
        }

        // 返回上一页
        this.context.router.history.goBack()
    }

    /**
     * 
     * @param {obj} app   选中的app的所有信息
     * @param {bool} checked 
     */
    changeItem(app, checked) {
        // 分两种情况 

        const tempList = this.state.listData
        tempList.forEach(({ list }) => {
            list.forEach(item => {
                if (checked) {
                    // 1. 选中的时候 需要 遍历 将其他 的值置为空
                    item.checked = item.mark === app.mark
                } else {
                    // 2. 只修改对应的值
                    (item.mark === app.mark) && (item.checked = false)
                }
            })
        })
        this.setState({
            listData: tempList   // 修改 所有switch对应的checked
        })
    }
    render() {
        return (
            <div className="app-list-wrap">
                {
                    this.state.listData.map((item, index) => (
                        <SwitchList
                            data={item}
                            key={item.type}
                            changeItem={this.changeItem.bind(this)}
                            appIndex={this.props.match.params.index}
                        />
                    ))
                }
                {
                    this.state.listData.length
                        ? <div className="home-edit-btn" onClick={this.handelChangeApp.bind(this)} >
                            <i className="iconfont icon-edit"></i>确定</div>
                        : null
                }
            </div>
        )
    }
}
const mapStateToProps = () => {
    return {

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        changeAppItem: (app, index) => dispatch(changeAppItem(app, index)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PickerApp);