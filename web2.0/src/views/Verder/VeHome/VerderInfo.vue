<template>
  <div id="venderInfo">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">码商信息</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">码商信息</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
    <div class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-3">
            <!-- Profile Image -->
            <div class="card card-primary card-outline">
              <div class="card-body box-profile">
                <div class="text-center">
                  <img class="profile-user-img img-fluid img-circle" src="/user3-128x128.jpg" alt="User profile picture">
                </div>

                <h3 class="profile-username text-center">{{userInfo.email}}</h3>

                <p class="text-muted text-center" :class="userInfo.enabled==1?'green':'red'">{{userInfo.enabled==1?'启用':'关闭'}}</p>

                <ul class="list-group list-group-unbordered mb-3">
                  <li class="list-group-item">
                    <b>账号名称:</b> <a class="float-right">{{userInfo.uname}}</a>
                  </li>
                  <li class="list-group-item">
                    <b>手机号码:</b> <a class="float-right">{{userInfo.phone}}</a>
                  </li>
                  <li class="list-group-item">
                    <b>用户角色:</b> <a class="float-right"><span style="padding:3px;border-radius: 3px;color: #fff; background: #28a745;">{{role}}</span></a>
                  </li>
                  <li class="list-group-item">
                    <b>登陆凭证:</b> <a class="float-right">{{userInfo.token}}</a>
                  </li>
                </ul>
                <button @click="passwordModel=true;passForm.key=userInfo.email;" class="btn btn-primary btn-block"><b>密码重置</b></button>

              </div>
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
          </div>
          <div class="col-md-9">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">码商信息</h3>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-12">
                    <b-input-group prepend="名称" class="mt-3">
                      <b-form-input v-model="venInfo.name" readonly></b-form-input>
                      <b-input-group-append>
                        <b-button variant="info" @click.prevent="model_edit=true;name=true;edit()">编辑</b-button>
                      </b-input-group-append>
                    </b-input-group>
                    <b-input-group prepend="商户号" class="mt-3">
                      <b-form-input v-model="venInfo.no" readonly></b-form-input>
                    </b-input-group>
                    <b-input-group prepend="密钥" class="mt-3">
                      <b-form-input v-model="venInfo.key" readonly></b-form-input>
                      <b-input-group-append>
                        <b-button variant="info" @click.prevent="update({id:venInfo.id,secret:true})">更新</b-button>
                      </b-input-group-append>
                    </b-input-group>
                    <b-input-group prepend="白名单" class="mt-3">
                      <b-form-input v-model="venInfo.ip_white_list" readonly></b-form-input>
                      <b-input-group-append>
                        <b-button variant="info" @click.prevent="model_edit=true;whiteList=true;edit()">编辑</b-button>
                      </b-input-group-append>
                    </b-input-group>
                    <b-input-group prepend="通知地址" class="mt-3">
                      <b-form-input v-model="venInfo.notify_url" readonly></b-form-input>
                      <b-input-group-append>
                        <b-button variant="info" @click.prevent="model_edit=true;notifyUrl=true;edit()">编辑</b-button>
                      </b-input-group-append>
                    </b-input-group>
                    <b-input-group prepend="状态" class="mt-3">
                      <b-form-input v-model="venInfo.status" readonly></b-form-input>
                    </b-input-group>
                    <b-input-group prepend="创建时间" class="mt-3">
                      <b-form-input v-model="venInfo.create_at" readonly></b-form-input>
                    </b-input-group>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <!-- About Me Box -->
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">登陆记录</h3>
              </div>
              <!-- /.card-header -->
              <div class="card-body">
                <strong><i class="fas fa-map-marker-alt mr-1"></i>上一次登陆IP</strong>
                <p class="text-muted">{{userInfo.last_ip}}</p>
                <hr>
                <strong> <i class="fas fa-book mr-1"></i>上一次登陆时间</strong>
                <p class="text-muted">{{loginTime}}</p>
                <hr>
                <strong><i class="fas fa-pencil-alt mr-1"></i>账号创建时间</strong>
                <p class="text-muted">{{createTime}}</p>
              </div>
              <!-- /.card-body -->
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <b-modal centered v-model="model_edit" title="编辑用户信息" @hidden="infoForm={};name=false;whiteList=false;notifyUrl=false" @ok="editOk" no-close-on-backdrop>
          <b-form ref="formValid" validated>
            <div class="row">
              <div class="col-md-12" v-if="name">
                <b-form-group id="input-group-4" label="名称:" label-for="name">
                  <b-form-input id="name" v-model="infoForm.name" required></b-form-input>
                </b-form-group>
              </div>
              <div class="col-md-12" v-if="whiteList">
                <b-form-group id="input-group-1" label="白名单:" label-for="white_list">
                  <b-form-input id="white_list" v-model="infoForm.ip_white_list" required></b-form-input>
                </b-form-group>
              </div>
              <div class="col-md-12" v-if="notifyUrl">
                <b-form-group id="input-group-7" label="通知地址" label-for="notify_url">
                  <b-form-input id="notify_url" v-model="infoForm.notify_url" required></b-form-input>
                </b-form-group>
              </div>
            </div>
          </b-form>
          <span slot="modal-cancel">取消</span>
          <span slot="modal-ok">确定</span>
        </b-modal>
      </div>

      <div class="row">
        <b-modal centered v-model="passwordModel" title="密码重置" @hidden="passForm={}" @ok="passOk">
          <b-form ref="passValid" validated>
            <div class="row">
              <div class="col-md-12">
                <b-form-group id="input-group-1" label="账号" label-for="key">
                  <b-form-input id="key" v-model="passForm.key" required disabled></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-1" label="新密码:" label-for="password" invalid-feedback="不能为空">
                  <b-form-input id="password" type="password" v-model="passForm.password" required></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-1" label="验证码:" label-for="code">
                  <div class="input-group mt-3">
                    <b-form-input id="code" v-model="passForm.code" required></b-form-input>
                    <b-input-group-append>
                      <b-button variant="info" @click="getVeriyCode" :disabled="isGetCode">{{codeMsg}}</b-button>
                    </b-input-group-append>
                  </div>
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

