import * as api from '../../services/api';
import type { NewsDetail } from '../../types/data';

interface INewsDetailData {
  newsId: string | null;
  news: NewsDetail | null;
}

Page<INewsDetailData, WechatMiniprogram.IAnyObject>({
  data: {
    newsId: null,
    news: null,
  },

  async onLoad(options: Record<string, string>) {
    const { id } = options;
    this.setData({ newsId: id });
    try {
      const detail = await api.getNewsDetail(id);
      this.setData({ news: detail });
    } catch (err) {
      console.error('loadNewsDetail failed', err);
    }
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: this.data.news?.title || '资讯详情',
      path: `/pages/news-detail/news-detail?id=${this.data.newsId}`,
    };
  },


});
