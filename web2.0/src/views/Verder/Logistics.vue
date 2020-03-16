<template>
  <div id="logistics">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">物流管理</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">物流管理</li>
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
                <h3 class="card-title">物流列表</h3>
                <div class="card-tools">
                  <b-button size='sm' variant="primary" @click="addForm=true;form.type='KB1';filltype=true">绑定物流信息</b-button>
                  <!-- <b-button style="margin-left:10px;" variant="success" size="sm" @click="download()">下 载</b-button> -->
                </div>
              </div>
              <div class="card-body p-0">
                <!-- <div class="mailbox-controls">
                  
                </div> -->
                <div class="table-responsive mailbox-messages">
                  <b-table id="my-table" bordered responsive hover :items="tableList" :fields="tableFields">
                    <template v-slot:cell(type)="data">
                      <span>{{data.value=='KB1'? '空包一':'空包二'}}</span>
                    </template>
                    <template v-slot:cell(status)="data">
                      <span>{{data.value=='enable'? '开启':'关闭'}}</span>
                    </template>
                    <template v-slot:cell(created_at)="data">
                      <span>{{$moment(data.created_at).format("YYYY-MM-DD HH:mm:ss")}}</span>
                    </template>
                    <template v-slot:cell(action)="row">
                      <div style="display:flex;justify-content: center;">
                        <b-button size="sm" variant="danger" @click="delet(row.item, row.index, $event.target,0)" class="mr-1">删除</b-button>
                      </div>
                    </template>
                  </b-table>
                </div>


                <!-- /.mail-box-messages -->
              </div>
              <!-- /.card-body -->
              <div class="card-footer p-0">

              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <b-modal centered v-model="addForm" title="绑定物流信息" @hidden="form={type:'KBI',platform:'PDD'};priceList=[]" @ok="addOk" modal-ok='确定' :hide-footer='priceList.length?false:true' no-close-on-backdrop>
              <b-form ref="editeFormVaild" validated>
                <div class="row">
                  <div class="col-md-6">
                    <b-form-group label="包裹类型:" label-for="type">
                      <b-form-select v-model="form.type" :options="packages" size="sm" class="mt-3"></b-form-select>
                    </b-form-group>
                  </div>
                  <div class="col-md-6">
                    <b-form-group label="平台:" label-for="platform">
                      <b-form-select v-model="form.platform" :options="platforms" size="sm" class="mt-3"></b-form-select>
                      <!-- <v-select id="platform" v-model="form.platform" :options="platforms" label="text"></v-select> -->
                    </b-form-group>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12">
                    <b-form-group label="备注:" label-for="demain">
                      <b-form-input id="demain" v-model="form.demain" required></b-form-input>
                    </b-form-group>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <b-form-group label="账号:" label-for="key">
                      <b-form-input id="key" class="style-chooser" v-model="form.key" required></b-form-input>
                      <span @click="skip" v-if="!form.key" style="color:red;font-size:12px;cursor:pointer;">点击此处注册空包网账号</span>
                    </b-form-group>
                  </div>
                  <div class="col-md-6">
                    <b-form-group id="input-group-1" label="密码:" label-for="value">
                      <div class="input-group">
                        <b-form-input id="value" v-model="form.value" required></b-form-input>
                        <b-input-group-append>
                          <b-button variant="info" @click="getVeriyCode">校 验</b-button>
                        </b-input-group-append>
                      </div>
                    </b-form-group>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12">
                    <div>
                      <b-table ref="selectableTable" id="my-table" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" selectable select-mode="single" sticky-header bordered responsive :items="priceList" :fields="priceFields" @row-selected="onRowSelected">
                      </b-table>
                    </div>
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
  </div>
</template>
<script>
  import { transferTime, post, tips } from '@/facade'
  export default {
    name: 'logistics',
    data() {
      return {
        tableList: [],
        tableFields: [
          { key: 'type', label: '类型' },
          { key: 'name', label: '名称' },
          { key: 'platform', label: '平台' },
          { key: 'key', label: '账号' },
          { key: 'value', label: '密码' },
          { key: 'demain', label: '备注' },
          { key: 'create_time', label: '创建时间', formatter: transferTime },
          { key: 'action', label: '操作' }
        ],
        form: {
          type: 'KBI',
          platform: 'PDD'
        },
        priceList: [],
        priceFields: [
          { key: 'name', label: '名称' }, { key: 'price', label: '价格' }, { key: 'type_id', label: 'TypeId' }
        ],
        addForm: false,
        packages: [
          { value: 'KB1', text: '空包一' },
        ],
        platforms: [
          { value: 'PDD', text: 'PDD' },
        ],
        sortBy: 'price',
        sortDesc: false,
      }
    },
    async created() {
      this.currentPage = this.$route.query.pages ? this.$route.query.pages : 1
      await this.BindData()
    },
    methods: {
      async BindData() {
        const data = await post('/collect/vender/logistics/list');
        if (data.code == 'ok') {
          this.tableList = data.logistics;
        } else {
          tips('danger', data.message)
        }
      },
      /*删除*/
      async delet(item) {
        console.log(item)
        const value = await this.$bvModal.msgBoxConfirm("即将删除,是否继续?", { buttonSize: 'sm', okVariant: 'success', cancelVariant: 'danger', okTitle: '确认', cancelTitle: '取消', hideHeaderClose: true, centered: true, noCloseOnBackdrop: true });
        if (value) {
          const data = await post('/collect/vender/logistics/del', { id: item.id})
          if (data.code == 'ok') {
            tips('success', '删除成功')
            this.BindData();
          }else{
              tips('danger',data.message)
          }
        }
      },
      /*绑定*/
      async addOk() {
        const data = await post('/collect/vender/logistics/add', this.form);
        if (data.code == 'ok') {
          this.BindData();
          tips('success', '添加成功');
        } else {
          tips('error', data.message);
        }
      },
      onRowSelected(items) {
        const item = items[0];
        this.form.type_id = item.type_id;
        this.form.name = item.name;
        this.form.price = item.price.toString();
      },
      /*校验*/
      async getVeriyCode() {
        if (this.form.key && this.form.value) {
          const form = {
            key: this.form.key,
            value: this.form.value
          }
          const data = await post('/collect/vender/kb/list', form)
          if (data.code == 'ok') {
            if (data.price_list && data.price_list.length > 0) {
              const priceList = data.price_list;
              this.priceList = priceList.map(item => ({ name: item.kdName.split("(")[0], price: item.apiPrice, type_id: item.kdId }))
            }
          } else {
            tips('danger', data.message)
          }
        } else {
          tips('danger', '请输入账号密码')
        }
      },
      skip() {
        window.open('http://www.shuabaokb.com');
      },
      /**下载excel */
      download() {}

    }

  }
</script>
<style scoped>

</style>