<template>
  <div id="caWithdraw">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">结算记录</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">结算记录</li>
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
                <h3 class="card-title">结算列表</h3>
                <div class="card-tools">

                </div>
              </div>
              <div class="card-body p-0">
                <div class="mailbox-controls">
                  <b-form inline class="placeStyle">

                    <v-select style="width:150px;margin-left:10px;" placeholder="类型" class="style-chooser" v-model="form.status" :options="statuss" label="text" :reduce="item => item.value" @input="currentPage=1;bindSerialList()"></v-select>
                    <b-button style="margin-left:10px;" variant="info" size="sm" @click="bindSerialList()">刷 新</b-button>
                  </b-form>

                </div>
                <div class="table-responsive mailbox-messages">
                  <b-table id="my-table" style="height:500px;" bordered responsive :items="serialList" :fields="serialFields">
                    <template v-slot:cell(status)="data">
                      <span v-if="data.value=='INIT'">待确认</span>
                      <span v-if="data.value=='SUCCESS'">已确认</span>
                      <span v-if="data.value=='FAILED'">已拒绝</span>

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
    name: 'caWithdraw',
    data() {
      return {
        totals: "",
        pageLimits: limits,
        serialFields: [
          { key: 'status', label: '状态' }, { key: 'push_money', label: '提现金额(元)', formatter: value => (value || 0) / 100 },
          { key: 'get_money', label: '到账金额(元)', formatter: value => (value || 0) / 100 }, { key: 'rate_money', label: '手续费(元)', formatter: value => (value || 0) / 100 }, { key: 'create_time', label: '创建时间', formatter: transferTime }
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
          offset: 0
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
        if (this.form.status == null) {
          delete this.form.status
        }
        this.form.offset = this.form.limit * (this.currentPage - 1);
        const data = await post('/collect/cashier/settlement/list', this.form);
        if (data.code == 'ok') {
          this.serialList = data.result.bill_list
          this.totals = data.result.count
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