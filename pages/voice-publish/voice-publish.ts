import * as api from '../../services/api';

interface IVoicePublishData {
  type: string;
  content: string;
  contact: string;
  deadline: string;
  submitting: boolean;
}

Page<IVoicePublishData, WechatMiniprogram.IAnyObject>({
  data: {
    type: '',
    content: '',
    contact: '',
    deadline: '',
    submitting: false,
  },

  onTypeInput(e: WechatMiniprogram.TouchEvent) {
    this.setData({ type: (e.detail as any).value as string });
  },

  onContentInput(e: WechatMiniprogram.TouchEvent) {
    this.setData({ content: (e.detail as any).value as string });
  },

  onContactInput(e: WechatMiniprogram.TouchEvent) {
    this.setData({ contact: (e.detail as any).value as string });
  },

  onDeadlineChange(e: WechatMiniprogram.TouchEvent) {
    this.setData({ deadline: (e.detail as any).value as string });
  },

  async onSubmit() {
    const { type, content, contact, deadline, submitting } = this.data;
    if (submitting) return;
    if (!type.trim()) {
      wx.showToast({ title: '请填写诉求类型', icon: 'none' });
      return;
    }
    if (!content.trim()) {
      wx.showToast({ title: '请填写诉求内容', icon: 'none' });
      return;
    }
    if (!deadline) {
      wx.showToast({ title: '请选择截止日期', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });
    try {
      await api.submitVoice(type.trim(), content.trim(), contact.trim(), deadline);
      wx.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    } catch (err) {
      console.error('submit voice failed', err);
      wx.showToast({ title: '发布失败，请重试', icon: 'none' });
      this.setData({ submitting: false });
    }
  },
});
