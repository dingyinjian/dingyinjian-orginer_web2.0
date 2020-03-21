<template>
  <div id="veOrderList">
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
                <h3 class="card-title">店铺列表</h3>
                <div class="card-tools">

                </div>
              </div>
              <div class="card-body p-0">
                <div class="mailbox-controls">
                  <b-form inline class="placeStyle">
                    <b-form-input style="margin:5px;" v-model="form.cashier_name" placeholder="盘口名称"></b-form-input>
                    <b-form-input style="margin:5px;" v-model="form.order_no" placeholder="外部订单号"></b-form-input>
                    <b-form-input style="margin:5px;" v-model="form.order_sn" placeholder="拼多多订单号"></b-form-input>
                    <date-picker style="margin:5px;" v-model="form.one_day" value-type="format" placeholder="创建时间" format="YYYY-MM-DD"></date-picker>
                    <date-picker style="margin:5px;" v-model="form.days" value-type="format" placeholder="创建时间范围" range format="YYYY-MM-DD"></date-picker>
                    <v-select style="width:150px;margin:5px;" placeholder="拼多多订单状态" id="pdd_status" class="style-chooser" v-model="form.pdd_status" :options="statuss" label="text" :reduce="item => item.value" @input="currentPage=1;bindOrderList()"></v-select>
                    <v-select style="width:150px;margin:5px;" placeholder="付款类型" id="pay_type" class="style-chooser" v-model="form.pay_type" :options="payType" label="text" :reduce="item => item.value" @input="currentPage=1;bindOrderList()"></v-select>
                    <v-select style="width:150px;margin:5px;" placeholder="店铺" id="shops" class="style-chooser" v-model="form.mall_id" :options="shopss" label="text" :reduce="item => item.value" @input="currentPage=1;bindOrderList()"></v-select>
                    <b-button style="margin-left:10px;" variant="primary" size="sm" @click="currentPage=1;bindOrderList()">搜 索</b-button>
                    <b-button style="margin-left:10px;" variant="info" size="sm" @click="bindOrderList()">刷 新</b-button>
                  </b-form>

                </div>
                <div class="table-responsive mailbox-messages">
                  <b-table ref="selectableTable" id="my-table" hover striped bordered responsive :items="orderList" :fields="sellerFields" style="height:500px;">
                    <template v-slot:cell(notify_url)="data">
                      <b-button style="border:0px;" variant="outline-primary" size="sm" v-b-tooltip.hover :title="data.value" class="mr-1">{{data.value ?`${data.value.substr(0,15)}...`:''}}</b-button>
                    </template>
                    <template v-slot:cell(pdd_status)="data">
                      <span v-if="data.value==0">待付款</span>
                      <span v-if="data.value==1">待拼团</span>
                      <span v-if="data.value==2">待发货</span>
                      <span v-if="data.value==3">待收货</span>
                      <span v-if="data.value==4">已确认</span>
                      <span v-if="data.value==6">已退款</span>
                      <span v-if="data.value==7">已取消</span>
                    </template>
                    <template v-slot:cell(pay_type)="data">
                      <span v-if="data.value=='alipay'">支付宝</span>
                      <span v-if="data.value=='wechat'">微信</span>

                    </template>
                    <template v-slot:cell(status)="data">
                      <span v-if="data.value=='INIT'">待付款</span>
                      <span v-if="data.value=='SUCCESS'" style="color:#007bff;">付款成功</span>
                      <span v-if="data.value=='TIMEOUT'" style="color:red;">付款失败</span>
                    </template>
                    <template v-slot:cell(user_status)="data">
                      <span v-if="data.value=='OK'" style="color:#007bff">正常</span>
                      <span v-if="data.value=='EXPIRED'" style="color:red">失效</span>
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
  import { transferTime, post, limits,tips } from '@/facade'
  export default {
    name: 'veOrderList',
    data() {
      return {
        sellerFields: [
          { key: 'order_no', label: '外部订单号' },
          { key: 'order_sn', label: '拼多多订单号' },
          { key: 'mall_id', label: '店铺ID' },
          { key: 'goods_id', label: '商品ID' },
          { key: 'amount', label: '订单金额', formatter: value => (value || 0) / 100 },
          { key: 'cashier_name', label: '盘口名称' },
          { key: 'pdd_status', label: '拼多多状态' },
          { key: 'pay_type', label: '支付类型' },
          { key: 'status', label: '系统订单状态' },
          { key: 'log_dst_address', label: '发货地址' },
          { key: 'log_src_address', label: '收货地址' },
          { key: 'log_no', label: '物流单号' },
          { key: 'log_name', label: '物流名称' },
          { key: 'mall_name', label: '店铺名称' },
          { key: 'user_status', label: '买家状态' },
          { key: 'proxy', label: '代理IP' },
          { key: 'pay_time', label: '支付时间', formatter: transferTime },
          { key: 'shipping_time', label: '发货时间', formatter: transferTime },
          { key: 'receive_time', label: '收货时间', formatter: transferTime },
          { key: 'timeout_time', label: '超时时间', formatter: transferTime },
          { key: 'notify_time', label: '通知时间', formatter: transferTime },
          { key: 'notify_url', label: '通知地址' },
          { key: 'notify_num', label: '通知次数' },
          { key: 'create_time', label: '创建时间', formatter: transferTime },
        ],
        currentPage: 1,
        pages: 1,
        // perPage: 15,
        form: { limit: 10, offset: 0 },
        orderList: [],
        statuss: [
          { value: 0, text: '待付款' },
          { value: 1, text: '待拼团' },
          { value: 2, text: '待发货' },
          { value: 3, text: '待收货' },
          { value: 4, text: '已确认' },
          { value: 6, text: '已退款' },
          { value: 7, text: '已取消' },
          //   { value: 'disable', text: '关闭' },
        ],
        payType: [
          { value: 'alipay', text: '支付宝' },
          { value: 'wechat', text: '微信' },
        ],
        shopss: [],
        totals: "",
        pageLimits: limits,
      }
    },
    async created() {
      this.currentPage = this.$route.query.page ? parseInt(this.$route.query.page) : 1
      await this.bindOrderList();
      //   await this.getMall();
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
        if (this.form.days) {
          this.form.days.forEach(item => {
            if (!item) delete this.form.days
          })
        }
        this.form.offset = this.form.limit * (this.currentPage - 1);
        const data = await post('/collect/merchant/order/list', this.form);
        if (data.code == 'ok') {
          this.totals = data.result.count
          this.orderList = data.result.order_list
          this.pages = data.result.count > 0 ? Math.ceil(data.result.count / this.form.limit) : 1;
        }else{
          tips('danger',data.message)
        }
      },

      /**获取店铺 */
      //   async getMall() {
      //     const data = await post('/collect/vender/mall/list', { limit: -99,offset:-99 })
      //     if (data.code == 'ok') this.shopss = data.result.mall_list.map(item => ({ value: item.mall_id, text: item.mall_name }))
      //     else tips('error', data.message)
      //   },

    }

  }
</script>
<style scoped>

</style>