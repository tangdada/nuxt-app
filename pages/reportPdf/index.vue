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

    <!-- page2 导读 -->
    <div :class="!isPrintPage && 'shadow mt10'" v-if="pageInfo.settings.guideText">
      <div class="pa page2">
        <div class="page2-h">
          <Header :options="headerInfo" />
        </div>
        <div class="page2-b">
          <div class="mt50 mb50 f64 c0 b">导读</div>
          <div
            class="mb50 f32 b"
          >尊敬的{{pageInfo.report.userName}}{{pageInfo.report.gender | gender('salutation')}}：</div>
          <div class="mb50 f20">请您认真阅读本体检报告，如果您对本报告的检查结果有不明之处或有异议，请及时与我们联系</div>
          <div class="pre f20" v-html="pageInfo.settings.guideText"></div>
          <div class="mt50 f24 tr b">{{pageInfo.hospital.name}}</div>
        </div>
      </div>
    </div>

    <!-- page3 总检建议与结论 -->
    <div :class="!isPrintPage && 'shadow mt10'" v-if="pageInfo.report.detail">
      <div class="page3-h">
        <Header :options="headerInfo" />
      </div>
      <div class="pa page3">
        <div class="page3-b">
          <div class="mt50 mb50 f64 c0 b">总检建议与结论</div>
          <div class="mb50 f32 b">在本次体检的项目中，您有以下几方面的情况敬请注意：</div>
          <div class="pre f20" v-html="pageInfo.report.detail"></div>
        </div>
      </div>
    </div>

    <!-- page4 异常解读 -->
    <div :class="!isPrintPage && 'shadow mt10'" v-if="pageInfo.report.advice">
      <div class="pa page3">
        <div class="page3-h">
          <Header :options="headerInfo" />
        </div>
        <div class="page3-b">
          <div class="mt50 mb50 f64 c0 b">异常解读</div>
          <div class="pre f20" v-html="pageInfo.report.advice"></div>
        </div>
      </div>
    </div>

    <!-- page5 检查详情 -->
    <div :class="!isPrintPage && 'shadow mt10'">
      <div class="pa page3">
        <div class="page3-h">
          <Header :options="headerInfo" />
        </div>
        <div class="page3-b">
          <div class="mt50 mb50 f64 c0 b">检查详情</div>
          <div class="big-item f20" v-for="(bi) in pageInfo.report.tplItems" :key="bi.id">
            <div class="big-item-t f28">{{bi.title}}</div>
            <div>
              <table class="mt-table dis-hover">
                <thead>
                  <tr>
                    <th
                      class="f20 b"
                      v-for="(th, indx) in bi.columnAttrList"
                      :key="indx"
                    >{{th.name}}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    :class="{'warning' : isException(row)}"
                    v-for="(row, i) in bi.tplDetails"
                    :key="i"
                  >
                    <td v-for="(td, i) in bi.columnAttrList" :key="i">
                      {{row[td.column]}}
                      <div v-if="row.picUrl && td.column == 'result'">
                        <img
                          v-for="(p, idx) in row.picUrl"
                          :key="idx"
                          :src="prefix + p"
                          height="200"
                          width="150"
                          alt
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="bdr-t-dash p15 pt10">
                <span>检查者:</span>
                {{bi.doctor}}
                <span class="ml20">检查时间:</span>
                <span v-if="bi.examDate">{{bi.examDate | formatDateTime}}</span>
                <span v-else></span>
              </div>
              <div v-if="bi.summaryTpl.isShow" class="p15 bdr-t-dash">
                <span>小结:</span>
                {{bi.summaryTpl.result}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 检查详情end -->

    <!-- page6 声明 -->
    <div :class="!isPrintPage && 'shadow mt10'">
      <div class="pa page4">
        <div class="page3-h">
          <Header :options="headerInfo" />
        </div>
        <div class="page4-b">
          <div class="mt50 mb50 f64 c0 b">声明</div>
          <div class="pre f20" v-html="pageInfo.settings.notice"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/fetch'
import { formatDate } from '@/utils/tool'
import JsBarcode from "jsbarcode";
import Header from "./components/Header";

const ossPath = 'http://test-i.oss-cn-shanghai.aliyuncs.com/'

export default {
  components: {
    Header
  },
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
    let query = context.query.reportId ? context.query : { reportId: 5509476, hospitalId: 147, sign: '21bba31d42e26b31fdc015f6117c172d' }
    // let query = { reportId: 4068460, hospitalId: 147, sign: 'ad06f8c129f61ac0449e84288cbc7662' }
    return api.getReportDetailIgnoreLogin(query).then(res => {
      return { detail: res.data, pageQuery: query }
    })
  },
  computed: {
    isPrintPage() {
      return (this.pageQuery || {}).sign
    },
    headerInfo() {
      return {
        reportNo: this.pageInfo.report.reportNo,
        userName: this.pageInfo.report.userName,
        gender: this.pageInfo.report.gender,
        age: this.pageInfo.report.age,
        examineDate: this.pageInfo.report.examineDate
      }
    },
    qrcode() {
      return `${ossPath}${this.pageInfo.settings.qrcode}`
    },
    logoImg() {
      return `${ossPath}${this.pageInfo.settings.logoPicture}`
    },
  },
  methods: {
    isException(row) {
      // 如果包含( ↑ ↓ )符号显示为红色
      for (var key in row) {
        if (
          (row[key] + "").indexOf("↑") > -1 ||
          (row[key] + "").indexOf("↓") > -1
        ) {
          return true;
        }
      }
      return false;
    },
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
.pa {
  margin: 0 auto;
  font-size: 20px;
  box-sizing: border-box;
  min-height: 255mm;
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
  padding-top: 10mm;
  display: flex;
  flex-direction: column;
  &-b {
    flex: 1;
  }
}
.page3 {
  width: 180mm;
  padding-top: 10mm;
  display: flex;
  flex-direction: column;
  &-b {
    flex: 1;
  }
}
.page4 {
  width: 180mm;
  padding-top: 10mm;
  display: flex;
  flex-direction: column;
  &-b {
    flex: 1;
  }
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

.mt10 {
  margin-top: 2mm;
}
.ml20 {
  margin-left: 4mm;
}
.p15 {
  padding: 3mm;
}
.pt10 {
  padding-top: 2mm;
}
.mt25 {
  margin-top: 4mm;
}
.mt50 {
  margin-top: 10mm;
}
.mb50 {
  margin-bottom: 10mm;
}
.tr {
  text-align: right;
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

// table start
.mt-table {
  width: 100%;
  table-layout: fixed;
  word-break: break-all;
  border-collapse: collapse;
  td,
  th {
    vertical-align: middle;
    height: 40px;
    padding: 8px 8px 8px 15px;
    text-align: left;
    font-size: 14px;
  }
  td {
    border-top: 1px solid #e9eaec;
  }
  th {
    background: #f8f8f9;
    border-bottom: none;
    color: #495060;
    font-weight: normal;
  }
  &:not(.dis-hover) tr:hover {
    background-color: #ebf7ff;
  }
  .mt-table-column {
    text-align: center !important;
  }
}
// table end
</style>
