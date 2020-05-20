<template>
  <div>footer...2...<span class="page">{{query.page}}</span>/<span class="topage">{{query.topage}}</span></div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      query: {}
    }
  },
  asyncData(context) {
    return { query: context.query }
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
</style>
