import * as api from '../../services/api';

interface DetailConfig {
  color: string;
  icon: string;
  title: string;
}

const CONFIG: Record<string, DetailConfig> = {
  news: { color: 'primary', icon: 'article', title: '资讯' },
  schedule: { color: 'tertiary', icon: 'event', title: '活动' },
  payment: { color: 'payment', icon: 'receipt_long', title: '缴费' },
  guide: { color: 'secondary', icon: 'menu_book', title: '指南' },
  service: { color: 'secondary', icon: 'storefront', title: '周边' },
};

interface IDetailData {
  type: string;
  config: DetailConfig;
  title: string;
  meta: string;
  content: string;
  tag: string;
  loading: boolean;
}

Page<IDetailData, WechatMiniprogram.IAnyObject>({
  data: {
    type: '',
    config: { color: 'primary', icon: 'article', title: '资讯' },
    title: '',
    meta: '',
    content: '',
    tag: '',
    loading: true,
  },

  onLoad(options: Record<string, string | undefined>) {
    const type = options.type || 'news';
    const id = options.id;
    const config = CONFIG[type] || CONFIG.news;
    this.setData({ type, config });
    if (id) {
      this.loadDetail(type, id);
    }
  },

  async loadDetail(type: string, id: string) {
    this.setData({ loading: true });
    try {
      switch (type) {
        case 'news': {
          const data = await api.getNewsDetail(id);
          if (data) {
            this.setData({
              title: data.title,
              meta: `${data.source} · ${data.date}`,
              content: data.content,
              tag: data.tag || '资讯',
              loading: false,
            });
          }
          break;
        }
        case 'schedule': {
          const data = await api.getScheduleDetail(id);
          if (data) {
            this.setData({
              title: data.title,
              meta: `${data.date} ${data.time} · ${data.location}`,
              content: data.description,
              tag: data.type || '活动',
              loading: false,
            });
          }
          break;
        }
        case 'payment': {
          const data = await api.getPaymentDetail(id);
          if (data) {
            this.setData({
              title: data.title,
              meta: `${data.tag} · ${data.date}`,
              content: data.content,
              tag: data.tag || '缴费',
              loading: false,
            });
          }
          break;
        }
        case 'guide': {
          const data = await api.getGuideDetail(id);
          if (data) {
            this.setData({
              title: data.title,
              meta: `${data.tag} · ${data.date}`,
              content: data.content,
              tag: data.tag || '指南',
              loading: false,
            });
          }
          break;
        }
        case 'service': {
          const svc = await api.getServiceDetail(id);
          if (svc) {
            const hoursText = Array.isArray(svc.hours) ? svc.hours.join('、') : svc.hours;
            const contentLines = [
              svc.name,
              '',
              `地址：${svc.address}`,
              `电话：${svc.phone}`,
              `营业时间：${hoursText || '暂无'}`,
              svc.tags?.length ? `标签：${svc.tags.join('、')}` : '',
            ].filter(Boolean);
            this.setData({
              title: svc.name,
              meta: svc.address,
              content: contentLines.join('<br>'),
              tag: svc.tags?.[0] || '周边',
              loading: false,
            });
          }
          break;
        }
        default:
          this.setData({ loading: false });
      }
    } catch (err) {
      console.error('loadDetail failed', err);
      this.setData({ loading: false });
    }
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: this.data.title || '详情',
      path: `/pages/detail/detail?type=${this.data.type}&id=`,
    };
  },
});
