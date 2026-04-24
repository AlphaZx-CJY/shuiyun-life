interface IAppGlobalData {
  userInfo: WechatMiniprogram.UserInfo | null;
  systemInfo: WechatMiniprogram.SystemInfo | null;
}

App<{ globalData: IAppGlobalData }>({
  globalData: {
    userInfo: null,
    systemInfo: null,
  },

  onLaunch() {
    const systemInfo = wx.getSystemInfoSync();
    this.globalData!.systemInfo = systemInfo;

    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#F2F2F7',
    });
  },

  onShow() {
    console.log('App Show');
  },

  onHide() {
    console.log('App Hide');
  },
});
