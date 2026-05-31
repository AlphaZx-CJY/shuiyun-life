Component({
  data: {
    selected: 0,
    color: '#44483D',
    selectedColor: '#4C662B',
    backgroundColor: '#EEEFE3',
    borderStyle: 'white',
    list: [
      { pagePath: '/pages/index/index', text: '首页', iconPath: '/images/icons/material/home-off.svg', selectedIconPath: '/images/icons/material/home-on.svg' },
      { pagePath: '/pages/discover/discover', text: '发现', iconPath: '/images/icons/material/explore-off.svg', selectedIconPath: '/images/icons/material/explore-on.svg' },
      { pagePath: '/pages/service/service', text: '周边', iconPath: '/images/icons/material/storefront-off.svg', selectedIconPath: '/images/icons/material/storefront-on.svg' },
      { pagePath: '/pages/profile/profile', text: '更多', iconPath: '/images/icons/material/more_horiz-off.svg', selectedIconPath: '/images/icons/material/more_horiz-on.svg' },
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
