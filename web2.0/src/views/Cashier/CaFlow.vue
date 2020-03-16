<template>
  <div id="caFlow">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">流水管理</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">流水管理</li>
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
                <h3 class="card-title">流水列表</h3>
                <div class="card-tools">
                  <span>当前可用余额:<strong style="color:red;font-size:16px;">{{(balance||0)/100}}</strong> 元</span>
                </div>
              </div>
              <div class="card-body p-0">
                <div class="mailbox-controls">
                  <b-form inline class="placeStyle">
                    <v-select style="width:150px;margin-left:10px;" placeholder="类型" class="style-chooser" v-model="form.type" :options="types" label="text" :reduce="item => item.value" @input="currentPage=1;bindSerialList()"></v-select>
                    <b-button style="margin-left:10px;" variant="info" size="sm" @click="bindSerialList()">刷 新</b-button>
                  </b-form>

                </div>
                <div class="table-responsive mailbox-messages">
                  <b-table id="my-table" style="height:500px;" bordered responsive hover :items="serialList" :fields="serialFields">
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
        serialFields: [
          { key: 'type', label: '类型' }, { key: 'before', label: '变动前金额(元)', formatter: value => (value || 0) / 100 },
          { key: 'change', label: '变动金额(元)', formatter: value => (value || 0) / 100 }, { key: 'after', label: '变动后金额(元)', formatter: value => (value || 0) / 100 }, { key: 'create_time', label: '创建时间', formatter: transferTime }
        ],
        types: [
          { value: '订单收款', text: '订单收款' },
          { value: '订单手续费', text: '订单手续费' },
          { value: '提现', text: '提现' },
          { value: '充值', text: '充值' },

        ],
        currentPage: 1,
        pages: 1,
        form: {
          limit: 10,
          offset: 0
        },
        serialList: [],
        cashierId: "",
        balance: ''
      }
    },
    async created() {
      this.currentPage = this.$route.query.page ? parseInt(this.$route.query.page) : 1
      await this.getBalance()
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
        if (this.form.type == null) {
          delete this.form.type
        }
        this.form.offset = this.form.limit * (this.currentPage - 1);
        const data = await post('/collect/cashier/bill/list', this.form);
        if (data.code == 'ok') {
          this.serialList = data.result.bill_list
          this.totals = data.result.count
          this.pages = data.result.count > 0 ? Math.ceil(data.result.count / this.form.limit) : 1;
        } else {
          tips('error', data.message)
        }
      },
      /**获取余额 */
      async getBalance() {
        const data = await post('/collect/cashier/balance')
        if (data.code == 'ok') this.balance = data.result;
        else tips('danger', data.message)
      }

    }

  }
</script>
<style scoped>

</style>