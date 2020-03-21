<template>
  <div id="merFounds">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">资金管理</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">资金管理</li>
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
                <h3 class="card-title">资金提现列表</h3>
                <div class="card-tools">

                </div>
              </div>
              <div class="card-body p-0">
                <div class="mailbox-controls">
                  <b-form inline class="placeStyle">
                    <!-- <date-picker style="margin:5px;" v-model="form.one_day" value-type="format" placeholder="创建时间" format="YYYY-MM-DD"></date-picker>
                    <date-picker style="margin:5px;" v-model="form.days" value-type="format" placeholder="创建时间范围" range format="YYYY-MM-DD"></date-picker>
                    <v-select style="width:150px;margin-left:10px;" placeholder="类型" class="style-chooser" v-model="form.status" :options="statuss" label="text" :reduce="item => item.value" @input="form.limit=15;currentPage=1;bindSerialList()"></v-select>
                    <b-button style="margin-left:10px;" variant="primary" size="sm" @click="currentPage=1;bindSerialList()">搜 索</b-button> -->
                    <b-button style="margin-left:10px;" variant="info" size="sm" @click="bindSerialList()">刷 新</b-button>
                  </b-form>

                </div>
                <div class="table-responsive mailbox-messages">
                  <b-table id="my-table" style="height:500px;" bordered responsive :items="serialList" :fields="serialFields">
                    <template v-slot:cell(status)="data">
                      <span v-if="data.value=='INIT'">待确认</span>
                      <span v-if="data.value=='SUCCESS'" style="color:#007bff">已确认</span>
                      <span v-if="data.value=='FAILED'" style="color:red">已拒绝</span>

                    </template>
                    <template v-slot:cell(demain)="data">
                      <b-button style="border:0px;" variant="outline-primary" size="sm" v-b-tooltip.hover :title="data.value" class="mr-1">{{data.value ?`${data.value.substr(0,10)}...`:''}}</b-button>
                    </template>
                    <template v-slot:cell(action)="row">
                      <div style="display:flex;justify-content: left;">
                        <b-button size="sm" variant="primary" v-if="row.item.status=='INIT'" @click="update(row.item,'SUCCESS')" class="mr-1">确认</b-button>
                        <b-button size="sm" variant="danger" v-if="row.item.status=='INIT'" @click="update(row.item, 'FAILED')" class="mr-1">拒绝</b-button>


                      </div>
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
    name: 'merFounds',
    data() {
      return {
        pageLimits: limits,
        totals: "",
        serialFields: [
          { key: 'type', label: '类型' },
          { key: 'bill', label: '可提现余额(元)', formatter: value => (value || 0) / 100 },
          { key: 'name', label: '名称' }, { key: 'phone', label: '手机' }, { name: 'bank_name', label: '开户行' }, { name: 'bank_code', label: '银行卡号' },
          { key: 'status', label: '状态' }, { key: 'push_money', label: '提现金额(元)', formatter: value => (value || 0) / 100 },
          { key: 'get_money', label: '到账金额(元)', formatter: value => (value || 0) / 100 },
          { key: 'rate_money', label: '手续费(元)', formatter: value => (value || 0) / 100 },
          { key: "demain", label: '备注' },
          { key: 'create_time', label: '创建时间', formatter: transferTime },
          { key: 'action', label: '操作' }
        ],
        statuss: [
          { value: 'INIT', text: '待确认' },
          { value: 'SUCCESS', text: '已确认' },
          { value: 'FAILED', text: '拒绝' },
        ],
        currentPage: 1,
        pages: 1,
        form: {
          limit: 10,
          offset: 0,
          status:'INIT'
        },
        serialList: [],
        cashierId: "",
      }
    },
    async created() {
      this.currentPage = this.$route.query.page ? parseInt(this.$route.query.page) : 1
      await this.bindSerialList();
    },
    methods: {
      linkGen(pageNum) {
        return pageNum === 1 ? '?' : `?page=${pageNum}`
      },
      async pageChange(val) {
        this.currentPage = val;
        await this.bindSerialList();
      },
      /**每页显示条数变化 */
      async limitChange(e) {
        this.form.limit = e;
        this.currentPage = 1;
        this.bindSerialList();
      },
      /**获取列表 */
      async bindSerialList() {

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
        const data = await post('/collect/merchant/settlement/list', this.form);
        console.log(data)
        if (data.code == 'ok') {
          this.totals = data.result.count
          this.serialList = data.result.bill_list
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
            this.bindSerialList()
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