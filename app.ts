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

    // 初始化云开发环境
    wx.cloud.init({
      env: CLOUD_ENV,
      traceUser: true,
    });
  },

  onShow() {
    // App Show
  },

  onHide() {
    // App Hide
  },

  onError(err: string) {
    console.error('[app] global error:', err);
  },

  onPageNotFound(res: WechatMiniprogram.OnPageNotFoundCallbackResult) {
    console.warn('[app] page not found:', res.path);
    wx.redirectTo({ url: '/pages/index/index' });
  },
});
