// import Immutable from 'immutable'
import {
    EDIT_MODE,
    RECEIVE_POSTS,
    CHANGE_APP_ITEM,
    CANCEL_EDIT,
    RECEIVE_EDIT_LIST
} from '../actions/index'

const defaultlState = {
    isEdit:false,
    apps: [],
    feachSuccess:false,
    editApps: [] // 编辑模式下的数据
}
export const HomeList = (state = defaultlState, action = {}) => {
    switch (action.type) {
        case RECEIVE_POSTS:
            return {
                ...state,
                ...action.data,
                editApps:[],
                isEdit:false,
                feachSuccess:true
            }
        case RECEIVE_EDIT_LIST:
            return {
                ...state,
                editApps:action.data.apps,
                isEdit:true,
            }
        case CHANGE_APP_ITEM:
            const list = state.editApps.map((app, index) => {
                if (index == action.index) {
                    return Object.assign({}, app, action.app)
                }
                return app
            })
            return {
                ...state,
                editApps: list
            }
        case CANCEL_EDIT:
            // 取出备份数据
            return {
                ...state,
                isEdit:false
            }
        case EDIT_MODE:
            return {
                ...state,
                isEdit: action.isEdit
            }
        default:
            return state
    }
}