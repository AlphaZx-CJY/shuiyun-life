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
        wx.showActionSheet({
          itemList: ['物业前台 59251006', '监控室夜班 59251005', '重固派出所 021-59781249'],
          success: (res) => {
            const phones = ['59251006', '59251005', '021-59781249'];
            wx.makePhoneCall({ phoneNumber: phones[res.tapIndex] });
          }
        });
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
          content: '本小程序由个人维护，旨在为小区居民提供便捷的生活服务信息。如有建议欢迎联系。',
          showCancel: false
        });
    }
  }
});
