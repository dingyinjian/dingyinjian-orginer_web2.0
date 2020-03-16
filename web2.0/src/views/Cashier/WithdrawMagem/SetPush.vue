<template>
  <div id="setPush">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">结算申请</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">结算申请</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
    <div class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12">
            <div class="callout callout-info">
              <h5><i class="fas fa-info"></i> 提示:</h5>
              <div style="color:red;">可提现:{{billMoney}}元</div>
              <div><span style="color:red;">最低提现：100 元</span> <span style="color:#037bff;">单笔最高：1000000 元</span><span style="color:red;">手续费:{{rateTitle}}</span> </div>
            </div>
            <div class="invoice p-3 mb-3">
              <!-- title row -->
              <div class="row">
                <div class="col-md-12">
                  <b-form ref="formValid">
                    <div class="row">
                      <div class="col-md-6">
                        <b-form-group id="fieldset-2" label="提现金额" label-for="input-2" :invalid-feedback="invalidFeedback1" :state="state1">
                          <b-form-input id="input-2" v-model="form.pushMoney" :state="state1" trim @change="changedFn"></b-form-input>
                        </b-form-group>
                      </div>
                      <div class="col-md-6">
                        <b-form-group id="input-group-6" label="到账金额:" label-for="getMoney">
                          <b-form-input id="secret" v-model="getMoney" required disabled></b-form-input>
                        </b-form-group>
                      </div>

                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <b-form-group id="fieldset-3" label="开户行" label-for="input-3" :invalid-feedback="invalidFeedback3" :state="state3">
                          <b-form-input id="input-3" v-model="form.bank" :state="state3" trim></b-form-input>
                        </b-form-group>

                      </div>
                      <div class="col-md-6">
                        <b-form-group id="fieldset-3" label="银行卡号" label-for="input-3" :invalid-feedback="invalidFeedback2" :state="state2">
                          <b-form-input id="input-3" v-model="form.card" :state="state2" trim></b-form-input>
                        </b-form-group>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <b-form-group id="fieldset-4" label="持卡人姓名" label-for="input-4" :invalid-feedback="invalidFeedback4" :state="state4">
                          <b-form-input id="input-4" v-model="form.name" :state="state4" trim></b-form-input>
                        </b-form-group>
                      </div>
                      <div class="col-md-6">
                        <b-form-group id="fieldset-5" label="手机号" label-for="input-5" :invalid-feedback="invalidFeedback5" :state="state5">
                          <b-form-input id="input-5" v-model="form.phone" :state="state5" trim></b-form-input>
                        </b-form-group>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12">
                        <b-form-group id="fieldset-6" label="备注" label-for="input-6" >
                          <b-form-input id="input-6" v-model="form.demain" ></b-form-input>
                        </b-form-group>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-12" style="text-align:right;">
                        <b-button variant="primary" @click="submit">确 定</b-button>
                      </div>
                    </div>
                  </b-form>
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
  import { post, tips } from '@/facade'
  export default {
    name: 'setPush',
    data() {
      return {
        cashierId: "",
        billMoney: "",
        pushMoney: "",
        getMoney: "",
        form: {},
        infoForm: {},
        userId: '',
        rate: '',
        rateTitle: '',
        sysRate: {}
      }
    },
    computed: {
      state1() {
        return parseInt(this.form.pushMoney) >= 100 && parseInt(this.form.pushMoney) <= this.billMoney ? true : false
      },
      invalidFeedback1() {
        if (parseInt(this.form.pushMoney) >= 100 && parseInt(this.form.pushMoney) <= this.billMoney) {
          return ''
        } else if (parseInt(this.form.pushMoney) > 0) {
          return '最低提现金额100元'
        } else {
          return '请输入提现金额'
        }
      },
      /**银行卡号 */
      state2() {
        return this.form.card ? true : false
      },
      invalidFeedback2() {
        if (!this.form.card) {
          return '不能为空'
        } else {
          return ''
        }
      },
      /**开户行 */
      state3() {
        return this.form.bank ? true : false
      },
      invalidFeedback3() {
        if (!this.form.bank) {
          return '不能为空'
        } else {
          return ''
        }
      },
      /**持卡人姓名*/
      state4() {
        return this.form.name ? true : false
      },
      invalidFeedback4() {
        if (!this.form.name) {
          return '不能为空'
        } else {
          return ''
        }
      },
      /**手机号*/

      state5() {
        const reg = /^1[3456789]\d{9}$/
        return reg.test(this.form.phone) ? true : false
      },
      invalidFeedback5() {
        const reg = /^1[3456789]\d{9}$/
        if (!reg.test(this.form.phone)) {
          return '请输入正确的手机号'
        } else {
          return ''
        }
      },


    },
    async created() {
      await this.getAmount();
      await this.getRate()
    },
    methods: {
      /**获取手续费 */
      async getRate() {
        const data = await post('/collect/cashier/system/rate')
        if (data.code == 'ok') {
          this.sysRate = data.system_rate;
          this.rateTitle = data.system_rate.sys_type == 'COUNT' ? `${(data.system_rate.sys_rate||0)/100}元` : `${data.system_rate.sys_rate}‰`;
          this.rate = data.system_rate.sys_rate;
        }
        else tips('danger', data.message)
      },
      /**获取可提现金额 */
      async getAmount() {
        const data = await post('/collect/cashier/balance')
        if (data.code == 'ok') {
          this.billMoney = (data.result || 0) / 100;
        } else {
          tips('error', data.message)
        }
      },
      /**提现金额变化 */
      changedFn(e) {
        const pushMoney = parseInt(e) * 100
        const BillM = this.billMoney * 100
        if (pushMoney >= 10000 && pushMoney <= BillM) {
          if (this.sysRate.sys_type == 'COUNT') {
            this.getMoney = (pushMoney - this.rate) / 100
          }
          if (this.sysRate.sys_type == 'PET') {
            const rateAmount = pushMoney * (this.rate / 1000);
            console.log(rateAmount);
            this.getMoney = (pushMoney - rateAmount) / 100;
          }
        } else {
          tips('danger', '最低提现金额100元且不能超过余额')
        }

      },
      async submit(bvModalEvt) {
        bvModalEvt.preventDefault()
        if (this.form.pushMoney && this.form.card && this.form.bank && this.form.name && this.form.phone) {
          const value = await this.$bvModal.msgBoxConfirm("即将申请,是否继续?", { buttonSize: 'sm', okVariant: 'success', cancelVariant: 'danger', okTitle: '确认', cancelTitle: '取消', hideHeaderClose: true, centered: true, noCloseOnBackdrop: true });
          if (value) {
           
            const form = {
              push_money: parseInt(this.form.pushMoney) * 100,
              get_money: this.getMoney * 100,
              rate_money: this.rate,
              bank_code: this.form.card,
              bank_name: this.form.bank,
              name: this.form.name,
              phone: this.form.phone,
              demain: this.form.demain
            }
            const data = await post('/collect/cashier/settelement/push', form)
            console.log(data)
            if (data.code == 'ok') {
              tips('success', '申请提交成功')
            } else {
              tips('danger', data.message)
            }
          }
        } else {
          tips('danger', '输入框不能为空')
        }


      }
    }

  }
</script>
<style scoped>

</style>