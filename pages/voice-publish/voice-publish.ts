import * as api from '../../services/api';

interface IVoicePublishData {
  type: string;
  content: string;
  contact: string;
  deadline: string;
  images: string[];
  submitting: boolean;
  editId: string | null;
}

Page<IVoicePublishData, WechatMiniprogram.IAnyObject>({
  data: {
    type: '',
    content: '',
    contact: '',
    deadline: '',
    images: [],
    submitting: false,
    editId: null,
  },

  async onLoad(options: Record<string, string>) {
    const { id } = options;
    if (id) {
      this.setData({ editId: id });
      try {
        const detail = await api.getVoiceDetail(id);
        if (detail) {
          this.setData({
            type: detail.type,
            content: detail.content,
            contact: detail.contact,
            deadline: detail.deadline,
            images: detail.images || [],
          });
        }
      } catch (err) {
        console.error('load voice detail failed', err);
      }
    }
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

  async uploadImagesToCloud(paths: string[]): Promise<string[]> {
    const localPaths = paths.filter((p) => p.startsWith('http://tmp/') || p.startsWith('wxfile://'));
    const cloudPaths = paths.filter((p) => p.startsWith('cloud://'));

    if (localPaths.length === 0) return paths;

    const uploads = localPaths.map((path) =>
      wx.cloud.uploadFile({
        cloudPath: `voices/${Date.now()}_${Math.random().toString(36).slice(2)}.${path.split('.').pop() || 'jpg'}`,
        filePath: path,
      }),
    );
    const results = await Promise.all(uploads);
    return [...cloudPaths, ...results.map((res) => res.fileID)];
  },

  async onSubmit() {
    const { type, content, contact, deadline, images, submitting, editId } = this.data;
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
    wx.showLoading({ title: editId ? '保存中...' : '上传中...' });

    try {
      const fileIDs = await this.uploadImagesToCloud(images);
      if (editId) {
        await api.updateVoice(editId, {
          type: type.trim(),
          content: content.trim(),
          contact: contact.trim(),
          deadline,
          images: fileIDs,
        });
      } else {
        await api.submitVoice(type.trim(), content.trim(), contact.trim(), deadline, fileIDs);
      }
      wx.hideLoading();
      wx.showToast({ title: editId ? '保存成功' : '发布成功', icon: 'success' });
      wx.setStorageSync('voiceListNeedRefresh', true);
      setTimeout(() => wx.navigateBack(), 1500);
    } catch (err) {
      wx.hideLoading();
      console.error('submit voice failed', err);
      wx.showToast({ title: '操作失败，请重试', icon: 'none' });
      this.setData({ submitting: false });
    }
  },
});
