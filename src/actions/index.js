import http from '@/ajax'
import {
    getFindAll,
    editAppAPI,
    getModifyApps
} from '@/ajax/api'
import Token from '@/mobileInterface/token'

// 进入编辑模式
export const EDIT_MODE = 'EDIT_MODE'

// 获取首页列表数据成功
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
// 获取编辑列表数据成功
export const RECEIVE_EDIT_LIST = 'RECEIVE_EDIT_LIST'

// 切换某个app
export const CHANGE_APP_ITEM = 'CHANGE_APP_ITEM'

// 取消修改 恢复数据
export const CANCEL_EDIT = 'CANCEL_EDIT'

// 提交修改
export const SUBMIT_EDIT = 'SUBMIT_EDIT'

// 修改成功
export const COMPLETE_SUBMIT = 'COMPLETE_SUBMIT'

export const editMode = (isEdit) => {
    return {
        type: EDIT_MODE,
        isEdit
    }
}


/**
 * 确定提交 操作
 * @param {Obj} data 
 */
export const submitEdit = ({
    list
}) => {
    return dispatch => {
        // 过滤数据
        let targetList = list.filter( ({url}) => !!url)
        return http.post(editAppAPI,{
            arlist:targetList,
            cn:window.CONFIG.cn
        }).then(data => {
            // 直接刷新页面
            document.getElementById("loading-box").style.display = 'block'
            window.location.reload()
            // 成功后修改数据
            // dispatch(receivePosts(data))
        })
    }
}

/**
 * 退出编辑模式 恢复数据
 */
export const cancelEdit = () => {
    return {
        type: CANCEL_EDIT
    }
}

/**
 * 更换某个app
 * @param {num} index  操作的下标 
 * @param {obj} app    更换的app
 */
export const changeAppItem = (app, index) => {
    return {
        type: CHANGE_APP_ITEM,
        index,
        app
    }
}

//获取数据成功
const receivePosts = (data) => {
    return {
        type: RECEIVE_POSTS,
        data
    }
}
//获取数据成功
const receiveEditList = (data) => {
    return {
        type: RECEIVE_EDIT_LIST,
        data
    }
}

// 页面初次渲染时获取数据
export const getHomeData = () => {
    return dispatch => {
        // dispatch(requestPosts(postData));
        return http.get(getFindAll, {
                cn: window.CONFIG.cn
            })
            .then(data => {
                // 传数据的时候 必须要保证 移动端的接口已经挂载 能够获取到用户的 token
                
                Token.getToken().then(function (tokenParms) {
                //     console.log('接口调用成功',tokenParms.token)
                    window.CONFIG.TOKEN_PARMS = tokenParms.token
                    dispatch(receivePosts(data))
                })
                
            })
            .catch(error => console.log(error))
    }
}

// 获取编辑模式下的数据
export const getEditData = () => {
    return dispatch => {
        // dispatch(requestPosts(postData));
        return http.get(getModifyApps, {
                cn: window.CONFIG.cn
            })
            .then(data => {
                // 传数据的时候 必须要保证 移动端的接口已经挂载 能够获取到用户的 token
                console.log('开始调用接口')
                dispatch(receiveEditList(data))
                
            })
            .catch(error => console.log(error))
    }
}