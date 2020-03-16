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
                    <b-form-input style="width:150px;margin-left:10px;" placeholder="外部订单号" v-model="form.no"></b-form-input>
                    <v-select style="width:150px;margin-left:10px;" placeholder="支付类型" class="style-chooser" v-model="form.pay_type" :options="payTypes" label="text" :reduce="item => item.value" @input="currentPage=1;bindOrderList()"></v-select>
                    <v-select style="width:150px;margin-left:10px;" placeholder="订单状态" class="style-chooser" v-model="form.status" :options="statuss" label="text" :reduce="item => item.value" @input="currentPage=1;bindOrderList()"></v-select>
                    <b-button style="margin-left:10px;" variant="primary" size="sm" @click="search()">搜 索</b-button>
                    <b-button style="margin-left:10px;" variant="info" size="sm" @click="bindOrderList()">刷 新</b-button>
                  </b-form>

                </div>
                <div class="table-responsive mailbox-messages">
                  <b-table id="my-table" bordered responsive :items="orderList" :fields="orderFields">
                    <template v-slot:cell(status)="data">
                      <span v-if="data.value=='TIMEOUT'" style="color:red;">超时</span>
                      <span v-if="data.value=='INIT'">初始化</span>
                      <span v-if="data.value=='SUCCESS'" style="color:#007bff;">成功</span>

                    </template>
                    <template v-slot:cell(pay_type)="data">
                      <span v-if="data.value=='alipay'">支付宝</span>
                      <span v-if="data.value=='wechat'">微信</span>

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
          { key: 'order_no', label: '外部订单号' }, { key: 'pay_type', label: '支付方式' },
          { key: 'amount', label: '金额(元)', formatter: value => (value || 0) / 100 }, { key: 'status', label: '状态' }, { key: 'pay_time', label: '支付时间', formatter: transferTime },
          { key: 'notify_time', label: '通知时间', formatter: transferTime }, { key: 'create_time', label: '创建时间', formatter: transferTime }
        ],
        payTypes: [
          { value: 'alipay', text: '支付宝' },
          { value: 'wechat', text: '微信' },
        ],
        statuss: [
          { value: 'INIT', text: '初始化' },
          { value: 'SUCCESS', text: '成功' },
          { value: 'TIMEOUT', text: '超时' },

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
          if (!this.form[item] && this.form[item] != 0) {
            delete this.form[item]
          }
        }
        this.form.offset = this.form.limit * (this.currentPage - 1);
        const data = await post('/collect/cashier/order/list', this.form);
        if (data.code == 'ok') {
          this.orderList = data.result.order_list;
          this.totals=data.result.count;
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