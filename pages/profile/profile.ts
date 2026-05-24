import * as api from '../../services/api';
import type { ContactItem } from '../../types/data';

interface IProfileData {
  version: string;
  myItems: { title: string; icon: string; path: string }[];
  serviceItems: ReturnType<typeof api.getProfileItems>;
  contactItems: ReturnType<typeof api.getProfileItems>;
  contacts: ContactItem[];
}

Page<IProfileData, WechatMiniprogram.IAnyObject>({
  data: {
    version: '2.0.0',
    myItems: [
      { title: '我的心声', icon: '/images/icons/material/article-on.svg', path: '/pages/my-voice/my-voice' },
      { title: '我的闲置', icon: '/images/icons/material/storefront-on.svg', path: '/pages/my-trade/my-trade' },
    ],
    serviceItems: [],
    contactItems: [],
    contacts: [],
  },

  async onLoad() {
    const allItems = api.getProfileItems();
    const serviceItems = allItems.filter((item) => item.id !== 3);
    const contactItems = allItems.filter((item) => item.id === 3);
    const contacts = await api.getContacts();
    this.setData({ serviceItems, contactItems, contacts });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: '新长宁水韵名邸生活号',
      path: '/pages/index/index',
    };
  },

  onMyItemTap(e: WechatMiniprogram.TouchEvent) {
    const { path } = e.currentTarget.dataset as { path: string };
    if (path) {
      wx.navigateTo({ url: path });
    }
  },

  onItemTap(e: WechatMiniprogram.TouchEvent) {
    const { item } = e.currentTarget.dataset as { item: ReturnType<typeof api.getProfileItems>[number] };
    const itemId = Number(item.id);
    switch (itemId) {
      case 1:
        wx.showModal({
          title: '关于水韵名邸生活号',
          content: '本小程序由个人维护，旨在为小区居民提供便捷的生活服务信息。如有建议欢迎联系。',
          showCancel: false,
        });
        break;
      case 2:
        wx.navigateTo({ url: item.path });
        break;
      case 3: {
        const phones = this.data.contacts;
        if (phones.length === 0) {
          wx.showToast({ title: '暂无联系方式', icon: 'none' });
          break;
        }
        wx.showActionSheet({
          itemList: phones.map(p => `${p.label} ${p.number}`),
          success: (res: WechatMiniprogram.ShowActionSheetSuccessCallbackResult) => {
            wx.makePhoneCall({ phoneNumber: phones[res.tapIndex]!.number });
          },
        });
        break;
      }
      case 4:
        wx.navigateTo({ url: item.path });
        break;
    }
  },
});
