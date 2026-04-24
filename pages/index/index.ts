import * as api from '../../services/api';

interface IIndexData {
  banners: ReturnType<typeof api.getBanners>;
  quickEntries: ReturnType<typeof api.getQuickEntries>;
  latestNews: ReturnType<typeof api.getLatestNews>;
  todaySchedules: ReturnType<typeof api.getTodaySchedules>;
}

Page<IIndexData, WechatMiniprogram.IAnyObject>({
  data: {
    banners: [],
    quickEntries: [],
    latestNews: [],
    todaySchedules: [],
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: '新长宁水韵名邸生活号',
      path: '/pages/index/index',
    };
  },

  loadData() {
    this.setData({
      banners: api.getBanners(),
      quickEntries: api.getQuickEntries(),
      latestNews: api.getLatestNews(),
      todaySchedules: api.getTodaySchedules(),
    });
  },

  onBannerTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: number };
    wx.showToast({ title: `Banner ${id}`, icon: 'none' });
  },

  onEntryTap(e: WechatMiniprogram.TouchEvent) {
    const { path } = e.currentTarget.dataset as { path: string };
    const tabBarPages = ['/pages/index/index', '/pages/news/news', '/pages/trade/trade', '/pages/schedule/schedule', '/pages/profile/profile'];
    if (tabBarPages.includes(path)) {
      wx.switchTab({ url: path });
    } else {
      wx.navigateTo({ url: path });
    }
  },

  onNewsTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: number };
    wx.navigateTo({ url: `/pages/news-detail/news-detail?id=${id}` });
  },

  onScheduleTap(e: WechatMiniprogram.TouchEvent) {
    wx.switchTab({ url: '/pages/schedule/schedule' });
  },

  onMoreNewsTap() {
    wx.switchTab({ url: '/pages/news/news' });
  },

  onMoreScheduleTap() {
    wx.switchTab({ url: '/pages/schedule/schedule' });
  },
});
