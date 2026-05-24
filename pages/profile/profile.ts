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
    serviceItems: [
      { id: 1, title: '关于小程序', icon: '/images/icons/profile/info.svg', path: '' },
      { id: 2, title: '小程序反馈', icon: '/images/icons/profile/feedback.svg', path: '/pages/feedback/feedback' },
      { id: 4, title: '运营帮助', icon: '/images/icons/profile/help.svg', path: '/pages/guide/guide' },
      { id: 5, title: '开源代码', icon: '/images/icons/profile/github.svg', path: '' },
    ],
    contactItems: [
      { id: 3, title: '联系物业', icon: '/images/icons/profile/call.svg', path: '' },
    ],
    contacts: [],
  },

  onLoad() {
    this.loadContacts();
  },

  async loadContacts() {
    const contacts = await api.getContacts();
    this.setData({ contacts });
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
      case 5: {
        const repoUrl = 'https://github.com/AlphaZx-CJY/shuiyun-life';
        wx.showModal({
          title: '开源代码',
          content: `本项目已在 GitHub 开源，欢迎 Star 和提交 Issue。\n\n${repoUrl}`,
          confirmText: '复制链接',
          cancelText: '关闭',
          success: (res) => {
            if (res.confirm) {
              wx.setClipboardData({
                data: repoUrl,
                success: () => wx.showToast({ title: '已复制', icon: 'success' }),
              });
            }
          },
        });
        break;
      }
    }
  },
});
