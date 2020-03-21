<template>
  <div id="preSys">
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
            <!-- <blockquote class="quote-orange mt-0">
              <h5>拼多多</h5>
              <p>
                <date-picker style="margin:5px;" v-model="days" value-type="format" placeholder="时间范围" range format="YYYY-MM-DD" @input="dataPicker"></date-picker>
              </p>
            </blockquote> -->

            <blockquote class="quote-info">
              <h5>云闪付</h5>
              <p>
                <b-form-group label="选择日期:">
                  <b-form-checkbox-group id="checkbox-group-2" v-model="selected" name="flavour-2">
                    <b-form-checkbox v-for="item in days" :key="item" :value="item">{{item}}</b-form-checkbox>
                  </b-form-checkbox-group>
                </b-form-group>
                <b-button size="sm" variant="primary" @click="dataPicker"><i class="fas fa-search">搜索</i></b-button>

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

          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { post, tips } from '@/facade.js'
  export default {
    name: 'preSys',
    data() {
      return {
        ysfCollect: {},
        selected: [],
        days: [],
        daysCollect: []
      }
    },
    async created() {
      await this.getDays()
      await this.getYsfCollect()
    },
    methods: {
      getDays() {
        const a = 10
        for (var i = 0; i < a; i++) {
          this.days.push(this.$moment(new Date()).add(0 - i, 'days').format('YYYY-MM-DD'))
        }
      },
      async getYsfCollect() {
        const data = await post('/collect/merchant/ysf/collection')
        if (data.code == 'ok') {
          this.ysfCollect = data.result[0]
        } else {
          tips('danger', data.message)
        }
      },
      async dataPicker() {
        if (this.selected.length > 0) {
          const form = {
            days: this.selected
          }
          const data = await post('/collect/merchant/ysf/collection', form)
          if (data.code == 'ok') {
            this.daysCollect = data.result;
          } else {
            tips('danger', data.message)
          }
        } else {
          tips('danger', '请选择日期')
        }
      }
    }
  }
</script>
<style scoped>

</style>