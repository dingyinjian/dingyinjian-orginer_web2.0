<template>
  <div id="venMallList">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">商品列表</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">商品列表</li>
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
                <h3 class="card-title">商品列表</h3>
                <div class="card-tools">
                  <b-button variant="info" size="sm" @click="bindGoodsList()">刷 新</b-button>
                  <b-button style="margin-left:5px;" variant="primary" size="sm" @click="$router.replace({path:'/venMallList'})">返 回</b-button>
                  <b-button style="margin-left:5px;" variant="primary" size="sm" @click="downLoad()">Excel</b-button>
                
                </div>
              </div>
              <div class="card-body p-0">
                <div class="mailbox-controls">
                </div>
                <div class="table-responsive mailbox-messages">
                  <b-table id="my-table" bordered responsive :items="goodsList" :fields="fields">
                    <template v-slot:cell(goods_name)="data">
                      <a @click="goodsHref(data.item)" style="cursor:pointer">{{data.value}}</a>
                    </template>
                    <template v-slot:cell(goodsUrl)="data">
                      <b-button style="border:0px;" @click="goodsHref(data.item)" variant="outline-primary" size="sm" v-b-tooltip.hover :title="`https://mobile.yangkeduo.com/goods.html?goods_id=${data.item.goods_id}`" class="mr-1">{{data.item.goods_id ?`https://mobile.yangkeduo.com/goods.html?goods_id=${data.item.goods_id}`.substr(0,30)+"...":''}}</b-button>
                    </template>
                    <template v-slot:cell(enabled)="data">
                      <b-form-checkbox v-model="data.value" name="check-button" value="1" unchecked-value="0" @change="infoUpdate(data.value,data.item.id)" switch></b-form-checkbox>
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
      </div>
    </div>
  </div>
</template>
<script>
  import { transferTime, post, tips, limits } from '@/facade'
  export default {
    name: 'venMallList',
    data() {
      return {
        pageLimits: limits,
        fields: [{ key: 'id', label: 'ID' }, { key: 'mall_id', label: '店铺ID' }, { key: 'group_id', label: "group_id" },
          { key: 'goods_name', label: '商品名称' }, { key: "goodsUrl", label: "商品链接" }, { key: 'goods_id', label: '商品ID' }, { key: 'sku_id', label: 'sku_id' },
          { key: 'normal_price', label: '单价', formatter: value => (value || 0) / 100 }, { key: 'group_price', label: '团购价', formatter: value => (value || 0) / 100 },
          { key: 'enabled', label: '启停' }, { key: 'create_time', label: '创建时间', formatter: transferTime }, { key: 'action', label: '操作' }
        ],
        goodsList: [],
        form: { limit: 10, offset: 0 },
        currentPage: 1,
        pages: 1,
        totals:''
      }
    },
    async created() {
      this.form.mall_id = this.$route.query.mall_id ? this.$route.query.mall_id : null
      await this.bindGoodsList()
    },
    methods: {
      linkGen(pageNum) {
        return pageNum === 1 ? '?' : `?page=${pageNum}`
      },
      async pageChange(val) {
        this.currentPage = val;
        await this.bindGoodsList();
      },
      /**每页显示条数变化 */
      async limitChange(e) {
        this.form.limit = e;
        this.currentPage = 1;
        this.bindSellerList();
      },
      /**获取商品列表 */
      async bindGoodsList() {
        this.form.offset = this.form.limit * (this.currentPage - 1);
        const data = await post('/collect/vender/goods/list', this.form);
        if (data.code == 'ok') {
          this.totals = data.result.count;
          this.goodsList = data.result.goods_list;
          this.pages = data.result.count > 0 ? Math.ceil(data.result.count / this.form.limit) : 1;
        }
      },
      async delet(item) {
        const value = await this.$bvModal.msgBoxConfirm("即将删除,是否继续?", { buttonSize: 'sm', okVariant: 'success', cancelVariant: 'danger', okTitle: '确认', cancelTitle: '取消', hideHeaderClose: true, centered: true, noCloseOnBackdrop: true });
        if (value) {
          const data = await post('/collect/vender/goods/del', { id: item.id })
          if (data.code == 'ok') {
            tips('success', '删除成功')
            this.bindGoodsList();
          } else {
            tips('danger', data.message)
          }
        }
      },
      /*商品名称跳转*/
      async goodsHref(item) {
        if (window.open_window) {
          const data = await post('/collect/vender/buyer/get');
          window.open_window({ pdd_user_id: data.buyer.user_id, access_token: data.buyer.access_token }, `https://mobile.yangkeduo.com/goods.html?goods_id=${item.goods_id}`)
        } else {
          window.open(`https://mobile.yangkeduo.com/goods.html?goods_id=${item.goods_id}`)
        }
      },

      /*启停*/
      async infoUpdate(e, id, ) {
        const form = { id: id }
        if (e == 1) form.enabled = false;
        else form.enabled = true;
        const data = await post("/collect/vender/goods/update", form);
        if (data.code == "ok") {
          await this.bindGoodsList();
          tips("success", "修改成功");
        } else {
          tips("error", data.message);
        }
      },
      /**下载 */
      downLoad(){

      }

    }

  }
</script>
<style scoped>

</style>