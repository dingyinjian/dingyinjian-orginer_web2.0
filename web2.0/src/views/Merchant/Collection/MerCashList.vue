<template>
  <div id="merVerderList">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">盘口列表</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">盘口列表</li>
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
                <h3 class="card-title">盘口列表</h3>
                <div class="card-tools">

                </div>
              </div>
              <div class="card-body p-0">
                <div class="mailbox-controls">
                  <b-form inline class="placeStyle">
                    <b-form-input style="margin:5px;" v-model="form.no" placeholder="商户号"></b-form-input>
                    <b-form-input style="margin:5px;" v-model="form.name" placeholder="商户名称"></b-form-input>

                    <v-select style="width:150px;margin:5px;" placeholder="状态" id="type" class="style-chooser" v-model="form.status" :options="statuss" label="text" :reduce="item => item.value" @input="currentPage=1;BindData()"></v-select>
                    <b-button style="margin-left:10px;" variant="primary" size="sm" @click="currentPage=1;BindData()">搜 索</b-button>
                    <b-button style="margin-left:10px;" variant="info" size="sm" @click="BindData()">刷 新</b-button>
                  </b-form>

                </div>
                <div class="table-responsive mailbox-messages">
                  <b-table ref="selectableTable" id="my-table" hover bordered responsive :items="orderList" :fields="sellerFields" style="height:500px;">
                    <template v-slot:cell(notify_url)="data">
                      <span v-b-tooltip.hover :title="data.value" placement="bottom" class="mr-1">{{data.value ?`${data.value.substr(0,10)}...`:''}}</span>
                    </template>
                    <template v-slot:cell(status)="data">
                      <span v-if="data.value=='normal'" style="color:#007bff">正常</span>
                      <span v-if="data.value=='locked '" style="color:red">锁住</span>
                    </template>
                    <template v-slot:cell(enabled)="data">
                      <span v-if="data.value==1" style="color:#007bff">启用</span>
                      <span v-if="data.value==0" style="color:red">停止</span>
                      <!-- <b-form-checkbox v-model="data.value" name="check-button" value="1" unchecked-value="0" switch></b-form-checkbox> -->
                    </template>

                    <template v-slot:cell(action)="row">
                      <div style="display:flex;justify-content: center;">
                        <b-button size="sm" variant="primary" @click="updateForm=true;update(row.item, row.index, $event.target)" class="mr-1">编辑</b-button>
                        <b-button size="sm" variant="info" @click="addAccount=true;memberId=row.item.id" class="mr-1">添加余额</b-button>
                        <b-button size="sm" variant="primary" @click="relateVerder(row.item, row.index, $event.target)" class="mr-1">关联码商</b-button>

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
        <div class="row">
          <b-modal centered v-model="updateForm" title="编辑" @hidden="changeForm={}" @ok="updateOk" no-close-on-backdrop>
            <b-form ref="formValid" validated>
              <div class="row">
                <div class="col-md-12">
                  <b-form-group id="input-group-4" label="名称:" label-for="uname">
                    <b-form-input id="name" v-model="changeForm.name" required></b-form-input>
                  </b-form-group>
                </div>

                <div class="col-md-12">
                  <b-form-group id="input-group-1" label="白名单:" label-for="white_list">
                    <b-form-input id="white_list" v-model="changeForm.ip_white_list"></b-form-input>
                  </b-form-group>
                </div>
                <div class="col-md-12">
                  <b-form-group id="input-group-7" label="通知地址" label-for="notify_url">
                    <b-form-input id="notify_url" v-model="changeForm.notify_url"></b-form-input>
                  </b-form-group>
                </div>
                <div class="col-md-12">
                  <b-form-group id="input-group-9" label="收款费率(‰)" label-for="collectRate">
                    <b-form-input id="collectRate" type="number" v-model="changeForm.collect_rate"></b-form-input>
                  </b-form-group>
                </div>
                <div class="col-md-12">
                  <b-form-group id="input-group-9" label="代收费率(‰)" label-for="payRate">
                    <b-form-input id="payRate" type="number" v-model="changeForm.pay_rate"></b-form-input>
                  </b-form-group>
                </div>
                <div class="col-md-12">
                  <b-form-group id="input-group-10" label="代付浮动金额(分)" label-for="float">
                    <b-form-input id="float" type="number" v-model="changeForm.float"></b-form-input>
                  </b-form-group>
                </div>
                <div class="col-md-12">
                  <b-form-group id="input-group-8" label="状态" label-for="type">
                    <b-form-select placeholder="状态" id="type" class="style-chooser" v-model="changeForm.status" :options="statuss" label="text" :reduce="item => item.value"></b-form-select>
                  </b-form-group>
                </div>

              </div>
            </b-form>
            <span slot="modal-cancel">取消</span>
            <span slot="modal-ok">确定</span>
          </b-modal>
        </div>
        <div class="row">
          <b-modal centered v-model="addAccount" title="添加余额" @hidden="money=''" @ok="addOk" no-close-on-backdrop>
            <b-form ref="addValid" validated>
              <div class="row">
                <div class="col-md-12">
                  <b-form-group id="input-group-4" label="余额(元):" label-for="money">
                    <b-form-input id="money" type="number" v-model="money" required></b-form-input>
                  </b-form-group>
                </div>
              </div>
            </b-form>
            <span slot="modal-cancel">取消</span>
            <span slot="modal-ok">确定</span>
          </b-modal>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { transferTime, post, limits, tips } from '@/facade'
  export default {
    name: 'merVerderList',
    data() {
      return {
        sellerFields: [
          { key: 'name', label: '盘口名称' }, { key: 'no', label: '商户号' }, { key: 'key', label: '密钥' },
          { key: 'collect_rate', label: '收款费率(‰)' },
          { key: 'pay_rate', label: '代收费率(‰)' },
          { key: 'float', label: '代付浮动金额(分)' },
          { key: 'money', label: '余额(元)', formatter: value => (value || 0) / 100 },
          { key: 'ip_white_list', label: '白名单' },
          { key: 'status', label: '状态' },
          { key: 'enabled', label: '是否启用' },
          { key: 'notify_url', label: '通知地址' },
          { key: 'create_time', label: '创建时间', formatter: transferTime },
          { key: 'action', label: '操作' }
        ],
        currentPage: 1,
        pages: 1,
        // perPage: 15,
        totals: '',
        form: { limit: 10, offset: 0 },
        orderList: [],
        pageLimits: limits,
        types: [
          { value: 'YSF', text: '云闪付' },
          { value: 'PDD', text: '拼多多' },
        ],
        statuss: [
          { value: 'normal', text: '正常' },
          { value: 'locked ', text: '锁住' },
        ],
        updateForm: false,
        changeForm: {},
        duibiForm: {},
        addAccount: false,
        money: '',
        member_id: ""
      }
    },
    async created() {
      this.currentPage = this.$route.query.page ? parseInt(this.$route.query.page) : 1
      await this.BindData();
      //   await this.getMall();
    },
    methods: {
      linkGen(pageNum) {
        return pageNum === 1 ? '?' : `?page=${pageNum}`
      },
      async pageChange(val) {
        this.currentPage = val;
        await this.BindData();
      },
      /**每页显示条数变化 */
      async limitChange(e) {
        this.form.limit = e;
        this.currentPage = 1;
        this.BindData();
      },
      /**获取数据列表 */
      async BindData() {
        for (let item in this.form) {
          if (!this.form[item]) {
            delete this.form[item]
          }
        }
        this.form.offset = this.form.limit * (this.currentPage - 1);
        const data = await post('/collect/merchant/cashier/list', this.form);
        if (data.code == 'ok') {
          this.orderList = data.result.cashier_list;
          this.pages = data.result.count > 0 ? Math.ceil(data.result.count / this.form.limit) : 1;
          this.totals = data.result.count;
        } else {
          tips('danger', data.message)
        }
      },


      /**更新密钥 */
      async updateSecret(item) {
        const form = { id: item.id, secret: true }
        const data = await post("/pay/merchant/cashier/update", form);
        console.log(data);
        if (data.code == 'ok') {
          this.BindData();
          tips('success', '更新成功')
        } else {
          tips('error', data.message)
        }
      },
      /*编辑*/
      async update(item) {
        this.changeForm = Object.assign({}, item);
        this.duibiForm = Object.assign({}, item);
      },
      updateOk() {
        const valid = this.$refs.formValid.checkValidity()
        if (valid) {
          const formdata = this.duibi();
          if (Object.keys(formdata).length === 0) {
            tips("danger", "没做任何修改");
          } else {
            formdata.id = this.changeForm.id;
            this.infoUpdate(formdata);
          }
        }

      },
      async infoUpdate(e) {
        const form = e;
        // if(this.money)  form.money=e.money*100;
        if (form.pay_rate) form.pay_rate = parseInt(form.pay_rate)
        if (form.collect_rate) form.collect_rate = parseInt(form.collect_rate)
        if (form.float) form.float = parseInt(form.float)

        const data = await post("/collect/merchant/cashier/update", form);
        if (data.code == "ok") {
          await this.BindData();
          tips("success", "修改成功");
          this.updateForm = false;
        } else {
          tips("error", data.message);
        }
      },
      duibi() {
        const c = {};
        // if(this.money) this.changeForm.money=this.money*100;
        for (let key in this.changeForm) {
          if (this.changeForm[key] != this.duibiForm[key]) {
            c[key] = this.changeForm[key];
          }
        }
        console.log(c);
        return c;
      },
      /**确认添加余额 */
      async addOk() {
        const valid = this.$refs.addValid.checkValidity()
        if (valid) {
          this.addPost()
        }
      },
      /**添加余额 */
      async addPost() {
        console.log(this.money)
        const changeMoney=parseInt(this.money)*100;
        const value = await this.$bvModal.msgBoxConfirm("即将添加余额,是否继续?", { buttonSize: 'sm', okVariant: 'success', cancelVariant: 'danger', okTitle: '确认', cancelTitle: '取消', hideHeaderClose: true, centered: true, noCloseOnBackdrop: true });
        if (value) {
          const form = { change:changeMoney, member_id: this.memberId }
          const data = await post('/collect/merchant/bill/dev/add', form)
          if (data.code == 'ok') {
            this.BindData()
            tips('success', '添加成功')
          } else {
            tips('danger', data.message)
          }
        }
      },
      /**关联码商 */
      relateVerder(item) {
        this.$router.push({ path: '/venderlist', query: { id: item.id } })
      }

    }

  }
</script>
<style scoped>

</style>