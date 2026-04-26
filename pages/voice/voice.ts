import * as api from '../../services/api';
import type { VoiceItem } from '../../types/data';

interface IVoiceData {
  voiceList: VoiceItem[];
}

Page<IVoiceData, WechatMiniprogram.IAnyObject>({
  data: {
    voiceList: [],
  },

  onLoad() {
    this.loadVoiceData();
  },

  onPullDownRefresh() {
    this.loadVoiceData();
    wx.stopPullDownRefresh();
  },

  async loadVoiceData() {
    try {
      const voiceList = await api.getVoiceList();
      this.setData({ voiceList });
    } catch (err) {
      console.error('loadVoiceData failed', err);
    }
  },

  onPublishTap() {
    wx.navigateTo({ url: '/pages/voice-publish/voice-publish' });
  },

  onVoiceTap(e: WechatMiniprogram.TouchEvent) {
    const { item } = e.currentTarget.dataset as { item: VoiceItem };
    wx.showModal({
      title: item.type,
      content: `${item.content}\n\n联系方式：${item.contact || '未填写'}`,
      showCancel: false,
      confirmText: '知道了',
    });
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: '邻里互助',
      path: '/pages/voice/voice',
    };
  },
});
