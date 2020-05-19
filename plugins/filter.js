import Vue from 'vue'
export function gender (str) {
  return { '-1': '空', '0': '男', '1': '女' }[str] || ''
}

const filters = {
  gender
}

export default filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})