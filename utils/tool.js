import qs from 'qs'

// 查询url参数，name为必要参数，url为可选参数
export const getUrlParam = name => {
  const r = qs.parse(window.location.href.split('#')[1].split('?')[1] || '')
  return r[name] || ''
}

export const formatDate = (date, fmt = 'yyyy-MM-dd') => {
  if (!date) {
    return date
  }
  date = new Date(date)
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}