<template>
  <div id="caYsfList">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">订单列表</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">订单列表</li>
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
                 
                    <b-form-input style="margin:5px;" v-model="form.transfer_no" placeholder="系统流水单号"></b-form-input>
                    <b-form-input style="margin:5px;" v-model="form.serial" placeholder="手机编码"></b-form-input>
                    <b-form-input style="margin:5px;" v-model="form.order_no" placeholder="外部订单号"></b-form-input>
                
                    <date-picker style="margin:5px;" v-model="form.one_day" value-type="format" placeholder="创建时间" format="YYYY-MM-DD"></date-picker>
                    <date-picker style="margin:5px;" v-model="form.days" value-type="format" placeholder="创建时间范围" range format="YYYY-MM-DD"></date-picker>
                    <v-select style="width:150px;margin-left:10px;" placeholder="类型" class="style-chooser" v-model="form.status" :options="statuss" label="text" :reduce="item => item.value" @input="currentPage=1;bindOrderList()"></v-select>
                    <b-button style="margin-left:10px;" variant="primary" size="sm" @click="currentPage=1;bindOrderList()">搜 索</b-button>
                    <b-button style="margin-left:10px;" variant="info" size="sm" @click="bindOrderList()">刷 新</b-button>
                  </b-form>

                </div>
                <div class="table-responsive mailbox-messages">
                  <b-table id="my-table" style="height:500px;" bordered responsive :items="serialList" :fields="serialFields">
                    <template v-slot:cell(pay_url)="data">
                      <span style="cursor:pointer;color:#047bfe;" v-b-tooltip.hover :title="data.value" class="mr-1">{{data.value ?`${data.value.substr(0,10)}...`:''}}</span>
                    </template>
                    <template v-slot:cell(notify_url)="data">
                      <span style="cursor:pointer;color:#047bfe;" v-b-tooltip.hover :title="data.value" class="mr-1">{{data.value ?`${data.value.substr(0,10)}...`:''}}</span>
                    </template>
                    <template v-slot:cell(status)="data">
                      <span v-if="data.value=='INIT'">待付款</span>
                      <span v-if="data.value=='SUCCESS'" style="color:#007bff;">付款成功</span>
                      <span v-if="data.value=='TIMEOUT'" style="color:red;">付款超时</span>
                      <span v-if="data.value=='FAILD'" style="color:red;">付款失败</span>
                      
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
    name: 'caYsfList',
    data() {
      return {
        pageLimits: limits,
        totals: "",
        serialFields: [
         { key: 'transfer_no', label: '系统流水单号' },
          { key: 'amount', label: '实付金额(元)', formatter: value => (value || 0) / 100 },
          { key: 'serial', label: '手机编码' }, { key: 'order_no', label: '外部订单号' }, { key: 'status', label: '状态' },
          { key: 'pay_url', label: '支付链接' }, { key: 'price', label: '订单金额(元)', formatter: value => (value || 0) / 100 },
          { key: 'timeout_time', label: '超时时间', formatter: transferTime },
          { key: 'notify_url', label: '通知地址' },
          { key: 'notify_num', label: '通知次数' },
          { key: 'notify_time', label: '通知时间', formatter: transferTime },
          { key: 'pay_time', label: '支付时间', formatter: transferTime },
          { key: 'create_time', label: '创建时间', formatter: transferTime },
        ],
        statuss: [
          { value: 'INIT', text: '待确认' },
          { value: 'SUCCESS', text: '已确认' },
          { value: 'TIMEOUT', text: '已超时' },
          { value: 'FAILD', text: '失败' },
        ],
        currentPage: 1,
        pages: 1,
        form: {
          limit: 10,
          offset: 0
        },
        serialList: [],
        cashierId: "",
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
          if ((!this.form[item] && this.form[item] != 0)||this.form[item]=='') {
            delete this.form[item]
          }
        }
        if (this.form.days) {
          this.form.days.forEach(item => {
            if (!item) delete this.form.days
          })
        }
        this.form.offset = this.form.limit * (this.currentPage - 1);
        const data = await post('/collect/cashier/order/ysf/list', this.form);
        console.log(data)
        if (data.code == 'ok') {
          this.totals = data.result.count
          this.serialList = data.result.order_list
          this.pages = data.result.count > 0 ? Math.ceil(data.result.count / this.form.limit) : 1;
        } else {
          tips('danger', data.message)
        }
      },
      /**拒绝或确认 */
      async update(item, deplay) {
        const value = await this.$bvModal.msgBoxConfirm("即将确认/拒绝,是否继续?", { buttonSize: 'sm', okVariant: 'success', cancelVariant: 'danger', okTitle: '确认', cancelTitle: '取消', hideHeaderClose: true, centered: true, noCloseOnBackdrop: true });
        if (value) {
          const form = {
            id: item.id,
            status: deplay
          }
          const data = await post('/collect/merchant/settlement/check', form)
          if (data.code == 'ok') {
            this.bindOrderList()
            tips('success', '操作成功')
          } else {
            tips('danger', data.message)
          }
        }

      },

    }

  }
</script>
<style scoped>

</style>