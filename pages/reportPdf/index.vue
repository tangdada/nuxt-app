<template>
  <div class="report-wrap">
    <!-- page1 封面 -->
    <div :class="!isPrintPage && 'shadow'">
      <div class="pa page1">
        <div class="cover-title d1">
          <div class="barcode-wrap">
            <svg id="barcode" />
          </div>
          <div>
            <div class="f96 b">健康体检报告</div>
            <div class="f32 c6">HEALTH SCREENING REPORT</div>
            <div class="f24 c6">报告编号：{{pageInfo.report.reportNo}}</div>
          </div>
        </div>

        <div class="flex-center d2">
          <div>
            <div class="flex-center mb20">
              <span class="f64 b">{{pageInfo.report.userName}}</span>
              <span class="ml20 b">· {{pageInfo.report.gender | gender}} · {{pageInfo.report.age}}</span>
            </div>
            <div
              class="f20 attr mt10"
              v-for="attr in (pageInfo.settings.personalAttrs || []).filter(it => ['name', 'gender', 'age'].indexOf(it) === -1)"
              :key="attr.val"
              v-show="pageInfo.report[attr]"
            >
              <div class="attr-label c8">{{attrNames[attr]}}</div>
              <div class="attr-value">{{pageInfo.report[attr]}}</div>
            </div>
          </div>
        </div>
        <div class="page1-foot d3">
          <div class="img-row">
            <div class="img-row-img">
              <img v-if="pageInfo.settings.logoPicture" :src="logoImg" alt />
            </div>
            <div class="img-row-desc">
              <div class="f36 b" id="hosChineseName">{{pageInfo.settings.chineseName}}</div>
              <div class="f20 c8">{{pageInfo.settings.englishName}}</div>
            </div>
          </div>
          <div class="f20 attr mt10">
            <div class="attr-label c8">地址</div>
            <div class="attr-value">{{(pageInfo.hospital.address || {}).fullAddress}}</div>
          </div>
          <div class="f20 attr mt10">
            <div class="attr-label c8">电话</div>
            <div class="attr-value">{{pageInfo.settings.contactNumber}}</div>
          </div>
          <div class="f20 attr mt10">
            <div class="attr-label c8">网址</div>
            <div class="attr-value">www.mytijian.com/m/{{pageInfo.settings.url}}</div>
          </div>
          <div class="img-row mt10">
            <div class="img-row-img">
              <img v-if="pageInfo.settings.qrcode" :src="qrcode" alt />
            </div>
            <div class="img-row-desc">
              <div class="f36 b">约体检 · 查报告</div>
              <div class="f16 c8">请关注本体检中心官方公众号</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/fetch'
import { formatDate } from '@/utils/tool'
import JsBarcode from "jsbarcode";

const ossPath = 'http://test-i.oss-cn-shanghai.aliyuncs.com/'

export default {
  data() {
    return {
      pageInfo: {},
      attrNames: {
        mobile: "手机号",
        idcard: "证件号",
        companyName: "单位",
        department: "部门",
        examineDate: "体检时间",
        reportNo: "报告编号"
      },
    }
  },
  asyncData(context) {
    // let query = context.query || { reportId: 4068460, hospitalId: 147 }
    let query = { reportId: 5509476, hospitalId: 147, sign: '21bba31d42e26b31fdc015f6117c172d' }
    return api.getReportDetailIgnoreLogin(query).then(res => {
      return { detail: res.data, pageQuery: query }
    })
  },
  computed: {
    isPrintPage() {
      return (this.query || {}).sign
    },
    qrcode() {
      return `${ossPath}${this.pageInfo.settings.qrcode}`
    },
    logoImg() {
      return `${ossPath}${this.pageInfo.settings.logoPicture}`
    },
  },
  methods: {
    digestReportData(info) {
      let pageInfo = info;
      pageInfo.report.tplItems = pageInfo.report.tplItems.map(bi => {
        bi.tplDetails = bi.tplDetails.map(item => {
          if (typeof item.picUrl === 'string') {
            item.picUrl = item.picUrl.split(';');
          } else {
            item.picUrl = [];
          }
          return item;
        });
        return bi;
      });
      pageInfo.report.detail = (pageInfo.report.detail || '').trim();
      pageInfo.report.examineDate = formatDate(pageInfo.report.examineDate, 'yyyy-MM-dd');
      pageInfo.hospital.fullAddress = pageInfo.hospital.address.fullAddress;

      return pageInfo
    },
  },
  created() {
    this.pageInfo = this.digestReportData(this.detail)

    if (process.client) {
      JsBarcode("#barcode", this.pageInfo.report.reportNo, {
        displayValue: false,
        flat: true,
        height: 60
      });
    }
  },
}
</script> 

