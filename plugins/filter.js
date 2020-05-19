import Vue from 'vue'
import { formatDate } from '@/utils/tool'

export function gender(str, type) {
  if (type === 'salutation') {
    if (str === 0) {
      return "先生";
    } else if (str === 1) {
      return "女士";
    } else {
      return "先生/女士";
    }
  } else {
    return { '-1': '空', '0': '男', '1': '女' }[str] || ''
  }
}

export function formatDateTime(date) {
  return formatDate(date)
}

const filters = {
  gender,
  formatDateTime
}

export default filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})