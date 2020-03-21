<template>
  <div id="merVerderList">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">盘口关联码商</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">盘口关联码商</li>
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
                <h3 class="card-title">盘口关联码商列表</h3>
                <div class="card-tools">

                </div>
              </div>
              <div class="card-body p-0">
                <div class="mailbox-controls">
                  <b-form inline class="placeStyle">
                    <b-form-input style="margin:5px;" v-model="form.vender_name" placeholder="码商名称"></b-form-input>
                    <v-select style="width:150px;margin:5px;" placeholder="通道类型" id="type" class="style-chooser" v-model="form.type" :options="types" label="text" :reduce="item => item.value" @input="currentPage=1;BindData()"></v-select>
                    <b-button style="margin-left:10px;" variant="primary" size="sm" @click="currentPage=1;BindData()">搜 索</b-button>
                    <b-button style="margin-left:10px;" variant="primary" size="sm" @click="addVender=true;">添 加</b-button>

                    <b-button style="margin-left:10px;" variant="info" size="sm" @click="$router.go(-1)">返回</b-button>
                  </b-form>

                </div>
                <div class="table-responsive mailbox-messages">
                  <b-table id="my-table" hover bordered responsive :items="orderList" :fields="sellerFields" style="height:500px;">
                    <template v-slot:cell(type)="data">
                      <span v-if="data.value=='YSF'">云闪付</span>
                      <span v-if="data.value=='PDD'">拼多多</span>
                    </template>
                    <template v-slot:cell(action)="row">
                      <div style="display:flex;justify-content: center;">
                        <b-button size="sm" variant="danger" @click="delet(row.item, row.index, $event.target)" class="mr-1">删除</b-button>
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
          <b-modal centered v-model="addVender" title="添加码商" @hidden="type='';typeList=[]" @ok="addOk" no-close-on-backdrop>
            <b-form ref="addValid" validated>
              <div class="row">
                <div class="col-md-12">
                  <b-form-group id="input-group-1" label="选择通道类型:" label-for="type">
                    <b-form-select placeholder="通道类型状态"  id="type" class="style-chooser" v-model="type" :options="types" label="text" :reduce="item => item.value" @input="getTypeList"></b-form-select>
                  </b-form-group>
                </div>
                <div class="col-md-12">
                  <b-table ref="selectableTable" id="my-table" selectable select-mode="multi" sticky-header bordered responsive :fields="typeFields" :items="typeList" @row-selected="onRowSelected">
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
                  </b-table>
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
          { key: 'type', label: '收款类型' }, { key: 'vender_name', label: '码商名称' },
          { key: 'create_time', label: '创建时间', formatter: transferTime },
          { key: 'action', label: '操作' }
        ],
        typeFields: [
          { key: 'checkItem', label: '' },
          { key: 'id', label: '码商ID' }, { key: 'name', label: '码商名称' },
        ],
        typeList: [],
        type:'',
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
        addVender: false,
        selected:[]
      }
    },
    async created() {
      this.currentPage = this.$route.query.page ? parseInt(this.$route.query.page) : 1
      this.form.cashier_id = this.$route.query.id ? parseInt(this.$route.query.id) : null
      await this.BindData();
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
        const data = await post('/collect/merchant/cashier/type/list', this.form);
        if (data.code == 'ok') {
          this.orderList = data.result.list;
          this.pages = data.result.count > 0 ? Math.ceil(data.result.count / this.form.limit) : 1;
          this.totals = data.result.count;
        } else {
          tips('danger', data.message)
        }
      },
      /**删除 */
      async delet(item) {
        const value = await this.$bvModal.msgBoxConfirm("即将更新密钥,是否继续?", { buttonSize: 'sm', okVariant: 'success', cancelVariant: 'danger', okTitle: '确认', cancelTitle: '取消', hideHeaderClose: true, centered: true, noCloseOnBackdrop: true });
        if (value) {
          const data = await post('/collect/merchant/cashier/relation/del', { id: item.id })
          if (data.code == 'ok') {
            tips('success', '删除成功')
            this.BindData()
          } else {
            tips('danger', data.message)
          }
        }
      },
      /**获取码商列表 */
      async getTypeList(e) {
        const data = await post('/collect/merchant/vender/type/list', { type: e ,cashier_id:this.form.cashier_id})
        if (data.code == 'ok') {
          this.typeList = data.list
        } else {
          tips('danger', data.message)
        }
      },
      /**表格选中事件 */
      onRowSelected(items) {
        this.selected=items
      },
      /**添加码商确认 */
      async addOk() {
          const arr=this.selected.map(item=>({cashier_id:this.form.cashier_id,vender_id:item.id,type:this.type}))
          const data=await post('/collect/merchant/cashier/relation/add',{list:arr})
          if(data.code=='ok'){
              tips('success','添加成功')
              this.BindData()
          }else{
              tips('danger',data.message)
          }
      }
    }

  }
</script>
<style scoped>

</style>