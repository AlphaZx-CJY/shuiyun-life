Page({
  data: {
    banners: [],
    quickEntries: [],
    latestNews: [],
    todaySchedules: []
  },

  onLoad() {
    this.loadMockData();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
  },

  onPullDownRefresh() {
    this.loadMockData();
    wx.stopPullDownRefresh();
  },

  onShareAppMessage() {
    return {
      title: '新长宁水韵名邸生活号',
      path: '/pages/index/index'
    };
  },

  loadMockData() {
    const banners = [
      { id: 1, image: '/images/banners/banner1.jpg', title: '小区绿化升级完成' },
      { id: 2, image: '/images/banners/banner2.jpg', title: '周末社区活动预告' },
      { id: 3, image: '/images/banners/banner3.jpg', title: '物业费缴纳通知' }
    ];

    const quickEntries = [
      { id: 1, icon: '🏪', label: '周边生活', color: '#1D1D1F', path: '/pages/life-info/life-info' },
      { id: 2, icon: '🔄', label: '闲置交易', color: '#1D1D1F', path: '/pages/trade/trade' },
      { id: 3, icon: '📰', label: '新闻资讯', color: '#1D1D1F', path: '/pages/news/news' },
      { id: 4, icon: '💰', label: '缴费知识', color: '#1D1D1F', path: '/pages/payment/payment' },
      { id: 5, icon: '📅', label: '便民安排', color: '#1D1D1F', path: '/pages/schedule/schedule' },
      { id: 6, icon: '🚌', label: '班车信息', color: '#1D1D1F', path: '/pages/shuttle/shuttle' }
    ];

    const latestNews = [
      {
        id: 1,
        title: '小区地下停车场维护通知',
        summary: '定于本周六对B2层进行地面养护，请业主提前挪车。',
        source: '物业中心',
        date: '2025-04-22',
        tag: '通知'
      },
      {
        id: 2,
        title: '周边新开生鲜超市，步行5分钟直达',
        summary: '位于福泉路的新生鲜超市正式营业，业主专享95折优惠。',
        source: '生活圈',
        date: '2025-04-21',
        tag: '周边'
      },
      {
        id: 3,
        title: '2025年物业费缴纳指南',
        summary: '支持线上缴纳，可享早鸟98折优惠，截止日期6月30日。',
        source: '物业中心',
        date: '2025-04-20',
        tag: '缴费'
      }
    ];

    const todaySchedules = [
      { id: 1, title: '社区义诊活动', time: '09:00-11:00', location: '中心花园', status: 'upcoming' },
      { id: 2, title: '垃圾分类宣讲', time: '14:00-15:30', location: '物业会议室', status: 'upcoming' }
    ];

    this.setData({ banners, quickEntries, latestNews, todaySchedules });
  },

  onBannerTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.showToast({ title: `Banner ${id}`, icon: 'none' });
  },

  onEntryTap(e) {
    const { path } = e.currentTarget.dataset;
    // tabBar页面使用switchTab，非tabBar页面使用navigateTo
    const tabBarPages = ['/pages/index/index', '/pages/news/news', '/pages/trade/trade', '/pages/schedule/schedule', '/pages/profile/profile'];
    if (tabBarPages.includes(path)) {
      wx.switchTab({ url: path });
    } else {
      wx.navigateTo({ url: path });
    }
  },

  onNewsTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/news-detail/news-detail?id=${id}` });
  },

  onScheduleTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/schedule/schedule` });
  },

  onMoreNewsTap() {
    wx.switchTab({ url: '/pages/news/news' });
  },

  onMoreScheduleTap() {
    wx.switchTab({ url: '/pages/schedule/schedule' });
  }
});
