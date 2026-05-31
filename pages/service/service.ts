import * as api from '../../services/api';
import type { ServiceItem } from '../../types/data';

interface IServiceData {
  categories: { id: string; name: string }[];
  activeCategory: string;
  serviceList: ServiceItem[];
  allServices: ServiceItem[];
  loading: boolean;
}

const CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: '1', name: '超市' },
  { id: '2', name: '菜场' },
  { id: '3', name: '餐饮' },
  { id: '4', name: '银行' },
  { id: '5', name: '交通' },
  { id: '6', name: '教育' },
  { id: '7', name: '休闲' },
  { id: '8', name: '医疗' },
  { id: '9', name: '购物' },
];

const ICON_MAP: Record<string, string> = {
  '1': 'shopping_cart',
  '2': 'local_mall',
  '3': 'restaurant',
  '4': 'account_balance',
  '5': 'directions_transit',
  '6': 'school',
  '7': 'park',
  '8': 'local_hospital',
  '9': 'shopping_bag',
};

Page<IServiceData, WechatMiniprogram.IAnyObject>({
  data: {
    categories: CATEGORIES,
    activeCategory: 'all',
    serviceList: [],
    allServices: [],
    loading: false,
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: '水韵名邸 - 周边生活',
      path: '/pages/service/service',
    };
  },

  async loadData() {
    this.setData({ loading: true });
    try {
      const allServices = await api.getServiceList('all');
      const enrichedServices = allServices.map((item) => {
        let hourList: string[] = [];
        if (item.hours) {
          if (Array.isArray(item.hours)) {
            hourList = item.hours;
          } else {
            hourList = item.hours.split(/[,\n]/).map((s) => s.trim()).filter((s) => s.length > 0);
          }
        }
        return {
          ...item,
          icon: ICON_MAP[item.category] || 'storefront',
          hourList,
        };
      });
      this.setData({ allServices: enrichedServices, serviceList: enrichedServices, loading: false });
    } catch (err) {
      console.error('loadData failed', err);
      this.setData({ loading: false });
    }
  },

  onCategoryTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: string };
    const { allServices } = this.data;
    const serviceList = id === 'all' ? allServices : allServices.filter((item) => item.category === id);
    this.setData({ activeCategory: id, serviceList });
  },

  onCardTap(e: WechatMiniprogram.TouchEvent) {
    const { phone, name, address, longitude, latitude } = e.currentTarget.dataset as {
      phone: string;
      name: string;
      address: string;
      longitude: string;
      latitude: string;
    };

    const actions: string[] = [];
    if (phone && phone.trim()) actions.push('拨打电话');
    if (longitude && latitude) actions.push('打开地图');

    if (actions.length === 0) {
      wx.showToast({ title: '暂无联系方式和位置', icon: 'none' });
      return;
    }

    wx.showActionSheet({
      itemList: actions,
      success: (res) => {
        const action = actions[res.tapIndex];
        if (action === '拨打电话') {
          wx.makePhoneCall({
            phoneNumber: phone,
            fail: () => wx.showToast({ title: '拨打电话失败', icon: 'none' }),
          });
        } else if (action === '打开地图') {
          wx.openLocation({
            longitude: parseFloat(longitude),
            latitude: parseFloat(latitude),
            name,
            address,
          });
        }
      },
    });
  },
});
