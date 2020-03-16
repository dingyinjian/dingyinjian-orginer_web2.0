import axios from 'axios'
import { vm } from './main'


export const domain = '192.168.110.161:9006';

const service = axios.create({ baseURL: document.location.protocol + "//" + domain, withCredentials: true });

/**封装post方法 */
export async function post(url, data) {
  try {
    const config = {}
    if (obj.token) config.headers = { 'Authorization': obj.token }
    let res = await service.post(url, data, config);
    return res.data
  } catch (e) {
    let res = e.response;
    console.log(res)
    if (res.data.message == 'unauthorized') {
      res.data.message = '验证未通过，请重新登陆'
    //   tips('danger', res.data.message)
      vm.$router.replace({ path: '/login' })
    }
    return res.data
  }
}


//设置cookie
export function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

//获取cookie
export function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
  }
  return "";
}
//清除cookie  
export function clearCookie(name) {  
    setCookie(name,'',-1);  
} 
/**提示 */
export function tips(variant, message) {
  vm.$bvToast.toast(message, {
    title: `提示:`,
    variant: variant,
    solid: true,
    autoHideDelay: 1500,
    toaster: 'b-toaster-top-center'
  })
}
//延时操作
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
/**时间格式转换 */
export function transferTime(value) {
  if (value) return vm.$moment(value).format("YYYY-MM-DD HH:mm:ss")
}
export const obj = {
  token: getCookie('origin_token'),
}

export const limits = [
  { value: 10, text: '10条/每页' },
  { value: 20, text: '20条/每页' },
  { value: 30, text: '30条/每页' },
  { value: 40, text: '40条/每页' },
  { value: 50, text: '50条/每页' },
  { value: 60, text: '60条/每页' },
  { value: 70, text: '70条/每页' },
  { value: 80, text: '80条/每页' },
  { value: 90, text: '90条/每页' },
]