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
                            <input type="email" class="form-control" placeholder="账号">
                            <div class="input-group-append">
                                <div class="input-group-text">
                                    <span class="fas fa-envelope"></span>
                                </div>
                            </div>
                        </div>
                        <div class="input-group mb-3">
                            <input type="password" class="form-control" placeholder="密码">
                            <div class="input-group-append">
                                <div class="input-group-text">
                                    <span class="fas fa-lock"></span>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-8">
                                <div class="icheck-primary">
                                    忘记密码？
                                </div>
                            </div>
                            <!-- /.col -->
                            <div class="col-4">
                                <button type="submit" class="btn btn-primary btn-block">登 陆</button>
                            </div>
                            <!-- /.col -->
                        </div>
                    </form>
                    <!-- <div class="social-auth-links text-center mb-3">
                        <p>- OR -</p>
                        <a href="#" class="btn btn-block btn-primary">
                            <i class="fab fa-facebook mr-2"></i> Sign in using Facebook
                        </a>
                        <a href="#" class="btn btn-block btn-danger">
                            <i class="fab fa-google-plus mr-2"></i> Sign in using Google+
                        </a>
                    </div> -->
                </div>
                <!-- /.login-card-body -->
            </div>
        </div>
    </div>

</template>

<script>
    //   import { tips, setCookie, post, obj } from '../facade'
    // import store from '../store/index'
    export default {
        name: "login",
        data() {
            return {
                form: {
                    // key: '492670@qq.com',
                    // password: '10090807',
                    // code: '10090807',
                    //   key: '2405260743@qq.com',
                    // password: '123456',
                },
                codeLog: false,
                codeMsg: '获取验证码',
                timer: null,
                countdown: 60,
                isGetCode: false,
                id: ""
            };
        },
        methods: {
            /**登陆 */
            //   async onSubmit(evt) {
            //     evt.preventDefault();
            //     const num = this.form.key;
            //     if (!num) {
            //       tips('warning', '账号不能为空');
            //     } else {
            //       if (!this.form.type) {
            //         if (/^\d{11}$/.test(num)) {
            //           this.form.type = 'phone';
            //         } else if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(num)) {
            //           this.form.type = 'email';
            //         } else {
            //           tips('danger', '账号格式不正确');
            //         }
            //       }
            //       if (this.codeLog && this.form.password) {
            //         delete this.form.password;
            //       } else if (!this.codeLog && this.form.code) {
            //         delete this.form.code;
            //       }
            //       const data = await post('/ucenter/login', this.form);
            //       if (data.code == 'ok') {
            //         console.log(data);
            //         tips("success", "登陆成功");
            //         // this.id = data.id;
            //         obj.token = data.token;
            //         setCookie('origin_token', data.token, 1);
            //         // const redirect = this.$route.query.redirect;
            //         this.$router.push({ path: "/"});
            //         // this.getInfo();
            //       } else {
            //         tips('danger', data.message);
            //       }
            //     }
            //   },
            //   /**校验账号格式 */
            //   Authentication(data) {
            //     if (data) {
            //       if (/^\d{11}$/.test(data)) {
            //         this.form.type = 'phone';
            //       } else if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(data)) {
            //         this.form.type = 'email';
            //       } else {
            //         tips('danger', '账号格式不正确');
            //       }
            //     }
            //   },
            //    /**获取验证码 */
            //   async getVeriyCode() {
            //     if (this.form.type) {
            //       if (!this.timer) {
            //         this.timer = setInterval(() => {
            //           if (this.countdown > 0 && this.countdown <= 60) {
            //             this.countdown--;
            //             if (this.countdown !== 0) {
            //               this.codeMsg = "重新发送(" + this.countdown + ")";
            //               this.isGetCode = true;
            //             } else {
            //               clearInterval(this.timer);
            //               this.codeMsg = "获取验证码";
            //               this.isGetCode = false;
            //               this.countdown = 120;
            //               this.timer = null;
            //             }
            //           }
            //         }, 1000);
            //       }
            //       const data = await post('/ucenter/auth', {
            //         method: '登录验证',
            //         key: this.form.key,
            //         type: this.form.type
            //       });
            //       if (data.code == 'ok') {
            //         tips('success', '发送成功');
            //       } else {
            //         tips('danger', data.message);
            //         clearInterval(this.timer);
            //         this.codeMsg = "获取验证码";
            //         this.isGetCode = false;
            //         this.countdown = 120;
            //         this.timer = null;
            //       }
            //     } else {
            //       tips('danger', '请保证账号不为空且正确')
            //     }
            //   },
        }
    };
</script>
<style scoped>
.login-box, .register-box{
    position:absolute;
    top:40%;
    left:50%;
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    transform:translate(-50%,-50%);
}
</style>