<template>
  <div id="venMallList">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">店铺管理</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">店铺管理</li>
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
                  <span v-if="!isPull" style="color:red;">若要添加店铺，请用插件打开系统，下载地址在对接指南里</span>
                </div>
              </div>
              <div class="card-body p-0">
                <div class="mailbox-controls">
                  <b-form inline class="placeStyle">
                    <b-form-input style="margin:5px;" v-model="form.mall_name" placeholder="店铺名称"></b-form-input>
                    <b-form-input style="margin:5px;" v-model="form.mall_id" placeholder="店铺ID"></b-form-input>
                    <b-form-input style="margin:5px;" v-model="form.demain" placeholder="备注"></b-form-input>
                    <v-select style="width:150px;margin:5px;" placeholder="启停" id="enabled" class="style-chooser" v-model="form.enabled" :options="enableds" label="text" :reduce="item => item.value" @input="currentPage=1;bindSellerList()"></v-select>
                    <v-select style="width:150px;margin:5px;" placeholder="店铺状态" id="status" class="style-chooser" v-model="form.status" :options="statuss" label="text" :reduce="item => item.value" @input="currentPage=1;bindSellerList()"></v-select>
                    <b-button size='sm' v-if="isPull" variant="primary" @click="scan_add=true" style="margin:0px 10px;">添加店铺</b-button>
                    <b-button style="margin-left:10px;" variant="primary" size="sm" @click="currentPage=1;bindSellerList()">搜 索</b-button>
                    <b-button style="margin-left:10px;" variant="info" size="sm" @click="bindSellerList()">刷 新</b-button>
                    <b-button style="margin-left:10px;" variant="primary" size="sm" @click="download()">跑分金额Excel</b-button>
                  </b-form>

                </div>
                <div class="table-responsive mailbox-messages">
                  <b-table id="my-table" bordered responsive hover :items="sellerList" :fields="sellerFields">
                    <template v-slot:cell(mall_name)="data">
                      <span @click="openUrl(data.item)" style="cursor:pointer">{{data.value}}</span>
                    </template>
                    <template v-slot:cell(status)="data">
                      <span v-if="data.value=='OK'" style="color: green;">正常</span>
                      <span v-if="data.value=='LOCKED'">锁住</span>
                    </template>
                    <template v-slot:cell(address)="data">
                      <b-button variant="primary" size="sm" v-b-tooltip.hover :title="data.value" class="mr-1" @click="addr=true;address(data.item)">{{data.value?'修改':'添加'}}</b-button>
                    </template>
                    <template v-slot:cell(enabled)="data">
                      <b-form-checkbox v-model="data.value" name="check-button" value="1" unchecked-value="0" :disabled="data.item.status!='OK'&&data.value==0?true:false" @change="checkUpdate(data.value,data.item)" switch></b-form-checkbox>
                    </template>
                    <template v-slot:cell(action)="row">
                      <div style="display:flex;justify-content: center;">
                        <b-button size="sm" variant="primary" @click="updateForm=true;update(row.item, row.index, $event.target)" class="mr-1">编辑</b-button>
                        <b-button size="sm" variant="info" @click="goodsList(row.item, row.index, $event.target)" class="mr-1">商品列表</b-button>
                        <!-- <b-button size="sm" variant="primary" @click="billSerial(row.item, row.index, $event.target)" class="mr-1">对账</b-button> -->
                        <b-button size="sm" variant="primary" @click="clear(row.item, row.index, $event.target)" class="mr-1">清空已收金额</b-button>
                        <b-button size="sm" variant="success" v-if="isPull" @click="asyncGoods(row.item, row.index, $event.target)" class="mr-1">同步商品</b-button>
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
          <b-modal centered v-model="updateForm" title="编辑" @hidden="editeForm={};" @ok="updateOk" modal-ok='确定' no-close-on-backdrop>
            <b-form>

              <div class="row">
                <div class="col-md-6">
                  <b-form-group label="最大风控金额(元):" label-for="max_pay_amount">
                    <b-form-input id="max_pay_amount" v-model="editeForm.max_pay_amount" type="number"></b-form-input>
                  </b-form-group>
                </div>
                <div class="col-md-6">
                  <b-form-group label="物流:" label-for="logistics">
                    <b-form-select id="logistics" v-model="editeForm.logistics_id" :options="logisticss"></b-form-select>
                  </b-form-group>
                </div>

              </div>
              <div class="row">
                <div class="col-md-6">
                  <b-form-group label="账号:" label-for="username">
                    <b-form-input id="username" v-model="editeForm.username"></b-form-input>
                  </b-form-group>
                </div>
                <div class="col-md-6">
                  <b-form-group label="密码:" label-for="password">
                    <b-form-input id="password" v-model="editeForm.password"></b-form-input>
                  </b-form-group>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <b-form-group label="备注:" label-for="demain">
                    <b-form-input id="demain" v-model="editeForm.demain"></b-form-input>
                  </b-form-group>
                </div>
              </div>


            </b-form>
            <span slot="modal-cancel">取消</span>
            <span slot="modal-ok">确定</span>
          </b-modal>
        </div>
        <div class="row">
          <b-modal centered v-model="scan_add" title="拉取添加店铺" @hidden="scanForm={}" @ok="scanAdd" no-close-on-backdrop>
            <b-form ref="goodsValid" validated>
              <div class="row">
                <div class="col-md-12">
                  <b-form-group label="店铺ID号:" label-for="mall_id" invalid-feedback="不能为空">
                    <b-form-input id="mall_id" v-model="scanForm.mallid_val" required></b-form-input>
                  </b-form-group>
                </div>
                <div class="col-md-12">
                  <b-form-group label="最大风控值:" label-for="max_pay_amount" invalid-feedback="不能为空">
                    <b-form-input id="max_pay_amount" v-model="max_pay_amount" type='number' required></b-form-input>
                  </b-form-group>
                </div>
                <div class="col-md-12">
                  <b-form-group label="账号:" label-for="username">
                    <b-form-input id="username" v-model="scanForm.username"></b-form-input>
                  </b-form-group>
                </div>
                <div class="col-md-12">
                  <b-form-group label="密码:" label-for="password">
                    <b-form-input id="password" v-model="scanForm.password"></b-form-input>
                  </b-form-group>
                </div>
                <div class="col-md-12">
                  <b-form-group label="备注:" label-for="demain" invalid-feedback="不能为空">
                    <b-form-input id="demain" v-model="scanForm.demain" required></b-form-input>
                  </b-form-group>
                </div>
              </div>
            </b-form>
            <span slot="modal-cancel">取消</span>
            <span slot="modal-ok">确定</span>
          </b-modal>
        </div>
        <div class="row">
          <b-modal centered v-model="addr" title="编辑地址" @hidden="addrForm={}" @ok="addrAdd" no-close-on-backdrop>
            <b-form ref="addrValid" validated>
              <div class="row">
                <div class="col-md-12">
                  <b-form-group label="地址:" label-for="address" invalid-feedback="不能为空">
                    <v-distpicker style="width:100%;" :province="addrForm.province" :city="addrForm.city" :area="addrForm.area" @province="onChangeProvince" @city="onChangeCity" @area="onChangeArea" required></v-distpicker>
                  </b-form-group>
                </div>
                <div class="col-md-12">
                  <b-form-group label="姓名:" label-for="name" invalid-feedback="不能为空">
                    <b-form-input id="name" v-model="addrForm.name" required></b-form-input>
                  </b-form-group>
                </div>
                <div class="col-md-12">
                  <b-form-group label="手机:" label-for="phone" invalid-feedback="不能为空">
                    <b-form-input id="phone" v-model="addrForm.phone" required></b-form-input>
                  </b-form-group>
                </div>
                <div class="col-md-12">
                  <b-form-group label="详细地址:" label-for="detailAddr" invalid-feedback="不能为空">
                    <b-form-input id="detailAddr" v-model="addrForm.detailAddr" required></b-form-input>
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
  import { transferTime, post, tips } from '@/facade'
  export default {
    name: 'venMallList',
    data() {
      return {
        pageLimits: [{value:100,text:'100条/页'}],
        sellerFields: [
          { key: 'id', label: 'ID' }, { key: 'mall_id', label: '店铺ID' }, { key: 'mall_name', label: '店铺名称' }, { key: 'address', label: '地址' }, { key: 'demain', label: '备注' },
          { key: 'status', label: '状态' }, { key: 'enabled', label: '启停' }, { key: 'used_pay_amount', label: '当日已收金额(元)', formatter: value => (value || 0) / 100 },
          { key: 'max_pay_amount', label: "最大风控金额", formatter: value => (value || 0) / 100 },
          { key: 'create_time', label: '创建时间', formatter: transferTime }, { key: 'action', label: '操作' }
        ],
        totals: 0,
        mall_id: '',
        updateForm: false,
        editeForm: {},
        duibiForm: "",
        currentPage: 1,
        pages: 1,
        form: { limit: 100, offset: 0 },
        sellerList: [],
        statuss: [{ value: 'OK', text: '正常' }, { value: 'LOCKED', text: '锁住' }, ],
        isPull: true,
        mallid_val: "",
        max_pay_amount: 5000,
        scanForm: {},
        addrForm: {},
        addr: false,
        username: '',
        password: '',
        demain: '',
        logisticss: [],
        scan_add: false,
        enableds: [
          { value: false, text: '关闭' },
          { value: true, text: '启用' },
        ],
      }
    },
    async created() {
      this.isPull = window.mall_goods ? true : false;
      this.currentPage = this.$route.query.pages ? this.$route.query.pages : 1
      await this.bindSellerList();
      await this.getLog();
    },
    methods: {
      linkGen(pageNum) {
        return pageNum === 1 ? '?' : `?page=${pageNum}`
      },
      async pageChange(val) {
        this.currentPage = val;
        await this.bindSellerList();
      },
      /**每页显示条数变化 */
      async limitChange(e) {
        this.form.limit = e;
        this.currentPage = 1;
        this.bindSellerList();
      },
      /**获取列表 */
      async bindSellerList() {
        for (let item in this.form) {
          if (!this.form[item]&&this.form.enabled!=false) {
            delete this.form[item]
          }
        }
        this.form.offset = this.form.limit * (this.currentPage - 1);
        const data = await post('/collect/vender/mall/list', this.form);
        if (data.code == 'ok') {
          this.totals = data.result.count
          this.sellerList = data.result.mall_list
          this.pages = data.result.count > 0 ? Math.ceil(data.result.count / this.form.limit) : 1;
        }
      },

      /*三级联动*/
      onChangeProvince(a) {
        this.addrForm.province = a.value;
      },
      onChangeCity(a) {
        this.addrForm.city = a.value;
      },
      onChangeArea(a) {
        this.addrForm.area = a.value;
      },
      /*地址添加修改*/
      address(item) {
        console.log(item)
        this.addrForm = Object.assign({}, item)
        if (item.address) {
          const addrList = item.address.split(',');
          this.addrForm.name = addrList[0];
          this.addrForm.phone = addrList[1];
          this.addrForm.province = addrList[2];
          this.addrForm.city = addrList[3];
          this.addrForm.area = addrList[4]
          this.addrForm.detailAddr = addrList[5];
        }

      },
      /**获取物流列表 */
      async getLog() {
        const data = await post('/collect/vender/logistics/list')
        if (data.code == 'ok') this.logisticss = data.logistics.map(item => ({ value: item.id, text: item.demain }))
        else tips('danger', data.message)
      },
      /**修改地址 */
      async addrAdd(bvModalEvt) {
        bvModalEvt.preventDefault()
        const valid = this.$refs.addrValid.checkValidity()
        if (valid) {
          const postAddr = `${this.addrForm.name},${this.addrForm.phone},${this.addrForm.province},${this.addrForm.city},${this.addrForm.area},${this.addrForm.detailAddr}`
          const form = { address: postAddr, id: this.addrForm.id, mall_id: this.addrForm.mall_id }
          this.infoUpdate(form);
        }
      },
      /*编辑*/
      async update(item) {
        this.editeForm = Object.assign({}, item);
        this.editeForm.max_pay_amount = parseInt(item.max_pay_amount) / 100;
        this.editeForm.used_pay_amount = parseInt(item.used_pay_amount) / 100;
        this.duibiForm = Object.assign({}, item);
        this.duibiForm.max_pay_amount = parseInt(item.max_pay_amount) / 100;
        this.duibiForm.used_pay_amount = parseInt(item.used_pay_amount) / 100;
      },
      updateOk(bvModalEvt) {
        bvModalEvt.preventDefault();
        const formdata = this.duibi();
        console.log(formdata);
        if (Object.keys(formdata).length === 0) {
          tips("danger", "没做任何修改");
        } else {
          formdata.mall_id = this.editeForm.mall_id;
          this.infoUpdate(formdata);
        }
      },
      async infoUpdate(e) {
        const form = e;
        if (e.used_pay_amount) e.used_pay_amount = parseInt(e.used_pay_amount) * 100;
        if (e.max_pay_amount) e.max_pay_amount = parseInt(e.max_pay_amount) * 100;
        const data = await post("/collect/vender/mall/update", form);
        if (data.code == "ok") {
          await this.bindSellerList();
          tips("success", "修改成功");
          this.addr = false;
          this.updateForm = false;
        } else {
          tips("error", data.message);
        }
      },
      duibi() {
        const c = {};
        for (let key in this.editeForm) {
          if (this.editeForm[key] != this.duibiForm[key]) {
            c[key] = this.editeForm[key];
          }
        }
        console.log(c);
        return c;
      },


      /*开关*/
      checkUpdate(e, item) {
        const form = { mall_id: item.mall_id }
        if (e == 1) form.enabled = false;
        else form.enabled = true;
        this.infoUpdate(form)
      },
      /*拉取店铺*/
      async scanAdd(evt) {
        evt.preventDefault();
        const valid = this.$refs.goodsValid.checkValidity();
        if (valid) {
          if (this.scanForm.username) this.username = this.scanForm.username;
          if (this.scanForm.password) this.password = this.scanForm.password;
          if (this.scanForm.demain) this.demain = this.scanForm.demain;
          this.pullShop(this.scanForm.mallid_val)
        }
      },
      async pullShop(mallId) {
        const data = await post('/collect/vender/buyer/get')
        if (data.code == 'ok') {
          this.scan_add = false
          const buyer = data.buyer;
          const mall = await window.mall_goods({ access_token: buyer.access_token, pdd_user_id: buyer.user_id }, mallId);
          if (mall) {

            if (this.username) mall.username = this.username;
            if (this.password) mall.password = this.password;
            mall.demain = this.demain;
            mall.max_pay_amount = parseInt(this.max_pay_amount) * 100
            const mallData = await post('/collect/vender/mall/async', mall)
            if (mallData.code == 'ok') {
              this.username = ''
              this.password = ''
              this.bindSellerList()
            } else {
              if (data.message == 'this mall is bind') tips('danger', '该商户已被绑定')
              else tips('danger', mallData.message)
            }
          }
        } else {
          tips('danger', data.message)
        }
      },
      /*删除*/
      async delet(item) {
        const value = await this.$bvModal.msgBoxConfirm("即将删除,是否继续?", { buttonSize: 'sm', okVariant: 'success', cancelVariant: 'danger', okTitle: '确认', cancelTitle: '取消', hideHeaderClose: true, centered: true, noCloseOnBackdrop: true });
        if (value) {
          const data = await post('/collect/vender/mall/del', { id: item.id })
          if (data.code == 'ok') {
            tips('success', '删除成功')
            this.bindSellerList();
          } else {
            tips('danger', data.message)
          }
        }
      },
      /*商铺名称跳转*/
      async openUrl(item) {
        if (window.open_window) {
          const data = await post('/collect/vender/buyer/get');
          window.open_window({ pdd_user_id: data.buyer.user_id, access_token: data.buyer.access_token }, `https://mobile.yangkeduo.com/mall_page.html?mall_id=${item.mall_id}`)
        } else {
          window.open(`https://mobile.yangkeduo.com/mall_page.html?mall_id=${item.mall_id}`)
        }
      },
      /*商铺列表*/
      detail(item) {
        this.$router.push({ path: '/verGoods', query: { mall_id: item.mall_id } })
      },
      /**店铺对账 */
      // billSerial(item) {
      //   this.$router.push({ path: '/billSerial', query: { mch_id: item.mch_id, mall_id: item.mall_id } })
      // },
      /**清空当日收款金额 */
      async clear(item) {
        const form = {
          mall_id: item.mall_id,
          used_pay_amount: 0
        }
        this.infoUpdate(form)
      },
      /**下载excel */
      download() {},
      /**同步商品 */
      async asyncGoods(item) {
        const data = await post('/collect/vender/buyer/get')
        if (data.code == 'ok') {
          this.scan_add = false
          const buyer = data.buyer;
          const mall = await window.mall_goods({ access_token: buyer.access_token, pdd_user_id: buyer.user_id }, item.mall_id);
          console.log(mall)
          if (mall) {
            const form = {
              mall_id: item.mall_id,
              goods_list: mall.goods_list
            }
            this.infoUpdate(form)
          }
        } else {
          tips('danger', data.message)
        }
      },
      /**商品列表 */
      async goodsList(item) {
        this.$router.push({ path: '/verGoods', query: { mall_id: item.mall_id } })
      }

    }

  }
</script>
<style scoped>

</style>