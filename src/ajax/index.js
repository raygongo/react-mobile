import axios from 'axios';
import {
	baseURL
} from '@/config/'
import {
	Toast
} from 'antd-mobile';
import Qs from 'qs'
import {showErrorTip} from "@/config"

const fetchAjax = options => {
	return new Promise((resolve, reject) => {

		const instance = axios.create({
			baseURL: baseURL,
			// timeout: 10000,
		})

		instance.defaults.headers['Content-Type'] = 'application/json'

		/**
		 * 请求拦截
		 */
		instance.interceptors.request.use(config => {
			document.getElementById("loading-box").style.display = 'block'

			// config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
			// if (config.method === 'post') {
			// 	config.data = Qs.stringify({
			// 		...config.data
			// 	})
			// 	// config.data = JSON.stringify(config.data)
			// }
			config.headers.cn = window.CONFIG.cn
			return config
		}, err => {
			return Promise.reject(err)
		})

		/**
		 * 响应拦截
		 */
		instance.interceptors.response.use(res => {

			if (Number(res.status) === 200) {
				return res.data
			}
			
			Toast.offline('网络错误,请稍后重试', 3);

		}, err => {
			return Promise.reject(err)
		})
		/**
		 *  处理请求结果
		 */
		instance(options)
			.then(response => {
				if (response.state !== "CO2000") {
					// 异常处理
					switch (response.state) {
						case "NOTAUTH5000":
							showErrorTip(response.message || "没有工作台权限")
							break;
						case "CHANGE2000":
							window.location.href = response.message
							break;
						case "OPERATION5000":
							showErrorTip(response.message || "没有该接口操作权限")
							break;
						case "US5000":
							showErrorTip(response.message || "初始化小应用失败")
							break;
						default:
							Toast.offline('服务器出错,请稍后重试', 3);
							break;
					}
					
				} else {
					resolve(response.data)
				}
				document.getElementById("loading-box").style.display = 'none'
			})
			.catch(err => {
				document.getElementById("loading-box").style.display = 'none'
				Toast.offline('网络错误,请稍后重试', 3);
			})
	})
}

export default {
	get(url, params = {}) {
		return fetchAjax({
			method: 'GET',
			url,
			params
		})
	},

	post(url, data = {}) {
		return fetchAjax({
			method: 'POST',
			url,
			data
		})
	}
}

// export default {
// 	get(url, params = {}) {
// 		return axios.get(url, params, config)
// 	},

// 	post(url, data = {}) {
// 		return axios.post(url, data, config)
// 	}
// }