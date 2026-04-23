Page({
  data: {
    categories: [
      { id: 'all', name: '全部' },
      { id: 'furniture', name: '家具' },
      { id: 'appliance', name: '电器' },
      { id: 'baby', name: '母婴' },
      { id: 'books', name: '书籍' },
      { id: 'others', name: '其他' }
    ],
    activeCategory: 'all',
    tradeList: [],
    allTrades: []
  },

  onLoad() {
    this.loadTradeData();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
  },

  onPullDownRefresh() {
    this.loadTradeData();
    wx.stopPullDownRefresh();
  },

  onShareAppMessage() {
    return {
      title: '水韵名邸闲置交易',
      path: '/pages/trade/trade'
    };
  },

  loadTradeData() {
    const trades = [
      {
        id: 1,
        title: '宜家双人沙发，9成新',
        price: 800,
        originalPrice: 2999,
        category: 'furniture',
        image: '/images/banners/banner1.jpg',
        seller: '3号楼王先生',
        time: '2小时前',
        location: '3号楼',
        description: '搬家转让，使用2年，保养很好，无破损。'
      },
      {
        id: 2,
        title: '小米空气净化器Pro',
        price: 350,
        originalPrice: 899,
        category: 'appliance',
        image: '/images/banners/banner2.jpg',
        seller: '5号楼李女士',
        time: '5小时前',
        location: '5号楼',
        description: '滤网刚换，功能完好，因升级换新转让。'
      },
      {
        id: 3,
        title: '婴儿推车（可坐可躺）',
        price: 200,
        originalPrice: 1200,
        category: 'baby',
        image: '/images/banners/banner3.jpg',
        seller: '8号楼张妈妈',
        time: '1天前',
        location: '8号楼',
        description: '宝宝大了用不上了，轮子顺滑，可折叠。'
      },
      {
        id: 4,
        title: '考研英语全套书籍',
        price: 50,
        originalPrice: 280,
        category: 'books',
        image: '',
        seller: '2号楼小陈',
        time: '2天前',
        location: '2号楼',
        description: '红宝书+真题解析+作文模板，部分有笔记。'
      },
      {
        id: 5,
        title: '动感单车家用健身器材',
        price: 600,
        originalPrice: 1800,
        category: 'others',
        image: '',
        seller: '6号楼刘先生',
        time: '3天前',
        location: '6号楼',
        description: '磁控静音，阻力可调，占地面积小。'
      }
    ];
    this.setData({ allTrades: trades, tradeList: trades });
  },

  onCategoryTap(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({ activeCategory: id });
    this.filterTrades(id);
  },

  filterTrades(category) {
    if (category === 'all') {
      this.setData({ tradeList: this.data.allTrades });
      return;
    }
    const filtered = this.data.allTrades.filter(item => item.category === category);
    this.setData({ tradeList: filtered });
  },

  onTradeTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/trade-detail/trade-detail?id=${id}` });
  },

  onPublishTap() {
    wx.showToast({ title: '发布功能即将上线', icon: 'none' });
  }
});
