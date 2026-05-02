Component({
  data: {
    selected: 0,
    color: '#44483D',
    selectedColor: '#4C662B',
    backgroundColor: '#EEEFE3',
    borderStyle: 'white',
    list: [
      { pagePath: '/pages/index/index', text: '首页', iconPath: '/images/icons/material/home-off.svg', selectedIconPath: '/images/icons/material/home-on.svg' },
      { pagePath: '/pages/news/news', text: '资讯', iconPath: '/images/icons/material/article-off.svg', selectedIconPath: '/images/icons/material/article-on.svg' },
      { pagePath: '/pages/trade/trade', text: '交易', iconPath: '/images/icons/material/storefront-off.svg', selectedIconPath: '/images/icons/material/storefront-on.svg' },
      { pagePath: '/pages/schedule/schedule', text: '活动', iconPath: '/images/icons/material/event-off.svg', selectedIconPath: '/images/icons/material/event-on.svg' },
      { pagePath: '/pages/profile/profile', text: '我的', iconPath: '/images/icons/material/person-off.svg', selectedIconPath: '/images/icons/material/person-on.svg' },
    ],
  },
  attached() {
    console.log('[custom-tab-bar] attached');
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({ url });
    },
  },
});
