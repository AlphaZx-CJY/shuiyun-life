import * as api from '../../services/api';
import type { GuideDetail } from '../../types/data';

interface IGuideDetailData {
  guideId: string | null;
  guide: GuideDetail | null;
}

Page<IGuideDetailData, WechatMiniprogram.IAnyObject>({
  data: {
    guideId: null,
    guide: null,
  },

  async onLoad(options: Record<string, string>) {
    const { id } = options;
    this.setData({ guideId: id });
    try {
      const detail = await api.getGuideDetail(id);
      this.setData({ guide: detail });
      if (detail) {
        wx.setNavigationBarTitle({ title: detail.title });
      }
    } catch (err) {
      console.error('loadGuideDetail failed', err);
    }
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: this.data.guide?.title || '使用指南',
      path: `/pages/guide-detail/guide-detail?id=${this.data.guideId}`,
    };
  },
});
