import * as api from '../../services/api';

interface IVoicePublishData {
  type: string;
  content: string;
  contact: string;
  deadline: string;
  images: string[];
  submitting: boolean;
}

Page<IVoicePublishData, WechatMiniprogram.IAnyObject>({
  data: {
    type: '',
    content: '',
    contact: '',
    deadline: '',
    images: [],
    submitting: false,
  },

  onTypeInput(e: WechatMiniprogram.CustomEvent<{ value: string }>) {
    this.setData({ type: e.detail.value });
  },

  onContentInput(e: WechatMiniprogram.CustomEvent<{ value: string }>) {
    this.setData({ content: e.detail.value });
  },

  onContactInput(e: WechatMiniprogram.CustomEvent<{ value: string }>) {
    this.setData({ contact: e.detail.value });
  },

  onDeadlineChange(e: WechatMiniprogram.PickerChange) {
    this.setData({ deadline: e.detail.value as string });
  },

  onChooseImage() {
    const remain = 6 - this.data.images.length;
    if (remain <= 0) return;
    wx.chooseMedia({
      count: remain,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = res.tempFiles.map((f) => f.tempFilePath);
        this.setData({ images: [...this.data.images, ...newImages] });
      },
    });
  },

  onRemoveImage(e: WechatMiniprogram.TouchEvent) {
    const { index } = e.currentTarget.dataset as { index: number };
    const images = [...this.data.images];
    images.splice(index, 1);
    this.setData({ images });
  },

  onPreviewImage(e: WechatMiniprogram.TouchEvent) {
    const { index } = e.currentTarget.dataset as { index: number };
    wx.previewImage({
      current: this.data.images[index],
      urls: this.data.images,
    });
  },

  async uploadImagesToCloud(tempPaths: string[]): Promise<string[]> {
    if (tempPaths.length === 0) return [];
    const uploads = tempPaths.map((path) =>
      wx.cloud.uploadFile({
        cloudPath: `voices/${Date.now()}_${Math.random().toString(36).slice(2)}.${path.split('.').pop() || 'jpg'}`,
        filePath: path,
      }),
    );
    const results = await Promise.all(uploads);
    return results.map((res) => res.fileID);
  },

  async onSubmit() {
    const { type, content, contact, deadline, images, submitting } = this.data;
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
    wx.showLoading({ title: '上传中...' });

    try {
      const fileIDs = await this.uploadImagesToCloud(images);
      await api.submitVoice(type.trim(), content.trim(), contact.trim(), deadline, fileIDs);
      wx.hideLoading();
      wx.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    } catch (err) {
      wx.hideLoading();
      console.error('submit voice failed', err);
      wx.showToast({ title: '发布失败，请重试', icon: 'none' });
      this.setData({ submitting: false });
    }
  },
});
