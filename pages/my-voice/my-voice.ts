import * as api from '../../services/api';
import { formatDate } from '../../utils/util';
import type { VoiceItem } from '../../types/data';

interface IMyVoiceData {
  voiceList: VoiceItem[];
  loading: boolean;
}

Page<IMyVoiceData, WechatMiniprogram.IAnyObject>({
  data: {
    voiceList: [],
    loading: false,
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  async loadData() {
    this.setData({ loading: true });
    try {
      const list = await api.getMyVoiceList();
      const voiceList = list.map((item) => ({
        ...item,
        createTime: formatDate(item.createTime),
        deadline: formatDate(item.deadline),
      })) as unknown as VoiceItem[];
      this.setData({ voiceList, loading: false });
    } catch (err) {
      console.error('load my voices failed', err);
      this.setData({ loading: false });
    }
  },

  onVoiceTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: string };
    wx.navigateTo({ url: `/pages/voice-publish/voice-publish?id=${id}` });
  },

  onVoiceLongPress(e: WechatMiniprogram.TouchEvent) {
    const id = String(e.currentTarget.dataset.id);
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条心声吗？',
      confirmColor: '#BA1A1A',
      success: async (res) => {
        if (res.confirm) {
          try {
            wx.showLoading({ title: '删除中...' });
            await api.deleteVoice(id);
            wx.hideLoading();
            wx.showToast({ title: '已删除', icon: 'success' });
            wx.setStorageSync('voiceListNeedRefresh', true);
            this.loadData();
          } catch (err) {
            wx.hideLoading();
            console.error('delete voice failed', err);
            wx.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      },
    });
  },
});
