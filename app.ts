import { CLOUD_ENV } from './env';

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
    wx.cloud.init({
      env: CLOUD_ENV,
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
