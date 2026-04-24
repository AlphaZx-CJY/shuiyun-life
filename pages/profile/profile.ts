import * as api from '../../services/api';

interface IProfileData {
  version: string;
  aboutItems: ReturnType<typeof api.getProfileItems>;
}

Page<IProfileData, WechatMiniprogram.IAnyObject>({
  data: {
    version: '1.0.0',
    aboutItems: [],
  },

  onLoad() {
    this.setData({ aboutItems: api.getProfileItems() });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 4 });
    }
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: '新长宁水韵名邸生活号',
      path: '/pages/index/index',
    };
  },

  onItemTap(e: WechatMiniprogram.TouchEvent) {
    const { item } = e.currentTarget.dataset as { item: ReturnType<typeof api.getProfileItems>[number] };
    switch (item.id) {
      case 3: {
        const phones = api.getContactPhones();
        wx.showActionSheet({
          itemList: phones.map(p => p.label),
          success: (res: WechatMiniprogram.ShowActionSheetSuccessCallbackResult) => {
            wx.makePhoneCall({ phoneNumber: phones[res.tapIndex].number });
          },
        });
        break;
      }
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
          showCancel: false,
        });
    }
  },
});
