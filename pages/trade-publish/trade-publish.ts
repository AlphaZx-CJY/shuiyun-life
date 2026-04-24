import * as api from '../../services/api';
import type { TradeItem, TradeForm } from '../../types/data';

interface ITradePublishData {
  categories: { id: string; name: string }[];
  categoryIndex: number;
  images: string[];
  form: TradeForm;
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
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo') as WechatMiniprogram.UserInfo | undefined;
    if (userInfo && userInfo.nickName) {
      this.setData({ 'form.seller': userInfo.nickName });
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

  onInputChange(e: WechatMiniprogram.Input) {
    const { field } = e.currentTarget.dataset as { field: keyof TradeForm };
    const { value } = e.detail;
    this.setData({ [`form.${field}`]: value } as unknown as Partial<ITradePublishData>);
  },

  onChooseImage() {
    const remain = 3 - this.data.images.length;
    if (remain <= 0) return;
    wx.chooseMedia({
      count: remain,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res: any) => {
        const newImages = res.tempFiles.map((f: any) => f.tempFilePath);
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

  onSubmit() {
    const { form, categories, categoryIndex, images } = this.data;

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

    const trade: TradeItem = {
      id: Date.now(),
      title: form.title.trim(),
      price: parseFloat(form.price) || 0,
      originalPrice: parseFloat(form.originalPrice) || 0,
      category: categories[categoryIndex].id as TradeItem['category'],
      images: images,
      seller: form.seller.trim(),
      time: '刚刚',
      location: form.location.trim() || '小区',
      description: form.description.trim() || '暂无描述',
    };

    api.savePublishedTrade(trade);

    wx.showToast({
      title: '发布成功',
      icon: 'success',
      duration: 1500,
      success: () => {
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      },
    });
  },

  onCancel() {
    wx.navigateBack();
  },
});
