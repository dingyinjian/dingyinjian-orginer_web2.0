let menus = [{
    id: 1,
    level: 1,
    name: '超管',
    type: "button",
    isSelected: false,
    isExpanded: true,
    icon: 'nav-icon fas fa-tachometer-alt',
    isShow: false,
    subMenu: [
      { id: 10, level: 2, name: '首页', type: "link", url: "", icon: 'far fa-circle nav-icon', isShow: true },
      { id: 11, level: 2, name: '系统信息', type: "link", url: "/userCenter", icon: 'far fa-circle nav-icon', isShow: true },
      { id: 12, level: 2, name: '商户列表', type: "link", url: "/merchantList", icon: 'far fa-circle nav-icon', isShow: true },
      { id: 13, level: 2, name: '系统设置', type: "link", url: "/sysSet", icon: 'far fa-circle nav-icon', isShow: true },
    ]
  },
  {
    id: 2,
    level: 1,
    name: '商户',
    type: "button",
    isExpanded: true,
    isSelected: false,
    icon: 'nav-icon fas fa-tachometer-alt',
    isShow: false,
    subMenu: [
      {
        id: 20,
        level: 2,
        name: '首页',
        type: "button",
        isExpanded: true,
        isSelected: false,
        icon: 'nav-icon fas fa-tachometer-alt',
        isShow: true,
        subMenu: [
          { id: 200, level: 3, name: '系统统计', type: "link", url: "/merSysStatist", icon: 'far fa-circle nav-icon', isShow: true },
          { id: 201, level: 3, name: '商户信息', type: "link", url: "/userCenter", icon: 'far fa-circle nav-icon', isShow: true },
        ]
      },
      { id: 21, level: 2, name: '码商列表', type: "link", url: "/merVerderList", icon: 'far fa-circle nav-icon', isShow: true },
      { id: 22, level: 2, name: '盘口列表', type: "link", url: "/merCashList", icon: 'far fa-circle nav-icon', isShow: true },
      { id: 23, level: 2, name: '订单管理', type: "link", url: "/merOrder", icon: 'far fa-circle nav-icon', isShow: true },
      { id: 24, level: 2, name: '流水记录', type: "link", url: "/merFlow", icon: 'far fa-circle nav-icon', isShow: true },
      { id: 25, level: 2, name: '资金管理', type: "link", url: "/merFounds", icon: 'far fa-circle nav-icon', isShow: true },
      { id: 26, level: 2, name: '其他设置', type: "link", url: "/merOther", icon: 'far fa-circle nav-icon', isShow: true },

    ]
  },
  {
    id: 3,
    level: 1,
    name: '码商',
    type: "button",
    isSelected: false,
    isExpanded: true,
    icon: 'nav-icon fas fa-tachometer-alt',
    isShow: false,
    subMenu: [
      {
        id: 30,
        level: 2,
        name: '首页',
        type: "button",
        isExpanded: true,
        isSelected: false,
        icon: 'nav-icon fas fa-tachometer-alt',
        isShow: true,
        subMenu: [
          { id: 300, level: 3, name: '码商信息', type: "link", url: "/userCenter", icon: 'far fa-circle nav-icon', isShow: true },
          { id: 301, level: 3, name: '管理统计', type: "link", url: "/veStatist", icon: 'far fa-circle nav-icon', isShow: true },
        ]
      },
      { id: 31, level: 2, name: '小号管理', type: "link", url: "/buyerMgmt", icon: 'far fa-circle nav-icon', isShow: true },
      { id: 32, level: 2, name: '物流管理', type: "link", url: "/logistics", icon: 'far fa-circle nav-icon', isShow: true },
      { id: 33, level: 2, name: '店铺管理', type: "link", url: "/venMallList", icon: 'far fa-circle nav-icon', isShow: true },
      { id: 34, level: 2, name: '订单管理', type: "link", url: "/veOrderList", icon: 'far fa-circle nav-icon', isShow: true },
      { id: 35, level: 2, name: '流水管理', type: "link", url: "/veFlow", icon: 'far fa-circle nav-icon', isShow: true },
      // { id: 36, level: 2, name: '资金记录', type: "link", url: "/veFounds", icon: 'far fa-circle nav-icon', isShow: true },
      // { id: 37, level: 2, name: '对接指南', type: "link", url: "", icon: 'far fa-circle nav-icon', isShow: true },
    ]
  },

  {
    id: 4,
    level: 1,
    name: '盘口',
    type: "button",
    isExpanded: true,
    isSelected: false,
    icon: 'nav-icon fa fa-user-secret',
    isShow: false,
    subMenu: [
      {
        id: 40,
        level: 2,
        name: '首页',
        type: "button",
        isExpanded: true,
        isSelected: false,
        icon: 'nav-icon fas fa-tachometer-alt',
        isShow: true,
        subMenu: [
          { id: 40, level: 3, name: '管理统计', type: "link", url: "/caSys", icon: 'far fa-circle nav-icon', isShow: true },
          { id: 41, level: 3, name: '盘口信息', type: "link", url: "/userCenter", icon: 'far fa-circle nav-icon', isShow: true },
        ]
      },
      { id: 41, level: 2, name: '订单管理', type: "link", url: "/caOrderList", icon: 'far fa-circle nav-icon', isShow: true },
      { id: 42, level: 2, name: '流水管理', type: "link", url: "/caFlow", icon: 'far fa-circle nav-icon', isShow: true },
      {
        id: 43,
        level: 2,
        name: '结算管理',
        type: "button",
        icon: 'far fa-circle nav-icon',
        isExpanded: false,
        isSelected: false,
        isShow: true,
        subMenu: [
          { id: 430, level: 3, name: '结算申请', type: "link", url: "/setPush", icon: 'far fa-circle nav-icon', isShow: true },
          { id: 431, level: 3, name: '结算记录', type: "link", url: "/caWithdraw", icon: 'far fa-circle nav-icon', isShow: true },
        ]
      },
      { id: 44, level: 2, name: '对接指南', type: "link", url: "/guide", icon: 'far fa-circle nav-icon', isShow: true },
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