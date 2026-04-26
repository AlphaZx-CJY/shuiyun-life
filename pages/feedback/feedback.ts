import * as api from '../../services/api';

interface IFeedbackData {
  types: string[];
  typeIndex: number;
  content: string;
  contact: string;
  submitting: boolean;
}

const FEEDBACK_TYPES = ['建议', '投诉', '报修', '其他'];

Page<IFeedbackData, WechatMiniprogram.IAnyObject>({
  data: {
    types: FEEDBACK_TYPES,
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
      wx.showToast({ title: '请填写反馈内容', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });
    try {
      await api.submitFeedback(FEEDBACK_TYPES[typeIndex], content.trim(), contact.trim());
      wx.showToast({ title: '提交成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    } catch (err) {
      console.error('submit feedback failed', err);
      wx.showToast({ title: '提交失败，请重试', icon: 'none' });
      this.setData({ submitting: false });
    }
  },
});
