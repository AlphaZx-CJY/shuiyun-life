import * as api from '../../services/api';
import type { Category, ServiceItem } from '../../types/data';

interface ILifeInfoData {
  categories: Category[];
  activeCategory: string;
  serviceList: ServiceItem[];
}

Page<ILifeInfoData, WechatMiniprogram.IAnyObject>({
  data: {
    categories: [],
    activeCategory: '1',
    serviceList: [],
  },

  onLoad() {
    this.setData({ categories: api.getServiceCategories() });
    this.loadServiceData('supermarket');
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: '水韵名邸周边生活',
      path: '/pages/life-info/life-info',
    };
  },

  onCategoryTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: string };
    this.setData({ activeCategory: id });
    this.loadServiceData(id);
  },

  async loadServiceData(category: string) {
    const serviceList = await api.getServiceList(category);
    this.setData({ serviceList });
  },

  onServiceTap(e: WechatMiniprogram.TouchEvent) {
    const { item } = e.currentTarget.dataset as { item: ReturnType<typeof api.getServiceList>[number] };
    const itemList = ['查看地图'];
    if (item.phone) {
      itemList.push('拨打电话');
    }
    if (item.jump) {
      const jumpLabel = item.jump.type === 'miniprogram' ? '打开小程序' : '关注公众号';
      itemList.push(jumpLabel);
    }
    wx.showActionSheet({
      itemList,
      success: (res: WechatMiniprogram.ShowActionSheetSuccessCallbackResult) => {
        const action = itemList[res.tapIndex];
        if (action === '查看地图') {
          if (item.location) {
            wx.openLocation({
              latitude: item.location.latitude,
              longitude: item.location.longitude,
              name: item.name,
              address: item.address,
            });
          } else {
            wx.showToast({ title: '该商家暂无地图位置', icon: 'none' });
          }
        } else if (action === '拨打电话') {
          wx.makePhoneCall({ phoneNumber: item.phone });
        } else if (action === '打开小程序') {
          if (item.jump?.appId) {
            wx.navigateToMiniProgram({
              appId: item.jump.appId,
              path: item.jump.path || '',
              fail: () => {
                wx.showToast({ title: '打开小程序失败', icon: 'none' });
              },
            });
          } else {
            wx.showToast({ title: '功能即将上线', icon: 'none' });
          }
        } else if (action === '关注公众号') {
          if (item.jump?.username) {
            if (wx.canIUse('openOfficialAccountProfile')) {
              (wx as any).openOfficialAccountProfile({
                username: item.jump.username,
                fail: () => {
                  wx.showToast({ title: '打开公众号失败', icon: 'none' });
                },
              });
            } else {
              wx.showToast({ title: '当前微信版本暂不支持，请升级后重试', icon: 'none' });
            }
          } else {
            wx.showToast({ title: '功能即将上线', icon: 'none' });
          }
        }
      },
    });
  },
});
