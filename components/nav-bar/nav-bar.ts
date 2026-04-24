interface INavBarData {
  statusBarHeight: number;
  navBarHeight: number;
  menuButtonTop: number;
  menuButtonHeight: number;
}

interface INavBarProps {
  title: string;
  backgroundColor: string;
  showBack: boolean;
  fallbackUrl: string;
}

Component<INavBarData, Record<string, any>, Record<string, any>>({
  properties: {
    title: {
      type: String,
      value: '',
    },
    backgroundColor: {
      type: String,
      value: '#F2F2F7',
    },
    showBack: {
      type: Boolean,
      value: true,
    },
    fallbackUrl: {
      type: String,
      value: '',
    },
  },

  data: {
    statusBarHeight: 0,
    navBarHeight: 44,
    menuButtonTop: 0,
    menuButtonHeight: 32,
  },

  lifetimes: {
    attached() {
      this.calcNavBarInfo();
    },
  },

  methods: {
    calcNavBarInfo() {
      const systemInfo = wx.getSystemInfoSync();
      const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

      const statusBarHeight = systemInfo.statusBarHeight || 0;
      const menuButtonTop = menuButtonInfo.top || statusBarHeight + 4;
      const menuButtonHeight = menuButtonInfo.height || 32;
      const navBarHeight = (menuButtonTop - statusBarHeight) * 2 + menuButtonHeight;

      this.setData({
        statusBarHeight,
        navBarHeight: navBarHeight > 44 ? navBarHeight : 44,
        menuButtonTop: menuButtonTop - statusBarHeight,
        menuButtonHeight,
      });
    },

    onBackTap() {
      const pages = getCurrentPages();
      if (pages.length > 1) {
        wx.navigateBack({
          fail: () => {
            this.goFallback();
          },
        });
      } else {
        this.goFallback();
      }
    },

    goFallback() {
      const fallbackMap: Record<string, string> = {
        'pages/news-detail/news-detail': '/pages/news/news',
        'pages/trade-detail/trade-detail': '/pages/trade/trade',
        'pages/payment-detail/payment-detail': '/pages/payment/payment',
        'pages/life-info/life-info': '/pages/index/index',
      };

      let fallback: string = this.data.fallbackUrl;
      if (!fallback) {
        const pages = getCurrentPages();
        const current = pages[0] && pages[0].route;
        fallback = fallbackMap[current || ''] || '/pages/index/index';
      }

      const tabBarPages: string[] = ['pages/index/index', 'pages/news/news', 'pages/trade/trade', 'pages/schedule/schedule', 'pages/profile/profile'];
      if (tabBarPages.some(p => fallback.includes(p))) {
        wx.switchTab({ url: fallback });
      } else {
        wx.redirectTo({ url: fallback });
      }
    },
  },
});
