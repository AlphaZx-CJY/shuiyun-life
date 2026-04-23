Page({
  data: {
    categories: [
      { id: 'all', name: '全部' },
      { id: 'notice', name: '社区通知' },
      { id: 'policy', name: '政策解读' },
      { id: 'around', name: '周边动态' }
    ],
    activeCategory: 'all',
    newsList: [],
    allNews: []
  },

  onLoad() {
    this.loadNewsData();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
  },

  onPullDownRefresh() {
    this.loadNewsData();
    wx.stopPullDownRefresh();
  },

  onShareAppMessage() {
    return {
      title: '水韵名邸资讯',
      path: '/pages/news/news'
    };
  },

  loadNewsData() {
    const allNews = [
      {
        id: 1,
        title: '小区地下停车场维护通知',
        summary: '定于本周六对B2层进行地面养护，请业主提前挪车，预计工期2天。',
        source: '物业中心',
        date: '2025-04-22',
        tag: '社区通知',
        category: 'notice',
        cover: '/images/banners/banner1.jpg'
      },
      {
        id: 2,
        title: '周边新开生鲜超市，步行5分钟直达',
        summary: '位于福泉路的新生鲜超市正式营业，业主专享95折优惠，生鲜蔬果每日直供。',
        source: '生活圈',
        date: '2025-04-21',
        tag: '周边动态',
        category: 'around',
        cover: '/images/banners/banner2.jpg'
      },
      {
        id: 3,
        title: '2025年物业费缴纳指南',
        summary: '支持线上缴纳，可享早鸟98折优惠，截止日期6月30日。',
        source: '物业中心',
        date: '2025-04-20',
        tag: '社区通知',
        category: 'notice',
        cover: '/images/banners/banner3.jpg'
      },
      {
        id: 4,
        title: '上海市公积金提取新政解读',
        summary: '租房提取额度上调，老旧小区加装电梯也可申请提取公积金。',
        source: '政策速递',
        date: '2025-04-18',
        tag: '政策解读',
        category: 'policy',
        cover: ''
      },
      {
        id: 5,
        title: '小区周边公交线路优化调整',
        summary: '788路新增停靠站点，出行更加便利，快来看看新的线路图。',
        source: '生活圈',
        date: '2025-04-15',
        tag: '周边动态',
        category: 'around',
        cover: ''
      }
    ];
    this.setData({ allNews, newsList: allNews });
  },

  onCategoryTap(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({ activeCategory: id });
    this.filterNews(id);
  },

  filterNews(category) {
    if (category === 'all') {
      this.setData({ newsList: this.data.allNews });
      return;
    }
    const filtered = this.data.allNews.filter(item => item.category === category);
    this.setData({ newsList: filtered });
  },

  onNewsTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/news-detail/news-detail?id=${id}` });
  }
});
