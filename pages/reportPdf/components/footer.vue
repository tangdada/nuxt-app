<template>
  <div class="foot-wrap">
    <div>{{hospitalName}}</div>
    <div><span>{{$route.query.page}}</span>/<span>{{$route.query.topage}}</span></div>
  </div>
</template>

<script>
export default {
  name: 'pdf-footer',
  components: {
  },
  data() {
    return {
    }
  },
  props: {
    hospitalName: {
      type: [String],
      default: function () {
        return ''
      }
    },
  },
  computed: {
  },
  methods: {
  },
  created() {
  },
}
</script> 

<style lang="less">
.foot-wrap {
  display: flex;
  justify-content: space-between;
}
</style>
