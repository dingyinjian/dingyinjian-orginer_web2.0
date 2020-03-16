<template>
  <div id="Layout" >
    <div class="wrapper">
      <!-- Navbar -->
      <nav class="main-header navbar navbar-expand navbar-white navbar-light">
        <!-- Left navbar links -->
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" data-widget="pushmenu" href="#"><i class="fas fa-bars"></i></a>
          </li>
        </ul>


        <!-- Right navbar links -->
        <ul class="navbar-nav ml-auto">
          <!-- Messages Dropdown Menu -->
            <button type="button" @click="logout" class="btn btn-block btn-primary btn-sm">登 出</button>
         
        </ul>
      </nav>
      <!-- /.navbar -->

      <!-- Main Sidebar Container -->
      <aside class="main-sidebar sidebar-dark-primary elevation-4">
        <!-- Brand Logo -->
        <a href="/layout" class="brand-link">
          <img src="/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3"
            style="opacity: .8">
          <span class="brand-text font-weight-light">代收系统</span>
        </a>

        <!-- Sidebar -->
        <div class="sidebar">
          <!-- Sidebar user panel (optional) -->
          <div class="user-panel mt-3 pb-3 mb-3 d-flex">
            <div class="image">
              <img src="user8-128x128.jpg" class="img-circle elevation-2" alt="User Image">
            </div>
            <div class="info">
              <a href="#" class="d-block">{{curUser}}</a>
            </div>
          </div>

          <!-- Sidebar Menu -->
          <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              <Tree-view></Tree-view>
            </ul>
          </nav>
          <!-- /.sidebar-menu -->
        </div>
        <!-- /.sidebar -->
      </aside>

      <!-- Content Wrapper. Contains page content -->
      <div class="content-wrapper">
        <router-view></router-view>
      </div>


      <!-- Main Footer -->
      <footer class="main-footer">
        <!-- To the right -->
        <div class="float-right d-none d-sm-inline">
          Anything you want
        </div>
        <!-- Default to the left -->
        <strong>Copyright &copy; 2014-2019 </strong> All rights reserved.
      </footer>
    </div>
  </div>
</template>

<script>
  // @ is an alias to /src
  import TreeView from "@/components/TreeView";
  import { post, tips, clearCookie } from '@/facade'

  export default {
    name: 'Layout',
     components: {
      TreeView
    },
    data(){
      return{
        curUser:'默认用户',
        userInfo:{}
      }
    },
    async created(){
       await this.getInfo()
    },
    methods: {
       /*获取用户信息和角色*/
      async getInfo() {
        const data = await post('/ucenter/info');
        if (data.code == 'ok') {
          this.curUser=data.user.email;
          localStorage.setItem('userInfo', JSON.stringify(data.user));
          let menus = this.$store.state.menusModule.menus
          const roles = data.user.roles;
          if (roles.length > 0) {
            if (roles.indexOf('admin') != -1) {
              menus[0].isShow = true
            } else {
              menus[0].isShow = false
            }
            if (roles.indexOf('merchant') != -1) {
              menus[1].isShow = true                        
            } else {
              menus[1].isShow = false             
            }
            if (roles.indexOf('vender') != -1){
              menus[2].isShow = true         
            }
            else menus[2].isShow = false
            if (roles.indexOf('cashier') != -1) menus[3].isShow = true
            else menus[3].isShow = false
          } else {
            this.$router.replace({ path: '/blank' })
          }
        } else {
          tips('danger', data.message)
        }
      },
      /*登出*/
      async logout() {
        const data = await post("/ucenter/logout");
        if (data.code == 'ok') {
          clearCookie('origin_token')
          localStorage.clear()
          this.$router.replace({ path: "/login" })
        } else {
          tips("error", data.message);
        }
      },
    },

  }
</script>