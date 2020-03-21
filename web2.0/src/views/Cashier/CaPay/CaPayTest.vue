<template>
  <div id="text">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">代付测试</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">代付测试</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
    <div class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12">
            <!-- <div class="callout callout-info">
             
            </div> -->
            <div class="invoice p-3 mb-3">
              <!-- title row -->
              <div class="row">
                <div class="col-md-12">
                  <b-form ref="formValid" validated>
                    <div class="row">
                      <div class="col-md-6">
                        <b-form-group id="input-group-5" label="简码:" label-for="code">
                          <b-form-input id="code" v-model="form.code" required></b-form-input>
                        </b-form-group>
                      </div>
                      <div class="col-md-6">
                        <b-form-group id="input-group-6" label="密钥:" label-for="secret">
                          <b-form-input id="secret" v-model="form.secret" required></b-form-input>
                        </b-form-group>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <b-form-group id="input-group-7" label="收款人:" label-for="toCardOwner">
                          <b-form-input id="toCardOwner" v-model="form.to_card_owner" required></b-form-input>
                        </b-form-group>
                      </div>
                      <div class="col-md-6">
                        <b-form-group id="input-group-9" label="收款卡号:" label-for="toCardNo">
                          <b-form-input id="toCardNo" v-model="form.to_card_no" required></b-form-input>
                        </b-form-group>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <b-form-group id="input-group-10" label="收款银行:" label-for="toCardBank">
                          <b-form-input id="toCardBank" v-model="form.to_card_bank" required></b-form-input>
                        </b-form-group>
                      </div>
                      <div class="col-md-6">
                        <b-form-group id="input-group-11" label="收款手机:" label-for="toPhone">
                          <b-form-input id="toPhone" v-model="form.to_phone" required></b-form-input>
                        </b-form-group>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <b-form-group id="input-group-12" label="收款人身份证:" label-for="toIdcard">
                          <b-form-input id="toIdcard" v-model="form.to_idcard" required></b-form-input>
                        </b-form-group>
                      </div>
                      <div class="col-md-6">
                        <b-form-group id="notify_url" label="回调地址:" label-for="notify_url">
                          <b-form-input id="notify_url" v-model="form.notify_url" required></b-form-input>
                        </b-form-group>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <b-form-group id="input-group-3" label="金额:" label-for="amount">
                          <b-form-input id="amount" v-model="amount" required></b-form-input>
                        </b-form-group>
                      </div>
                      <div class="col-md-6">
                        <b-form-group id="input-group-2" label="备注:" label-for="note">
                          <b-form-input id="note" v-model="form.note" required></b-form-input>
                        </b-form-group>
                      </div>

                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <div style="color:red;" v-if="timerShow">{{timer}}</div>
                      </div>
                      <div class="col-md-6">
                        <div style="text-align:right;margin:10px 0px;">
                          <b-button v-if="!isShow" variant="primary" disabled>
                            <b-spinner small type="grow"></b-spinner>
                            {{payStatus}}
                          </b-button>
                          <b-button v-if="isShow" variant="primary" @click="submit">确 定</b-button>
                        </div>
                      </div>
                    </div>
                  </b-form>
                  <!-- <form style="display:none" method="post" action="https://pddapi.beikevip8.com/pay/pdd/order/pay"> -->

                  <!-- <form style="display:none" target='iframe' method="post" action="http://192.168.110.161:9006/pay/transfer"> -->
                  <form style="display:none" method="post" :action="baseUrl+'/collect/transaction/counter'">
                    <input type="hidden" name="code" ref="code" />
                    <input type="hidden" name="order_no" ref="order_no" />
                    <input type="hidden" name="amount" ref="amount" />
                    <input type="hidden" name="to_card_owner" ref="to_card_owner" />
                    <input type="hidden" name="to_card_no" ref="to_card_no" />
                    <input type="hidden" name="sign" ref="sign" />
                    <input type="hidden" name="to_card_bank" ref="to_card_bank" />
                    <input type="hidden" name="to_phone" ref="to_phone" />
                    <input type="hidden" name="to_idcard" ref="to_idcard" />
                    <input type="hidden" name="note" ref="note" />
                    <input type="hidden" name="notify_url" ref="notify_url" />
                    <input type="submit" ref="submit" />
                  </form>
                  <iframe id="frame" name="iframe" style="display:none;"></iframe>

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
  import { tips, post, domain } from '@/facade.js'
  import crypto from "crypto"
  //   import { setInterval } from 'timers'
  //   import QRCode from 'qrcodejs2'
  export default {
    name: 'ceshi',
    data() {
      return {
        baseUrl: document.location.protocol + '//' + domain,
        codes: [],
        hiddenForm: ['code', 'no', 'amount', 'channel_type', 'pay_type', 'sign', 'return_type', 'notify_url'],
        form: {
          code: '',
          secret: '',
          to_card_owner: '杨永芝',
          to_card_no: '4563516105008072149',
          to_card_bank: '中国银行',
          to_phone: '15962949673',
          to_idcard: '32456812115541',
          note: '测试',
          notify_url: 'www.baidu.com'
        },
        amount: "",
        key: "",
        type: true,
        code: "",
        timeId: '',
        transforNo: '',
        isShow: true,
        payStatus: '初始化中...',
        timerShow: false,
        timer: ''
      }
    },
    async created() {
      // const data = await getMchInfo()
      // if (data) {
      //   // this.key = data.key
      //   this.mch_no = data.no
      // }

      await this.getCode();
    },
    destroyed: function () {
      if(this.timeId){
        clearInterval(this.timeId)
      }
    },
    methods: {
      /**获取code */
      async getCode() {
        const data = await post('/collect/cashier/info');
        if (data.code == 'ok') {
          this.form.code = data.result.no;
          this.form.secret = data.result.key;
        } else {
          tips('error', data.message)
        }
      },

      /**提交付款 */
      async submit(bvModalEvt) {
        bvModalEvt.preventDefault();
        const valid = this.$refs.formValid.checkValidity();
        if (valid) {
          this.sign()
        }
      },
      async sign() {
        const form = {
          code: this.form.code,
          order_no: 'PY' + Date.now(),
          amount: parseFloat(this.amount) * 100,
          to_card_owner: this.form.to_card_owner,
          to_card_no: this.form.to_card_no,
          to_card_bank: this.form.to_card_bank,
          to_phone: this.form.to_phone,
          to_idcard: this.form.to_idcard,
          note: this.form.note,
          notify_url: this.form.notify_url,
        }
        const sign_obj = Object.assign({}, form)
        const sign_str = Object.keys(sign_obj).sort().map(key => key + '=' + sign_obj[key]).join('&');
        const md5 = crypto.createHash('md5');
        let check_sign = md5.update(`${sign_str}${this.form.secret}`).digest('hex')
        let sign = check_sign.toUpperCase()
        sign_obj.sign = sign
        console.log(sign_obj)
        // this.$refs.code.value = sign_obj.code;
        // this.$refs.order_no.value = sign_obj.order_no;
        // this.$refs.amount.value = sign_obj.amount;
        // this.$refs.to_card_owner.value = sign_obj.to_card_owner;
        // this.$refs.to_card_no.value = sign_obj.to_card_no;
        // this.$refs.sign.value = sign_obj.sign;
        // this.$refs.to_card_bank.value = sign_obj.to_card_bank;
        // this.$refs.to_phone.value = sign_obj.to_phone;
        // this.$refs.to_idcard.value = sign_obj.to_idcard;
        // this.$refs.note.value = sign_obj.note;
        // this.$refs.notify_url.value = sign_obj.notify_url;
        // this.$refs.submit.click();

        const data = await post('/pay/transfer', sign_obj)
        if (data.code == 'ok') {
          this.isShow = false;
          this.timerShow = true;
          this.timeId = setInterval(() => this.lunxun(data.transfer_no), 3000)
        } else {
          tips('danger', data.message)
        }
      },
      async lunxun(no) {
        const data = await post('/pay/auto/query', { transfer_no: no })
        if (data.code == 'ok') {
          if (data.order.status == 'INIT') {
            this.payStatus = '初始化中...'
          } else if (data.order.status == 'PAYING') {
            this.payStatus = '支付中...'
            // this.timer = `距离超时还有:${this.$moment(data.order.end_time2).diff(new Date(),'seconds')}`
          } else if (data.order.status == 'SUCCESS') {
            tips('success', '支付成功')
            this.isShow = true
            clearInterval(this.timeId)
          } else if (data.order.status == 'TIMEOUT') {
            this.isShow = true
            clearInterval(this.timeId);
            tips('danger', '订单超时')
          } else if (data.order.status == 'FAILED') {
            this.isShow = true
            clearInterval(this.timeId);
            tips('danger', '订单失败')

          }
        } else {
          tips('danger', data.message)
        }
      }
    }

  }
</script>
<style scoped>

</style>