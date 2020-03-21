<template>
  <div id="buyerMgmt">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">小号列表</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">小号列表</li>
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
                <h3 class="card-title">小号列表</h3>
                <div class="card-tools">
                  <b-form inline class="placeStyle">
                  <b-button variant="primary" size="sm" @click="modal_add = true">添 加</b-button>
                  <b-button variant="primary" style="margin-left:10px;" size="sm" @click="clearBuyer()">一键清理小号</b-button>
                  <b-button style="margin-left:10px;" variant="info" size="sm" @click="bindBuyerList()">刷 新</b-button>          
                  <b-button style="margin-left:10px;" size="sm" variant="danger" class="mr-1" @click="del()">批量删除小号</b-button>
                  </b-form>
                </div>
              </div>
              <div class="card-body p-0">
                <!-- <div class="mailbox-controls">                 
                </div> -->
                <div class="table-responsive mailbox-messages">
                  <b-table bordered responsive hover  :items="buyerList" :fields="buyerFields" selectable select-mode="multi" @row-selected="onRowSelected">
                    <template v-slot:cell(checkItem)="{ rowSelected }">
                      <b-form-group>
                        <template v-if="rowSelected">
                          <span aria-hidden="true">&check;</span>
                          <span class="sr-only">Selected</span>
                        </template>
                        <template v-else>
                          <i class="far fa-circle nav-icon" aria-hidden="true" style="color:#999;"></i>
                        </template>
                      </b-form-group>
                    </template>
                    <template v-slot:cell(status)="data">
                      <span v-if="data.value=='OK'" style="color:#007bff;">正常</span>
                      <span v-if="data.value=='NOADDR'">没有设置地址</span>
                      <span v-if="data.value=='EXPIRED'" style="color:red">失效</span>
                    </template>
                    <template v-slot:cell(access_token)="data">
                      <span style="cursor:pointer;color:#047bfe;" v-b-tooltip.hover :title="data.value" class="mr-1">{{data.value ?`${data.value.substr(0,10)}...`:''}}</span>
                    </template>
                    <template v-slot:cell(address)="data">
                      <span style="cursor:pointer;color:#047bfe;" v-b-tooltip.hover :title="data.value" class="mr-1">{{data.value ?`${data.value.substr(0,10)}...`:''}}</span>
                    </template>
                    <template v-slot:cell(enabled)="data">
                      <b-form-checkbox v-model="data.value" name="check-button" value="1" unchecked-value="0" :disabled="data.item.status!='OK'&&data.value==0?true:false" @change="checkUpdate(data.value,data.item.id,data.item.mch_id)" switch></b-form-checkbox>
                    </template>

                    <template v-slot:cell(action)="row">
                      <div style="display:flex;justify-content: center;">
                        <!-- <b-button size="sm" variant="primary" @click="updateForm=true;update(row.item, row.index, $event.target)" class="mr-1">编辑</b-button> -->
                        <b-button size="sm" variant="info" class="mr-1" @click="orderList(row.item, row.index, $event.target)">订单列表</b-button>
                        <b-button size="sm" variant="primary" class="mr-1" @click="openUrl(row.item, row.index, $event.target)">查看</b-button>
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
          <b-modal centered v-model="modal_add" title="添加" @hidden="smallList=''" @ok="addOk" no-close-on-backdrop>
            <b-form ref="buyerFormValid" validated>
              <div class="row">
                <div class="col-md-12">
                  <b-form-group label="批量输入小号:" label-for="access_token" invalid-feedback="不能为空">
                    <b-form-textarea rows="3" id="access_token" v-model="smallList" required @change='test'></b-form-textarea>
                    <b-form-text id="input-live-help">批量输入小号每行一条，格式:phone,user_id,access_token</b-form-text>
                  </b-form-group>
                </div>
              </div>
            </b-form>
            <span slot="modal-cancel">取消</span>
            <span slot="modal-ok">确定</span>
          </b-modal>
        </div>
        <div class="row">
          <b-modal centered v-model="updateForm" title="编辑" @hidden="editeForm={}" @ok="updateOk" no-close-on-backdrop>
            <b-form>
              <div class="row">
                <div class="col-md-12">
                  <b-form-group label="状态:" label-for="status">
                    <b-form-select v-model="editeForm.status" :options="statuss" size="sm"></b-form-select>
                    <!-- <v-select id="status" class="style-chooser" v-model="editeForm.status" :options="statuss" label="text" :reduce="item => item.value"></v-select> -->
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
  import { transferTime, post, tips, limits } from '@/facade'
  export default {
    name: 'buyerMgmt',
    data() {
      return {
        buyerFields: [
          { key: 'checkItem', label: '' },
          { key: 'account', label: '账号' }, { key: 'user_id', label: 'user_id' }, { key: 'access_token', label: 'access_token' },
          { key: 'address', label: '收货地址' },
          // { key: 'unreceived_count', label: '未收货订单数' }, { key: 'unreceive_count', label: '待收货单数' },
          { key: 'status', label: '状态' }, { key: 'enabled', label: '启停' },
          { key: 'create_time', label: '创建时间', formatter: transferTime }, { key: 'action', label: '操作' }
        ],
        buyerList: [],
        currentPage: 1,
        form: { limit: 10, offset: 0 },
        pages: 1,
        pageLimits: limits,
        totals: 0,
        smallList: "",
        modal_add: false,
        updateForm: false,
        statuss: [
          { value: 'OK', text: 'OK' },
          { value: 'EXPIRED', text: '失效' },
        ],
        editeForm: {},
        duibiForm: {},
        ids: []
      }
    },
    async created() {
      this.currentPage = this.$route.query.pages ? this.$route.query.pages : 1
      await this.bindBuyerList()
    },
    methods: {
      /**表格选择 */
      onRowSelected(items) {
        this.ids = items.map(item => item.id);
      },
      /**分页 */
      linkGen(pageNum) {
        return pageNum === 1 ? '?' : `?page=${pageNum}`
      },
      async pageChange(val) {
        this.currentPage = val;
        await this.bindBuyerList();
      },
      /**每页显示条数变化 */
      async limitChange(e) {
        this.form.limit = e;
        this.currentPage = 1;
        this.bindBuyerList();
      },
      /**获取小号列表 */
      async bindBuyerList() {
        this.form.offset = this.form.limit * (this.currentPage - 1);
        const data = await post('/collect/vender/buyer/list', this.form);
        if (data.code == 'ok') {
          console.log(data)
          this.totals = data.result.count;
          this.buyerList = data.result.buyer_list
          this.pages = data.result.count > 0 ? Math.ceil(data.result.count / this.form.limit) : 1;
        } else {
          tips('danger', data.message)
        }
      },
      /**添加小号 */
      async addOk(bvModalEvt) {
        bvModalEvt.preventDefault()
        const valid = this.$refs.buyerFormValid.checkValidity()
        if (valid) {
          const buyerList = this.test(this.smallList)
          const data = await post('/collect/vender/buyer/add', { buyer_list: buyerList })
          if (data.code == 'ok') {
            tips('success', '添加成功')
            this.modal_add = false;
            this.bindBuyerList();
          } else {
            tips('danger', data.message)
          }
        } else {
          return;
        }
      },
      /**批量添加小号数据处理 */
      test(line) {
        const lines = line.split('\n').map(l => l.trim()).filter(l => l).map(l => l.split(/[\s-_,|]/g).map(i => i.trim()).filter(i => i)).map(item => ({ 'account': item[0], 'pdd_user_id': item[1], 'access_token': item[2] }))
        return lines
      },
      /**编辑 */
      update(item) {
        this.editeForm = Object.assign({}, item);
        this.duibiForm = Object.assign({}, item);
      },
      /**编辑确认 */
      updateOk() {
        const formdata = this.duibi();
        if (Object.keys(formdata).length === 0) {
          tips("danger", "没做任何修改");
        } else {
          formdata.id = this.editeForm.id;
          formdata.mch_id = this.editeForm.mch_id;
          this.infoUpdate(formdata);
        }
      },
      duibi() {
        const c = {};
        for (let key in this.editeForm) {
          if (this.editeForm[key] != this.duibiForm[key]) {
            c[key] = this.editeForm[key];
          }
        }
        return c;
      },
      /**删除小号 */
      async del() {
        const value = await this.$bvModal.msgBoxConfirm("即将删除,是否继续?", { buttonSize: 'sm', okVariant: 'success', cancelVariant: 'danger', okTitle: '确认', cancelTitle: '取消', hideHeaderClose: true, centered: true, noCloseOnBackdrop: true });
        if (value) {
          const form = { ids: this.ids }
          const data = await post('/collect/vender/buyer/del', form)
          if (data.code == 'ok') {
            tips('success', '删除成功');
            this.ids = [];
            this.bindBuyerList();
          } else { tips('danger', data.message) }
        }
      },
      /**打开拼多多个人中心 */
      async openUrl(item) {
        if (window.open_window) {
          window.open_window({ pdd_user_id: item.user_id, access_token: item.access_token }, 'https://mobile.yangkeduo.com/personal.html')
        } else {
          tips('warning', '非插件环境无法查看')
        }
      },
      /**一键清理小号 */
      async clearBuyer() {
        const data = await post('/collect/vender/buyer/del/all')
        if (data.code == 'ok') {
          tips('success', '清理完成')
        } else {
          tips('danger', data.message)
        }
      }

    }

  }
</script>
<style scoped>

</style>