<template>
  <div id="caSys">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">管理统计</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">管理统计</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
    <div class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12">
            <blockquote class="quote-orange mt-0">
              <h5>代付统计</h5>
              <p>
                <b-form-select style="width:350px;" placeholder="查看日期" v-model="paySeclet" :options="options" @input="paySearch"></b-form-select>
              </p>
              <p><span>全部：</span><span>全部单数:{{payCollect.all_count}}</span>
                <span>成功单数：{{payCollect.success_count}}</span>;
                <span>超时单数：{{payCollect.timeout_count}}</span>;
                <span>失败单数：{{payCollect.failed_count}}</span>;
                <span>成功金额：<strong style="color:red;">{{(payCollect.all_money||0)/100}}</strong>元</span>
              </p>
              <ul>
                <li v-for="(item,index) in payList" :key="index">
                  <span>日期：{{item.day}}</span>;
                  <span>全部单数:{{item.all_count}}</span>;
                  <span>成功单数：{{item.success_count}}</span>;
                  <span>超时单数：{{item.timeout_count}}</span>;
                  <span>失败单数：{{item.failed_count}}</span>;
                  <span>成功金额：<strong style="color:red;">{{(item.all_money||0)/100}}</strong>元</span>
                </li>
              </ul>
            </blockquote>

            <blockquote class="quote-danger">
              <h5>云闪付统计</h5>
              <p>
                <b-form-select style="width:350px;" v-model="YsfSeclet" placeholder="查看日期" :options="options" @input="dataPicker"></b-form-select>
              </p>
              <p><span>全部：</span><span>全部单数:{{ysfCollect.all_count}}</span>
                <span>成功单数：{{ysfCollect.success_count}}</span>;
                <span>超时单数：{{ysfCollect.timeout_count}}</span>;
                <span>失败单数：{{ysfCollect.failed_count}}</span>;
                <span>成功金额：<strong style="color:red;">{{(ysfCollect.all_money||0)/100}}</strong>元</span>
              </p>
              <ul>
                <li v-for="(item,index) in daysCollect" :key="index">
                  <span>日期：{{item.day}}</span>;
                  <span>全部单数:{{item.all_count}}</span>;
                  <span>成功单数：{{item.success_count}}</span>;
                  <span>超时单数：{{item.timeout_count}}</span>;
                  <span>失败单数：{{item.failed_count}}</span>;
                  <span>成功金额：<strong style="color:red;">{{(item.all_money||0)/100}}</strong>元</span>
                </li>
              </ul>
            </blockquote>

            <blockquote class="quote-success">
              <h5>拼多多统计</h5>
              <p>
                <b-form-select style="width:350px;" v-model="PddSeclet" placeholder="查看日期" :options="options" @input="pddSearch"></b-form-select>
              </p>
              <p><span>全部：</span><span>全部单数:{{pddCollect.all_count}}</span>
                <span>成功单数：{{pddCollect.success_count}}</span>;
                <span>超时单数：{{pddCollect.timeout_count}}</span>;
                <span>失败单数：{{pddCollect.failed_count}}</span>;
                <span>成功金额：<strong style="color:red;">{{(pddCollect.all_money||0)/100}}</strong>元</span>
              </p>
              <ul>
                <li v-for="(item,index) in pddDaysCollect" :key="index">
                  <span>日期：{{item.day}}</span>;
                  <span>全部单数:{{item.all_count}}</span>;
                  <span>成功单数：{{item.success_count}}</span>;
                  <span>超时单数：{{item.timeout_count}}</span>;
                  <span>失败单数：{{item.failed_count}}</span>;
                  <span>成功金额：<strong style="color:red;">{{(item.all_money||0)/100}}</strong>元</span>
                </li>
              </ul>
            </blockquote>


          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { post, tips } from '@/facade.js'
  export default {
    name: 'caSys',
    data() {
      return {
        ysfCollect: {},
        payCollect: {},
        selected: [],
        paySelected: [],
        days: [],
        daysCollect: [],
        payList: [],
        YsfSeclet: 3,
        paySeclet: 3,
        PddSeclet: 3,
        pddCollect: {},
        pddDaysCollect: [],
        options: [
          { value: 3, text: '最近三天数据' },
          { value: 7, text: '最近七天数据' },
          { value: 10, text: '最近十天数据' },
        ]
      }
    },
    async created() {
      await this.dataPicker(3)
      await this.getYsfCollect();
      await this.paySearch(3);
      await this.getPayCollect();
      await this.pddSearch(3);
      await this.getPddCollect();
    },
    methods: {

      /**云闪付 获取统计 */
      async getYsfCollect() {
        const data = await post('/collect/cashier/ysf/collection')
        if (data.code == 'ok') {
          this.ysfCollect = data.result[0]
        } else {
          tips('danger', data.message)
        }
      },
      /**云闪付 获取每日统计 */
      async dataPicker(data) {
        const a = data;
        let dataArr = []
        for (var i = 0; i < a; i++) {
          dataArr.push(this.$moment(new Date()).add(0 - i, 'days').format('YYYY-MM-DD'))
        }
        if (dataArr.length > 0) {
          const form = {
            days: dataArr
          }
          const data = await post('/collect/cashier/ysf/collection', form)
          if (data.code == 'ok') {
            this.daysCollect = data.result;
          } else {
            tips('danger', data.message)
          }
        } else {
          tips('danger', '请选择日期')
        }
      },
      /**代付 */
      async getPayCollect() {
        const data = await post('/pay/cashier/pay/collection')
        if (data.code == 'ok') {
          this.payCollect = data.result[0]
        } else {
          tips('danger', data.message)
        }
      },
      /**代付，每日数据 */
      async paySearch(data) {
        const a = data;
        let dataArr = []
        for (var i = 0; i < a; i++) {
          dataArr.push(this.$moment(new Date()).add(0 - i, 'days').format('YYYY-MM-DD'))
        }
        if (dataArr.length > 0) {
          const form = {
            days: dataArr
          }
          const data = await post('/pay/cashier/pay/collection', form)
          if (data.code == 'ok') {
            this.payList = data.result;
          } else {
            tips('danger', data.message)
          }
        } else {
          tips('danger', '请选择日期')
        }
      },

        /**拼多多 */
      async getPddCollect() {
        const data = await post('/collect/cashier/pdd/collection')
        if (data.code == 'ok') {
          this.pddCollect = data.result[0]
        } else {
          tips('danger', data.message)
        }
      },
      /**拼多多，每日数据 */
      async pddSearch(data) {
        const a = data;
        let dataArr = []
        for (var i = 0; i < a; i++) {
          dataArr.push(this.$moment(new Date()).add(0 - i, 'days').format('YYYY-MM-DD'))
        }
        if (dataArr.length > 0) {
          const form = {
            days: dataArr
          }
          const data = await post('/collect/cashier/pdd/collection', form)
          if (data.code == 'ok') {
            this.pddDaysCollect = data.result;
          } else {
            tips('danger', data.message)
          }
        } else {
          tips('danger', '请选择日期')
        }
      },
    }
  }
</script>
<style scoped>

</style>