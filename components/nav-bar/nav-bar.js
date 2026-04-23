Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    backgroundColor: {
      type: String,
      value: '#F2F2F7'
    },
    showBack: {
      type: Boolean,
      value: true
    },
    fallbackUrl: {
      type: String,
      value: ''
    }
  },

  data: {
    statusBarHeight: 0,
    navBarHeight: 44,
    menuButtonTop: 0,
    menuButtonHeight: 32
  },

  lifetimes: {
    attached() {
      this.calcNavBarInfo();
    }
  },

  methods: {
    calcNavBarInfo() {
      const systemInfo = wx.getSystemInfoSync();
      const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

      // 状态栏高度
      const statusBarHeight = systemInfo.statusBarHeight || 0;
      // 胶囊按钮顶部距离
      const menuButtonTop = menuButtonInfo.top || statusBarHeight + 4;
      // 胶囊按钮高度
      const menuButtonHeight = menuButtonInfo.height || 32;
      // 导航栏高度 = 状态栏高度 + (胶囊按钮顶部距离 - 状态栏高度) * 2 + 胶囊按钮高度
      // 简化为：状态栏高度 + 44（标准导航栏高度）
      const navBarHeight = (menuButtonTop - statusBarHeight) * 2 + menuButtonHeight;

      this.setData({
        statusBarHeight,
        navBarHeight: navBarHeight > 44 ? navBarHeight : 44,
        menuButtonTop: menuButtonTop - statusBarHeight,
        menuButtonHeight
      });
    },

    onBackTap() {
      const pages = getCurrentPages();
      if (pages.length > 1) {
        wx.navigateBack({
          fail: () => {
            this.goFallback();
          }
        });
      } else {
        this.goFallback();
      }
    },

    goFallback() {
      const fallbackMap = {
        'pages/news-detail/news-detail': '/pages/news/news',
        'pages/trade-detail/trade-detail': '/pages/trade/trade',
        'pages/payment-detail/payment-detail': '/pages/payment/payment',
        'pages/life-info/life-info': '/pages/index/index'
      };

      let fallback = this.data.fallbackUrl;
      if (!fallback) {
        const pages = getCurrentPages();
        const current = pages[0] && pages[0].route;
        fallback = fallbackMap[current] || '/pages/index/index';
      }

      // 判断目标是否为 tabBar 页面
      const tabBarPages = ['pages/index/index', 'pages/news/news', 'pages/trade/trade', 'pages/schedule/schedule', 'pages/profile/profile'];
      if (tabBarPages.some(p => fallback.includes(p))) {
        wx.switchTab({ url: fallback });
      } else {
        wx.redirectTo({ url: fallback });
      }
    }
  }
});
