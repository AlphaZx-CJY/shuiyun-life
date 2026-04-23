Page({
  data: {
    version: '1.0.0',
    aboutItems: [
      { id: 1, title: '关于我们', icon: '🏠', path: '' },
      { id: 2, title: '意见反馈', icon: '✉️', path: '' },
      { id: 3, title: '联系物业', icon: '📞', path: '' },
      { id: 4, title: '使用指南', icon: '📖', path: '' }
    ]
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 4 });
    }
  },

  onShareAppMessage() {
    return {
      title: '新长宁水韵名邸生活号',
      path: '/pages/index/index'
    };
  },

  onItemTap(e) {
    const { item } = e.currentTarget.dataset;
    switch (item.id) {
      case 3:
        wx.makePhoneCall({ phoneNumber: '021-12345678' });
        break;
      case 2:
        wx.showToast({ title: '反馈功能即将上线', icon: 'none' });
        break;
      case 4:
        wx.showToast({ title: '指南功能即将上线', icon: 'none' });
        break;
      default:
        wx.showModal({
          title: '关于水韵名邸生活号',
          content: '本小程序由水韵名邸业委会运营，旨在为业主提供便捷的生活服务信息。如有建议欢迎联系物业。',
          showCancel: false
        });
    }
  }
});
