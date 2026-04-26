import * as api from '../../services/api';
import type { GuideItem } from '../../types/data';

interface IGuideData {
  guideList: GuideItem[];
}

Page<IGuideData, WechatMiniprogram.IAnyObject>({
  data: {
    guideList: [],
  },

  onLoad() {
    this.loadGuideData();
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: '水韵名邸使用指南',
      path: '/pages/guide/guide',
    };
  },

  async loadGuideData() {
    try {
      const guideList = await api.getGuides();
      this.setData({ guideList });
    } catch (err) {
      console.error('loadGuideData failed', err);
    }
  },

  onGuideTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: number | string };
    wx.navigateTo({ url: `/pages/guide-detail/guide-detail?id=${id}` });
  },
});
