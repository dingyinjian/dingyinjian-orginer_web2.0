<template>
  <div id="text">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">云闪付收款</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">云闪付收款</li>
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
                      <div class="col-md-12">
                        <b-form-group id="input-group-5" label="简码:" label-for="code">
                          <b-form-input id="code" v-model="form.code" required></b-form-input>
                        </b-form-group>
                      </div>
                      <div class="col-md-12">
                        <b-form-group id="input-group-6" label="密钥:" label-for="secret">
                          <b-form-input id="secret" v-model="form.secret" required></b-form-input>
                        </b-form-group>
                      </div>
                      <div class="col-md-12">
                        <b-form-group id="input-group-2" label="通道:" label-for="channel_type">
                          <b-form-select v-model="form.channel_type" :options="channelTypes" required></b-form-select>
                        </b-form-group>
                      </div>
                      <div class="col-md-12">
                        <b-form-group id="input-group-1" label="支付方式:" label-for="pay_type">
                          <b-form-select v-model="form.pay_type" :options="payTypes" required @input="payTypeChange"></b-form-select>
                        </b-form-group>
                      </div>
                      <div class="col-md-12">
                        <b-form-group id="input-group-1" label="返回类型:" label-for="pay_type">
                          <b-form-select v-model="form.return_type" :options="returnTypes" required></b-form-select>
                        </b-form-group>
                      </div>
                      <div class="col-md-12">
                        <b-form-group id="notify_url" label="回调地址:" label-for="notify_url">
                          <b-form-input id="notify_url" v-model="form.notify_url" required></b-form-input>
                        </b-form-group>
                      </div>
                      <div class="col-md-12">
                        <b-form-group id="input-group-3" label="金额:" label-for="amount">
                          <b-form-input id="amount" v-model="amount" required></b-form-input>
                        </b-form-group>
                      </div>

                    </div>
                    <div class="row">
                      <div class="col-md-12">
                        <div style="text-align:right;margin:10px 0px;">
                          <b-button variant="primary" @click="submit">确 定</b-button>
                        </div>
                      </div>
                    </div>
                  </b-form>
                  <!-- <form style="display:none" method="post" action="https://pddapi.beikevip8.com/pay/pdd/order/pay"> -->

                  <form style="display:none" method="post" target="_blank" :action="baseUrl+'/collect/transaction/counter'">
                    <!-- <form style="display:none" target="_blank" method="post" action="https://payapi.yixelnb.cn/collect/transaction/counter">            -->
                    <input type="hidden" name="code" ref="code" />
                    <input type="hidden" name="no" ref="no" />
                    <input type="hidden" name="amount" ref="amount" />
                    <input type="hidden" name="channel_type" ref="channel_type" />
                    <input type="hidden" name="pay_type" ref="pay_type" />
                    <input type="hidden" name="sign" ref="sign" />
                    <input type="hidden" name="return_type" ref="return_type" />
                    <input type="hidden" name="notify_url" ref="notify_url" />
                    <input type="submit" ref="submit" />
                  </form>
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
  import { tips, post,domain } from '@/facade.js'
  import crypto from "crypto"
  //   import QRCode from 'qrcodejs2'
  export default {
    name: 'ceshi',
    data() {
      return {
        baseUrl:document.location.protocol+'//'+domain,
        channelTypes: [
          { value: 'pdd', text: '拼多多' },
          { value: 'ysf', text: '云闪付' },
        ],
        payTypes: [
          { value: 'alipay', text: '支付宝' },
          { value: 'wechat', text: '微信' },
          { value: 'ysf', text: '云闪付' },
        ],
        returnTypes: [
          { value: 'h5', text: 'h5' },
          { value: 'api', text: 'api' },
          { value: 'ysf', text: '云闪付' },
        ],
        codes: [],
        hiddenForm: ['code', 'no', 'amount', 'channel_type', 'pay_type', 'sign', 'return_type', 'notify_url'],
        form: {
          code: '',
          secret: '',
          channel_type: "ysf",
          pay_type: 'ysf',
          return_type: 'ysf',
          notify_url:'www.baidu.com'
        },
        amount: "",
        scan_add: false,
        mobile: '',
        pc: '',
        h5: '',
        jb: '',
        dd: '',
        tpp: '',
        kb: '',
        urlList: {},
        keyList: [],
        isShow: false,
        key: "",
        type: true,
        code: "",
        param: ""
      }
    },
    async created() {
      // const data = await getMchInfo()
      // if (data) {
      //   // this.key = data.key
      //   this.mch_no = data.no
      // }
      console.log(new Date())
      await this.getCode();
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
      /**监听付款方式 */
      payTypeChange(e) {
        this.type = e == 'wechat' ? false : true
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
          no: 'PY' + Date.now(),
          amount: parseFloat(this.amount) * 100,
          channel_type: this.form.channel_type,
          pay_type: this.form.pay_type,
          return_type: this.form.return_type,
          notify_url: this.form.notify_url,
        }


        const sign_obj = Object.assign({}, form)
        const sign_str = Object.keys(sign_obj).sort().map(key => key + '=' + sign_obj[key]).join('&');
        const md5 = crypto.createHash('md5');
        console.log(this.form.secret)
        let check_sign = md5.update(`${sign_str}${this.form.secret}`).digest('hex')
        let sign = check_sign.toUpperCase()
        sign_obj.sign = sign
      
        this.$refs.code.value = sign_obj.code;
        this.$refs.no.value = sign_obj.no;
        this.$refs.amount.value = sign_obj.amount;
        this.$refs.channel_type.value = sign_obj.channel_type;
        this.$refs.pay_type.value = sign_obj.pay_type;
        this.$refs.sign.value = sign_obj.sign;
        this.$refs.return_type.value = sign_obj.return_type;
        this.$refs.notify_url.value = sign_obj.notify_url;
        this.$refs.submit.click();
        // const data = await post('/pay/pdd/order/pay', sign_obj)
        // console.log(data)
        // if (data.code == 'ok') {
        //   const list = data.url_list
        //   this.mobile = list['mobile']
        //   this.pc = list['pc']
        //   this.h5 = list['h5']
        //   this.jb = list['jb']
        //   this.dd = list['dd']
        //   this.tpp = list['tpp']
        //   this.kb = list['kb']
        //   this.scan_add = true
        // } else {
        //   tips('danger', data.message)
        // }
      },
    }

  }
</script>
<style scoped>

</style>