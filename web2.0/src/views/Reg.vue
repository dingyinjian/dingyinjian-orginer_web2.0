<template>
  <div id="login" class="login-page">
    <div class="login-box">
      <div class="login-logo">
        <b>修改密码</b>
      </div>
      <!-- /.login-logo -->
      <div class="card">
        <div class="card-body login-card-body">
          <p class="login-box-msg">代收系统</p>

          <form  method="post">
            <div class="input-group mb-3">
              <input type="email" class="form-control" v-model="form.key" placeholder="账号">
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-envelope"></span>
                </div>
              </div>
            </div>
            <div class="input-group mb-3">
              <input type="password" v-model="form.password" class="form-control" placeholder="新密码" @keyup.enter="onSubmit">
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-lock"></span>
                </div>
              </div>
            </div>
            <div class="input-group mb-3">
              <input type="text" v-model="form.code" class="form-control" placeholder="验证码">
              <span class="input-group-append">
                <button type="button" size="sm" @click="getVeriyCode" :disabled="isGetCode" class="btn btn-info btn-flat">{{codeMsg}}</button>
              </span>
            </div>
            <div class="row">
              <div class="col-8" style="line-height:40px;">

                <router-link to="/login">想起密码？点击登陆</router-link>

              </div>
              <!-- /.col -->
              <div class="col-4" style="text-align:right;">
                <b-button type="button" variant="primary" @click="onSubmit">确认修改
                </b-button>
              </div>
              <!-- /.col -->
            </div>
          </form>
        </div>
        <!-- /.login-card-body -->
      </div>
    </div>
  </div>

</template>

<script>
  import { tips, post } from '@/facade'
  export default {
    name: "login",
    data() {
      return {
        codeMsg: '获取验证码',
        form: {},
        timer: null,
        countdown: 60,
        isGetCode: false
      };
    },
    methods: {
      /**获取验证码 */
      async getVeriyCode() {
        if (this.form.key) {
          if (/^\d{11}$/.test(this.form.key)) {
            this.from.type = 'phone';
            this.sendVeriyCode();
          } else if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.form.key)) {
            this.form.type = 'email';
            this.sendVeriyCode();
          } else {
            tips('danger', '账号格式不正确');
          }
        } else {
          tips('warning', '账号不能为空');
        }
      },
      async sendVeriyCode() {
        if (this.form.type) {
          if (!this.timer) {
            this.timer = setInterval(() => {
              if (this.countdown > 0 && this.countdown <= 60) {
                this.countdown--;
                if (this.countdown !== 0) {
                  this.codeMsg = "重新发送(" + this.countdown + ")";
                  this.isGetCode = true;
                } else {
                  clearInterval(this.timer);
                  this.codeMsg = "获取验证码";
                  this.isGetCode = false;
                  this.countdown = 60;
                  this.timer = null;
                }
              }
            }, 1000);
          }
          const data = await post('/ucenter/auth', {
            method: '身份验证',
            key: this.form.key,
            type: this.form.type
          });
          if (data.code == 'ok') {
            tips('success', '发送成功');
          } else {
            clearInterval(this.timer);
            this.codeMsg = "获取验证码";
            this.isGetCode = false;
            this.countdown = 60;
            this.timer = null;
            tips('danger', data.message);
          }
        } else {
          tips('danger', '请保证账号不为空且正确')
        }
      },
      /**登陆 */
      async onSubmit(evt) {
        evt.preventDefault();
        const data = await post('/ucenter/pwd', this.form);
        if (data.code == 'ok') {
          tips("success", "修改成功，请登录");
          this.$router.replace("/login");
        } else {
          tips("danger", data.message);
        }
      },
    }
  };
</script>
<style scoped>
  .login-box,
  .register-box {
    position: absolute;
    top: 40%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
</style>


