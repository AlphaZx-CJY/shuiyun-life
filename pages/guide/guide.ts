import * as api from '../../services/api';
import type { GuideItem } from '../../types/data';

interface IGuideData {
  guideList: GuideItem[];
  loading: boolean;
}

Page<IGuideData, WechatMiniprogram.IAnyObject>({
  data: {
    guideList: [],
    loading: false,
  },

  onLoad() {
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: '水韵名邸 - 使用指南',
      path: '/pages/guide/guide',
    };
  },

  async loadData() {
    this.setData({ loading: true });
    try {
      const guideList = await api.getGuideList();
      this.setData({ guideList, loading: false });
    } catch (err) {
      console.error('loadData failed', err);
      this.setData({ loading: false });
    }
  },

  onGuideTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: number | string };
    wx.navigateTo({ url: `/pages/detail/detail?type=guide&id=${id}` });
  },
});
