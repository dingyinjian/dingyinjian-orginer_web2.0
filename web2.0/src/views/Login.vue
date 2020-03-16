<template>
  <div id="login" class="login-page">
    <div class="login-box">
      <div class="login-logo">
        <b>登 陆</b>
      </div>
      <!-- /.login-logo -->
      <div class="card">
        <div class="card-body login-card-body">
          <p class="login-box-msg">代收系统</p>

          <form action="../../index3.html" method="post">
            <div class="input-group mb-3">
              <input type="email" class="form-control" v-model="account" placeholder="账号">
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-envelope"></span>
                </div>
              </div>
            </div>
            <div class="input-group mb-3">
              <input type="password" v-model="password" class="form-control" placeholder="密码" @keyup.enter="onSubmit">
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-lock"></span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-8">
                <div class="icheck-primary">
                  <router-link to="/reg">忘记密码？</router-link>      
                </div>
              </div>
              <!-- /.col -->
              <div class="col-4" style="text-align:right;">
                <b-button type="button" size="sm" variant="primary" @click="onSubmit">登 陆
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
  import { tips, setCookie, post,obj } from '@/facade'
  export default {
    name: "login",
    data() {
      return {
        account: '2405260742@qq.com',
        password: '123456'
      };
    },
    methods: {
      /**登陆 */
      async onSubmit() {
        const form = { key: this.account, password: this.password, type: 'email' }
        const data = await post('/ucenter/login', form)
        if (data.code == 'ok') {
          tips("success", "登陆成功");
          setCookie('origin_token', data.token, 1);
          obj.token = data.token;
          this.$router.push({path:'/'});
        } else {
          tips('danger', data.message)
        }
      }
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