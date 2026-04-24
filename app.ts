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

    // 初始化云开发环境
    // TODO: 开通云开发后，将 env 替换为云控制台中的真实环境 ID
    wx.cloud.init({
      env: 'your-env-id',
      traceUser: true,
    });
  },

  onShow() {
    console.log('App Show');
  },

  onHide() {
    console.log('App Hide');
  },
});
