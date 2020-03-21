<template>
  <div id="caFlow">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">订单管理</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">订单管理</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
    <div class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12">
            <div class="card card-primary card-outline">
              <div class="card-header">
                <h3 class="card-title">订单列表</h3>
                <div class="card-tools">

                </div>
              </div>
              <div class="card-body p-0">
                <div class="mailbox-controls">
                  <b-form inline class="placeStyle">
                    <b-form-input style="margin:5px;" v-model="form.to_card_owner" placeholder="收款人"></b-form-input>
                    <b-form-input style="margin:5px;" v-model="form.to_card_no" placeholder="收款卡号"></b-form-input>
                    <b-form-input style="margin:5px;" v-model="form.to_phone" placeholder="收款手机"></b-form-input>
                    <b-form-input style="margin:5px;" v-model="form.to_idcard" placeholder="收款人身份证"></b-form-input>
                    <b-form-input style="margin:5px;" v-model="form.order_no" placeholder="外部订单号"></b-form-input>

                    <b-form-input style="margin:5px;" v-model="form.to_phone" placeholder="收款手机"></b-form-input>
                    <v-select style="width:150px;margin-left:10px;" placeholder="类型" class="style-chooser" v-model="form.status" :options="statuss" label="text" :reduce="item => item.value" @input="currentPage=1;bindOrderList()"></v-select>
                    <date-picker style="margin:5px;" v-model="form.one_day" value-type="format" placeholder="创建时间" format="YYYY-MM-DD"></date-picker>
                    <date-picker style="margin:5px;" v-model="form.days" value-type="format" placeholder="创建时间范围" range format="YYYY-MM-DD"></date-picker>

                    <b-button style="margin-left:10px;" variant="primary" size="sm" @click="currentPage=1;bindOrderList()">搜 索</b-button>
                    <b-button style="margin-left:10px;" variant="info" size="sm" @click="bindOrderList()">刷 新</b-button>
                  </b-form>

                </div>
                <div class="table-responsive mailbox-messages">
                  <b-table id="my-table" bordered responsive :items="orderList" :fields="orderFields">
                    <template v-slot:cell(status)="data">
                      <span v-if="data.value=='TIMEOUT'" style="color:red;">超时</span>
                      <span v-if="data.value=='INIT'">初始化</span>
                      <span v-if="data.value=='PAYING'">支付中</span>
                      <span v-if="data.value=='SUCCESS'" style="color:#007bff;">成功</span>
                      <span v-if="data.value=='FAILED'" style="color:red;">失败</span>
                    </template>
                  </b-table>
                </div>
                <!-- /.mail-box-messages -->
              </div>
              <!-- /.card-body -->
              <div class="card-footer p-0">
                <div class="row">
                  <div class="col-md-9">
                    <div style="display:flex;justify-content:flex-start">
                      <b-pagination-nav v-model="currentPage" :link-gen="linkGen" :number-of-pages="pages" @change="pageChange" no-page-detect use-router></b-pagination-nav>
                      <b-form-select style="width:150px;margin:0 10px;" class="style-chooser" v-model="form.limit" :options="pageLimits" label="text" :reduce="item => item.value" @input="limitChange"></b-form-select>
                    </div>
                  </div>
                  <div class="col-md-3" style="text-align:right;">
                    <span style="line-height:40px;margin:0 10px;">共{{totals||0}}条</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
  import { transferTime, post, tips, limits } from '@/facade'
  export default {
    name: 'caFlow',
    data() {
      return {
        totals: "",
        pageLimits: limits,
        orderFields: [
          { key: 'transfer_no', label: '系统订单号' },
          { key: 'order_no', label: '外部订单号' }, { key: 'to_card_owner', label: '收款人', formatter: value => `${value.substr(0,1)}**` },
          { key: 'to_card_no', label: '收款卡号', formatter: value => `${value.substr(0,4)}***${value.substr(value.length-4,value.length)}` }, { key: 'to_card_bank', label: '收款银行' },
          { key: 'to_phone', label: '收款人手机', formatter: value => `${value.substr(0,3)}***${value.substr(value.length-4,value.length)}` },
          { key: 'to_idcard', label: '收款人身份证', formatter: value => `${value.substr(0,3)}***${value.substr(value.length-4,value.length)}` },
          { key: 'amount', label: '金额(元)', formatter: value => (value || 0) / 100 }, { key: 'status', label: '状态' },
          { key: 'notify_url', label: '通知地址' },
          { key: 'notify_num', label: '通知次数' },
          { key: 'note', label: '备注' },
          { key: 'pay_time', label: '支付时间', formatter: transferTime },
          { key: 'notify_time', label: '通知时间', formatter: transferTime }, { key: 'create_time', label: '创建时间', formatter: transferTime }
        ],

        statuss: [
          { value: 'INIT', text: '初始化' },
          { value: 'PAYING', text: '支付中' },
          { value: 'SUCCESS', text: '成功' },
          { value: 'TIMEOUT', text: '超时' },
          { value: 'FAILED', text: '失败' },
        ],
        currentPage: 1,
        pages: 1,
        perPage: 10,
        form: {
          limit: 10,
          offset: 0
        },
        orderList: [],
      }
    },
    async created() {
      this.currentPage = this.$route.query.page ? parseInt(this.$route.query.page) : 1
      await this.bindOrderList();
    },
    methods: {
      linkGen(pageNum) {
        return pageNum === 1 ? '?' : `?page=${pageNum}`
      },
      async pageChange(val) {
        this.currentPage = val;
        await this.bindOrderList();
      },
      /**每页显示条数变化 */
      async limitChange(e) {
        this.form.limit = e;
        this.currentPage = 1;
        this.bindOrderList();
      },
      /**获取列表 */
      async bindOrderList() {
        for (let item in this.form) {
          if (!this.form[item]) {
            delete this.form[item]
          }
        }
        if (this.form.days) {
          this.form.days.forEach(item => {
            if (!item) delete this.form.days
          })
        }
        this.form.offset = this.form.limit * (this.currentPage - 1);
        const data = await post('/pay/cashier/pay/list', this.form);
        if (data.code == 'ok') {
          this.orderList = data.result.pay_list;
          this.totals = data.result.count;
          this.pages = data.result.count > 0 ? Math.ceil(data.result.count / this.form.limit) : 1;
        } else {
          tips('error', data.message)
        }
      },



    }

  }
</script>
<style scoped>

</style>