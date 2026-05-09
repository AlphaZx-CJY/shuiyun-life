Component({
  properties: {
    title: { type: String, value: '' },
    showBack: { type: Boolean, value: false },
    transparent: { type: Boolean, value: false },
  },
  data: {
    statusBarHeight: 44,
    navBarHeight: 44,
    menuButtonTop: 4,
    menuButtonHeight: 32,
  },
  lifetimes: {
    attached() {
      const sys = wx.getSystemInfoSync();
      const menu = wx.getMenuButtonBoundingClientRect();
      this.setData({
        statusBarHeight: sys.statusBarHeight,
        navBarHeight: (menu.top - sys.statusBarHeight) * 2 + menu.height,
        menuButtonTop: menu.top - sys.statusBarHeight,
        menuButtonHeight: menu.height,
      });
    },
  },
  methods: {
    onBackTap() {
      wx.navigateBack();
    },
  },
});