<style lang="less">
@coe: 0.8;

// A4纸大小: 210mm x 297mm , 这里的height, padding不能随便改，会影响到pdf的导出
.report-wrap {
  margin: 0 auto;
  width: 210mm;
  color: #333333;
  box-sizing: border-box;
}
.bdr {
  border: 1px solid red;
}
.pa {
  margin: 0 auto;
  font-size: 20px;
  box-sizing: border-box;
  min-height: 265mm;
  page-break-after: always;
}
.page1 {
  width: 160mm;
  display: flex;
  flex-flow: column;
  .d1 {
    flex: 0;
  }
  .d2 {
    flex: 1;
  }
  .page1-foot {
    flex: 0;
  }
}
.page2 {
  width: 180mm;
  display: flex;
  flex-direction: column;
  &-b {
    flex: 1;
  }
}
.page3 {
  width: 180mm;
  display: flex;
  flex-direction: column;
  &-b {
    flex: 1;
  }
}
.page4 {
  width: 180mm;
  display: flex;
  flex-direction: column;
  &-b {
    flex: 1;
  }
}

.mt10 {
  margin-top: 2mm;
}
.b {
  font-weight: bold;
}
.c0 {
  color: #000;
}
.c3 {
  color: #333;
}
.c6 {
  color: #666;
}
.c8 {
  color: #888;
}

.f16 {
  font-size: 16px * @coe!important;
}
.f20 {
  font-size: 20px * @coe;
}
.f24 {
  font-size: 24px * @coe;
}
.f28 {
  font-size: 28px * @coe;
}
.f32 {
  font-size: 32px * @coe;
}
.f36 {
  font-size: 36px * @coe;
}
.f64 {
  font-size: 64px * @coe;
}
.f96 {
  font-size: 96px * @coe;
}

.attr {
  display: flex;
  &-label {
    display: inline-block;
    text-align: right;
    width: 80px;
    margin-right: 40px;
    &::after {
      position: absolute;
      display: inline-block;
      content: '：';
    }
  }
  &-value {
    flex: 1;
  }
}
.flex-center {
  display: flex;
  align-items: center;
}
.img-row {
  display: flex;
  align-items: center;
  &-img {
    width: 120px;
    img {
      width: 80px;
      height: 80px;
    }
  }
}
.mt25 {
  margin-top: 25px;
}
.mt50 {
  margin-top: 50px;
}
.mb50 {
  margin-bottom: 50px;
}
.pre {
  white-space: pre-wrap; /*css-3*/
  white-space: -moz-pre-wrap; /*Mozilla,since1999*/
  white-space: -pre-wrap; /*Opera4-6*/
  white-space: -o-pre-wrap; /*Opera7*/
  word-wrap: break-word; /*InternetExplorer5.5+*/
  line-height: 35px;
}
.mt-table {
  border: none;
  th {
    background: #fff;
    border-bottom: 1px solid #e9eaec;
  }
  td {
    border-top: none;
  }
}
.warning {
  background: #f9e9f3;
}
.big-item {
  margin-top: 40px;
  &-t {
    font-weight: bold;
    background: #3333331a;
    padding: 4px 8px 4px 15px;
  }
}
.bdr-t-dash {
  border-top: 1px dashed #3333331a;
}
.barcode-wrap {
  display: inline-block;
  transform: rotate(270deg);
  width: 163px;
  height: 102px;
  margin-right: -32px;
  margin-left: -58px;
  margin-top: 45px;
}
#barcode {
  width: 100%;
  height: 100%;
}
.cover-title {
  display: flex;
}
</style>
