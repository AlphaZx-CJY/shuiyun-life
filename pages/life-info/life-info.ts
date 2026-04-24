import * as api from '../../services/api';

interface ILifeInfoData {
  categories: ReturnType<typeof api.getServiceCategories>;
  activeCategory: string;
  serviceList: ReturnType<typeof api.getServiceList>;
}

Page<ILifeInfoData, WechatMiniprogram.IAnyObject>({
  data: {
    categories: [],
    activeCategory: 'supermarket',
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

  loadServiceData(category: string) {
    this.setData({ serviceList: api.getServiceList(category) });
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
          wx.openLocation({
            latitude: 31.220,
            longitude: 121.200,
            name: item.name,
            address: item.address,
          });
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
