let menus = [
  // { id: 0, level:1 , name: '首页', type: "link", url: "/home", icon: 'far fa-circle nav-icon', isShow: true },
  {
    id: 1,
    level: 1,
    name: '系统',
    type: "button",
    isSelected: false,
    isExpanded: false,
    icon: 'nav-icon fas fa-tachometer-alt',
    isShow: true,
    subMenu: [
      
      { id: 9, level: 2, name: '首页', type: "link", url: "/home", icon: 'far fa-circle nav-icon', isShow: true },
      { id: 10, level: 2, name: '我的账号', type: "link", url: "/userCenter", icon: 'far fa-circle nav-icon', isShow: true },
      {
        id: 12,
        level: 2,
        name: '账号管理',
        type: "button",
        isSelected: false,
        isExpanded: false,
        icon: 'fa fa fa-user nav-icon',
        isShow: false,
        subMenu: [
          { id: 121, level: 3, name: '账号列表', type: "link", url: "/overview", icon: 'far fa-circle nav-icon', isShow: true },
          { id: 122, level: 3, name: '商户列表', type: "link", url: "/merchantList", icon: 'far fa-circle nav-icon', isShow: true },
          { id: 123, level: 3, name: '收银台总列表', type: "link", url: "/adminCashList", icon: 'far fa-circle nav-icon', isShow: true },
          { id: 125, level: 3, name: '在线用户', type: "link", url: "/userOnline", icon: 'far fa-circle nav-icon', isShow: true },
        ]
      },
      { id: 13, level: 1, name: '资金提现列表', type: "link", url: "/witList", icon: 'far fa-circle nav-icon', isShow: false },
      { id: 14, level: 1, name: '平台统计', type: "link", url: "/collection", icon: 'far fa-circle nav-icon', isShow: false },
      { id: 15, level: 1, name: '结算列表', type: "link", url: "/adminRecordList", icon: 'far fa-circle nav-icon', isShow: false },
      {
        id: 16,
        level: 2,
        name: '订单管理',
        type: "button",
        isSelected: false,
        isExpanded: false,
        icon: 'fa fa fa-check nav-icon',
        isShow: false,
        subMenu: [
          { id: 161, level: 3, name: '订单列表', type: "link", url: "/adminOrderList", icon: 'far fa-circle nav-icon', isShow: true },
          { id: 162, level: 3, name: '已完成订单', type: "link", url: "/adminFinished", icon: 'far fa-circle nav-icon', isShow: true },
          { id: 163, level: 3, name: '未支付订单', type: "link", url: "/adminUnPaid", icon: 'far fa-circle nav-icon', isShow: true },
          { id: 164, level: 3, name: '失败订单', type: "link", url: "/adminFaild", icon: 'far fa-circle nav-icon', isShow: true },
          { id: 165, level: 3, name: '流水列表', type: "link", url: "/adminSerial", icon: 'far fa-circle nav-icon', isShow: true },

        ]
      },
    ]
  },
  {
    id: 2,
    level: 1,
    name: '代收',
    type: "button",
    isExpanded: true,
    isSelected: false,
    icon: 'nav-icon fas fa-tachometer-alt',
    isShow: false,
    subMenu: [
      { id: 20, level: 2, name: '管理中心', type: "link", url: "/manageCenter", icon: 'far fa-circle nav-icon', isShow: true },
      { id: 21, level: 2, name: '资金记录', type: "link", url: "/fundRcord", icon: 'far fa-circle nav-icon', isShow: true },
      { id: 22, level: 2, name: '结算列表', type: "link", url: "/recordList", icon: 'far fa-circle nav-icon', isShow: true },
      { id: 23, level: 3, name: '收银台列表', type: "link", url: "/cashList", icon: 'far fa-circle nav-icon', isShow: true },
      { id: 24, level: 2, name: '商户信息', type: "link", url: "/mchInfo", icon: 'far fa-circle nav-icon', isShow: true },
      { id: 25, level: 2, name: '物流平台', type: "link", url: "/logistics", icon: 'far fa-circle nav-icon', isShow: true },
      {
        id: 26,
        level: 2,
        name: '拼多多',
        type: "button",
        icon: 'far fa-circle nav-icon',
        isSelected: false,
        isExpanded: false,
        isShow: true,
        subMenu: [
          // { id: 260, level: 4, name: '统计面板', type: "link", url: "/statisPanel", icon: 'far fa-circle nav-icon', isShow: true },
          // { id: 231, level: 4, name: '配置信息', type: "link", url: "/configInfo", icon: 'far fa-circle nav-icon', isShow: true },
          { id: 262, level: 4, name: '小号管理', type: "link", url: "/buyer", icon: 'far fa-circle nav-icon', isShow: true },
          //  { id: 243, level: 4, name: '收银台', type: "link", url: "/platForm", icon: 'far fa-circle nav-icon', isShow: true },
          { id: 264, level: 4, name: '店铺管理', type: "link", url: "/shop", icon: 'far fa-circle nav-icon', isShow: true },
          // { id: 265, level: 4, name: '店铺对账', type: "link", url: "/billSerial", icon: 'far fa-circle nav-icon', isShow: true },
          // { id: 266, level: 4, name: '订单列表', type: "link", url: "/order", icon: 'far fa-circle nav-icon', isShow: true },
          // { id: 235, level: 4, name: '发货地址', type: "link", url: "/address", icon: 'far fa-circle nav-icon', isShow: true },            
        ]
      },
      {
        id: 27,
        level: 2,
        name: '订单管理',
        type: "button",
        icon: 'far fa-circle nav-icon',
        isSelected: false,
        isExpanded: false,
        isShow: true,
        subMenu: [
          { id: 270, level: 4, name: '全部订单', type: "link", url: "/allOrder", icon: 'far fa-circle nav-icon', isShow: true },
          { id: 271, level: 4, name: '已完成订单', type: "link", url: "/finished", icon: 'far fa-circle nav-icon', isShow: true },
          { id: 272, level: 4, name: '未支付订单', type: "link", url: "/Unpaid", icon: 'far fa-circle nav-icon', isShow: true },
          { id: 273, level: 4, name: '失败订单', type: "link", url: "/faild", icon: 'far fa-circle nav-icon', isShow: true },
          { id: 274, level: 4, name: '待发货订单', type: "link", url: "/UnDelivered", icon: 'far fa-circle nav-icon', isShow: true },
          { id: 275, level: 4, name: '待收货订单', type: "link", url: "/UnReceipt", icon: 'far fa-circle nav-icon', isShow: true },

        ]
      }
    ]
  },
  { id: 3, level: 1, name: 'VPN', type: "button", isSelected: false, isExpanded: false, icon: 'nav-icon fas fa-tachometer-alt', isShow: false },

  {
    id: 4,
    level: 1,
    name: '收银台',
    type: "button",
    isExpanded: false,
    isSelected: false,
    icon: 'nav-icon fa fa-user-secret',
    isShow: false,
    subMenu: [

      { id: 41, level: 2, name: '管理中心', type: "link", url: "/controlCenter", icon: 'far fa-circle nav-icon', isShow: true },
      // { id: 43, level: 2, name: '统计', type: "link", url: "/cashierInfo", icon: 'far fa-circle nav-icon', isShow: true },
      { id: 46, level: 2, name: '线上收款', type: "link", url: "/text", icon: 'far fa-circle nav-icon', isShow: true },

      {
        id: 42,
        level: 2,
        name: '账户管理',
        type: "button",
        isExpanded: false,
        isSelected: false,
        icon: 'nav-icon fa fa-user',
        isShow: true,
        subMenu: [
          { id: 420, level: 2, name: '基本信息', type: "link", url: "/cashMessage", icon: 'far fa-circle nav-icon', isShow: true },
        ]
      },
      {
        id: 45,
        level: 2,
        name: '财务管理',
        type: "button",
        isExpanded: false,
        isSelected: false,
        icon: 'nav-icon fas fa-chart-pie',
        isShow: true,
        subMenu: [
          { id: 45, level: 2, name: '资金记录', type: "link", url: "/serialList", icon: 'far fa-circle nav-icon', isShow: true },
        ]
      },
      {
        id: 47,
        level: 2,
        name: '结算管理',
        type: "button",
        isExpanded: false,
        isSelected: false,
        icon: 'nav-icon fa fa fa-check',
        isShow: true,
        subMenu: [
          { id: 470, level: 2, name: '结算申请', type: "link", url: "/setApply", icon: 'far fa-circle nav-icon', isShow: true },
          { id: 471, level: 2, name: '结算记录', type: "link", url: "/setRecord", icon: 'far fa-circle nav-icon', isShow: true },

        ]
      },
      {
        id: 48,
        level: 2,
        name: '订单管理',
        type: "button",
        isExpanded: false,
        isSelected: false,
        icon: 'nav-icon fas fa-edit',
        isShow: true,
        subMenu: [
          { id: 480, level: 2, name: '订单列表', type: "link", url: "/orderList", icon: 'far fa-circle nav-icon', isShow: true },
        ]
      },
    ]
  },
  
];
let levelNum = 1;
let startExpand = []; // 保存刷新后当前要展开的菜单项
function setExpand(source, url) {
  let sourceItem = '';
  for (let i = 0; i < source.length; i++) {
    sourceItem = JSON.stringify(source[i]); // 把菜单项转为字符串
    if (sourceItem.indexOf(url) > -1) { // 查找当前 URL 所对应的子菜单属于哪一个祖先菜单
      if (source[i].type === 'button') { // 导航菜单为按钮
        source[i].isSelected = true; // 设置选中高亮
        source[i].isExpanded = true; // 设置为展开
        startExpand.push(source[i]);
        // 递归下一级菜单，以此类推
        setExpand(source[i].subMenu, url);
      }
      break;
    }
  }
}

const state = {
  menus,
  levelNum,
};
const mutations = {
  changeStatus(state, payload) {
    state.menus = payload
  },
  changeToken(state, payload) {
    state.token = payload
  },
  findParents(state, payload) {
    if (payload.menu.type === "button") {
      payload.menu.isExpanded = !payload.menu.isExpanded;
    } else if (payload.menu.type === "link") {
      if (startExpand.length > 0) {
        for (let i = 0; i < startExpand.length; i++) {
          startExpand[i].isSelected = false;
        }
      }
      startExpand = []; // 清空展开菜单记录项
      setExpand(state.menus, payload.menu.url);
    }
  },
  firstInit(state, payload) {
    setExpand(state.menus, payload.url);
  }
}
export default {
  state,
  mutations,
};