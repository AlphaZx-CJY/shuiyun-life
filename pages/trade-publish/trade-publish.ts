import * as api from '../../services/api';
import type { TradeItem, TradeForm } from '../../types/data';

interface ITradePublishData {
  categories: { id: string; name: string }[];
  categoryIndex: number;
  images: string[];
  form: TradeForm;
  editId: string | null;
}

Page<ITradePublishData, WechatMiniprogram.IAnyObject>({
  data: {
    categories: [
      { id: 'furniture', name: '家具' },
      { id: 'appliance', name: '电器' },
      { id: 'baby', name: '母婴' },
      { id: 'books', name: '书籍' },
      { id: 'others', name: '其他' },
    ],
    categoryIndex: 0,
    images: [],
    form: {
      title: '',
      price: '',
      originalPrice: '',
      description: '',
      seller: '',
      phone: '',
      location: '',
    },
    editId: null,
  },

  async onLoad(options: Record<string, string>) {
    const userInfo = wx.getStorageSync('userInfo') as WechatMiniprogram.UserInfo | undefined;
    if (userInfo && userInfo.nickName) {
      this.setData({ 'form.seller': userInfo.nickName });
    }

    const { id } = options;
    if (id) {
      this.setData({ editId: id });
      try {
        const detail = await api.getTradeDetail(id);
        if (detail) {
          const categoryIndex = this.data.categories.findIndex((c) => c.id === detail.category);
          this.setData({
            categoryIndex: categoryIndex >= 0 ? categoryIndex : 0,
            images: detail.images || [],
            form: {
              title: detail.title,
              price: String(detail.price),
              originalPrice: String(detail.originalPrice || ''),
              description: detail.description,
              seller: detail.seller,
              phone: detail.phone || '',
              location: detail.location,
            },
          });
        }
      } catch (err) {
        console.error('load trade detail failed', err);
      }
    }
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: '发布闲置物品',
      path: '/pages/trade-publish/trade-publish',
    };
  },

  onCategoryChange(e: WechatMiniprogram.PickerChange) {
    this.setData({ categoryIndex: Number(e.detail.value) });
  },

  onInputChange(e: WechatMiniprogram.CustomEvent<{ value: string }>) {
    const { field } = e.currentTarget.dataset as { field: keyof TradeForm };
    const { value } = e.detail;
    this.setData({ [`form.${field}`]: value } as unknown as Partial<ITradePublishData>);
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
        cloudPath: `trades/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`,
        filePath: path,
      }),
    );
    const results = await Promise.all(uploads);
    return [...cloudPaths, ...results.map((res) => res.fileID)];
  },

  async onSubmit() {
    const { form, categories, categoryIndex, images, editId } = this.data;

    if (!form.title.trim()) {
      wx.showToast({ title: '请输入商品标题', icon: 'none' });
      return;
    }
    if (!form.price.trim()) {
      wx.showToast({ title: '请输入售价', icon: 'none' });
      return;
    }
    if (!form.seller.trim()) {
      wx.showToast({ title: '请输入联系人', icon: 'none' });
      return;
    }
    if (!form.phone.trim()) {
      wx.showToast({ title: '请输入联系电话', icon: 'none' });
      return;
    }
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(form.phone.trim())) {
      wx.showToast({ title: '请输入正确的11位手机号', icon: 'none' });
      return;
    }

    wx.showLoading({ title: editId ? '保存中...' : '上传中...' });

    try {
      const fileIDs = await this.uploadImagesToCloud(images);
      const trade: TradeItem = {
        id: Date.now(),
        title: form.title.trim(),
        price: parseFloat(form.price) || 0,
        originalPrice: parseFloat(form.originalPrice) || 0,
        category: categories[categoryIndex].id as TradeItem['category'],
        images: fileIDs,
        seller: form.seller.trim(),
        phone: form.phone.trim(),
        time: '刚刚',
        location: form.location.trim() || '小区',
        description: form.description.trim() || '暂无描述',
      };

      if (editId) {
        await api.updateTrade(editId, trade);
        wx.hideLoading();
        wx.showToast({ title: '保存成功', icon: 'success', duration: 1500 });
      } else {
        await api.savePublishedTrade(trade, []);
        wx.hideLoading();
        wx.showToast({ title: '发布成功', icon: 'success', duration: 1500 });
      }
      wx.setStorageSync('tradeListNeedRefresh', true);
      setTimeout(() => wx.navigateBack(), 1500);
    } catch (err) {
      wx.hideLoading();
      console.error('publish failed', err);
      wx.showToast({ title: '操作失败，请重试', icon: 'none' });
    }
  },

  onCancel() {
    wx.navigateBack();
  },
});
