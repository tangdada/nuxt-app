<template>
  <div class="head">
    <div class="head-b f16-x">
      <div>体检号：{{options.reportNo}}</div>
      <div>
        受检者：
        <span class="dib">{{options.userName}} · {{options.gender | gender}} · {{options.age}}</span>
      </div>
      <div class="tr">
        体检时间：
        <span class="dib">{{options.examineDate | formatDateTime('YYYY-MM-DD')}}</span>
      </div>
    </div>

    <div class="square-wrap">
      <div class="square">
        <div class="square1"></div>
        <div class="square2"></div>
        <div class="square3"></div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'report-header',
  props: {
    options: {
      type: [Object],
      default: function () {
        return {}
      }
    },
  }
}
</script>
<style lang="less" scoped>
@coe: 0.8;

.head {
  position: relative;
  height: 60px;
  width: 100%;
  &-b {
    padding-top: 42px;
    display: flex;
    justify-content: space-between;
    padding-right: 50px;
  }
}
.square-wrap {
  position: absolute;
  display: inline-block;
  right: 0;
  bottom: 0;
}
.square {
  position: relative;
  width: 60px;
  height: 60px;
  .square3 {
    position: absolute;
    right: 20px;
    top: 0;
    width: 10px;
    height: 10px;
    background: #33333340;
  }
  .square1 {
    position: absolute;
    right: 0;
    top: 20px;
    width: 40px;
    height: 40px;
    background: #33333340;
  }
  .square2 {
    position: absolute;
    right: 40px;
    top: 0;
    width: 20px;
    height: 20px;
    background: #33333340;
  }
}
.f16-x {
  font-size: 16px * @coe!important;
}
</style>