</template>
<script>
  import { post, tips, transferTime, clearCookie } from '@/facade'
  export default {
    name: 'venderInfo',
    data() {
      return {
        venInfo: {},
        userInfo: {},
        duibiForm: {},
        infoForm: {},
        loginTime: '',
        createTime: '',
        role:null,
        name: false,
        whiteList: false,
        notifyUrl: false,
        model_edit: false,
        passwordModel: false,
        codeMsg: '获取验证码',
        isGetCode: false,
        passForm: {},
        timer: null,
        countdown: 60,
      }
    },
    async created() {
      // this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
      // this.loginTime = transferTime(this.userInfo.last_login);
      // this.createTime = transferTime(this.userInfo.create_time);
      await this.getUserInfo()
      await this.getVenInfo()
    },
    methods: {
      /**获取账号信息 */
      async getUserInfo() {
        const data = await post('/ucenter/user');
        if (data.code == 'ok') {
          this.userInfo = data.user;
          this.role=this.userInfo.roles[0];
          this.loginTime = transferTime(this.userInfo.last_login);
          this.createTime = transferTime(this.userInfo.create_time);
        } else {
          tips('danger', data.message)
        }
      },
      /**获取码商信息 */
      async getVenInfo() {
        const data = await post('/collect/vender/info')
        if (data.code == 'ok') {
          this.venInfo = data.result
          this.venInfo.status = this.venInfo.enabled == 1 ? '启用' : '关闭'
          this.venInfo.create_at = transferTime(this.venInfo.create_time)
        } else {
          tips('danger', data.message)
        }
      },
      /**编辑 */
      edit() {
        this.infoForm = Object.assign({}, this.venInfo);
        this.duibiForm = Object.assign({}, this.venInfo);
      },
      duibi() {
        const c = {};
        for (let key in this.infoForm) {
          if (this.infoForm[key] != this.duibiForm[key]) {
            c[key] = this.infoForm[key];
          }
        }
        return c;
      },
      /**更新密钥 */
      async update(e) {
        const value = await this.$bvModal.msgBoxConfirm("即将更新密钥,是否继续?", { buttonSize: 'sm', okVariant: 'success', cancelVariant: 'danger', okTitle: '确认', cancelTitle: '取消', hideHeaderClose: true, centered: true, noCloseOnBackdrop: true });
        if (value) {
          this.updateInfo(e)
        }
      },
      /**编辑确认 */
      async editOk(bvModalEvt) {
        bvModalEvt.preventDefault()
        const valid = this.$refs.formValid.checkValidity()
        const formdata = this.duibi();
        if (valid) {
          if (Object.keys(formdata).length === 0) {
            tips("danger", "没做任何修改");
          } else {
            formdata.id = this.venInfo.id;
            this.updateInfo(formdata);
          }
        }
      },
      async updateInfo(formdata) {
        // formdata.id = this.mchInfo.id;
        const data = await post('/collect/vender/update', formdata)
        // data.code == 'ok' ? this.getMchInfo() : tips('danger', data.message)
        if (data.code == 'ok') {
          tips('success', '修改成功')
          this.model_edit = false
          this.getVenInfo()
        } else {
          tips('danger', data.message)
        }
      },
      /**验证码倒计时 */
      async getVeriyCode() {
        if (this.passForm.password) {
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
            key: this.passForm.key,
            type: 'email'
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
          tips('warning', '密码不能为空')
        }
      },
      /**密码重置 */
      async passOk(bvModalEvt) {
        bvModalEvt.preventDefault()
        const valid = this.$refs.passValid.checkValidity()
        this.passForm.type = 'email'
        if (valid) {
          const data = await post('/ucenter/pwd', this.passForm);
          if (data.code == 'ok') {
            tips('success', '修改成功,请重新登录');
            await post("/ucenter/logout");
            clearCookie('origin_token')
            localStorage.clear()
            this.$router.replace({ path: '/login' });
          } else {
            tips('danger', data.message);
          }
        }
      },
    }
  }
</script>
<style scoped>
  .green {
    color: green !important
  }

  .red {
    color: red !important
  }
</style>