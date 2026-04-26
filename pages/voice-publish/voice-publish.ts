import * as api from '../../services/api';

interface IVoiceData {
  types: string[];
  typeIndex: number;
  content: string;
  contact: string;
  submitting: boolean;
}

const VOICE_TYPES = ['求购', '求代购', '顺风车', '其他'];

Page<IVoiceData, WechatMiniprogram.IAnyObject>({
  data: {
    types: VOICE_TYPES,
    typeIndex: 0,
    content: '',
    contact: '',
    submitting: false,
  },

  onTypeChange(e: WechatMiniprogram.TouchEvent) {
    this.setData({ typeIndex: Number(e.detail.value) });
  },

  onContentInput(e: WechatMiniprogram.TouchEvent) {
    this.setData({ content: (e.detail as any).value as string });
  },

  onContactInput(e: WechatMiniprogram.TouchEvent) {
    this.setData({ contact: (e.detail as any).value as string });
  },

  async onSubmit() {
    const { content, contact, typeIndex, submitting } = this.data;
    if (submitting) return;
    if (!content.trim()) {
      wx.showToast({ title: '请填写诉求内容', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });
    try {
      await api.submitVoice(VOICE_TYPES[typeIndex], content.trim(), contact.trim());
      wx.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    } catch (err) {
      console.error('submit voice failed', err);
      wx.showToast({ title: '发布失败，请重试', icon: 'none' });
      this.setData({ submitting: false });
    }
  },
});
