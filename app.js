App({
  globalData: {
    userInfo: null,
    systemInfo: null
  },

  onLaunch() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo = systemInfo;

    // 设置导航栏为白色（iOS风格）
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#F2F2F7'
    });
  },

  onShow() {
    console.log('App Show');
  },

  onHide() {
    console.log('App Hide');
  }
});
