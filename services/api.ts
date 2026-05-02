import * as cloud from './cloud';
import { markdownToHtml } from '../utils/util';
import type {
  QuickEntry,
  NewsItem,
  NewsDetail,
  TradeItem,
  TradeDetail,
  ServiceItem,
  ScheduleItem,
  PaymentItem,
  PaymentDetail,
  ShuttleTime,
  ProfileItem,
  Category,
  ContactItem,
  FeedbackConfig,
  GuideItem,
  GuideDetail,
  VoiceItem,
} from '../types/data';

/** 通用安全查询：自动映射 _id → id，出错返回空数组 */
async function safeQuery<T extends { id?: number | string; _id?: string }>(
  collection: string,
  where?: Record<string, any>,
  options?: cloud.QueryOptions,
): Promise<T[]> {
  try {
    const data = await cloud.query<T>(collection, where, options);
    return data.map((item) => ({ ...item, id: (item as any).id ?? item._id }));
  } catch (e) {
    console.error(`[cloud] ${collection} query failed:`, e);
    return [];
  }
}

/** ========== 首页 ========== */

export function getQuickEntries(): QuickEntry[] {
  return [];
}

export async function getNoticeNews(count = 3): Promise<NewsItem[]> {
  return safeQuery<NewsItem>('news', { enabled: true, category: 'notice' }, { orderBy: [{ field: 'date', desc: true }], limit: count });
}

export async function getLatestNews(count = 3): Promise<NewsItem[]> {
  const data = await safeQuery<NewsItem>('news', { enabled: true }, { orderBy: [{ field: 'date', desc: true }], limit: count + 5 });
  return data.filter((n) => n.category !== 'notice').slice(0, count);
}

export async function getTodaySchedules(): Promise<Pick<ScheduleItem, 'id' | 'title' | 'time' | 'location' | 'status'>[]> {
  const today = new Date().toISOString().slice(0, 10);
  const data = await safeQuery<ScheduleItem>('schedules', { enabled: true, date: today }, { orderBy: [{ field: 'time', desc: false }] });
  return data.map((s) => ({ id: s.id, title: s.title, time: s.time, location: s.location, status: s.status }));
}

export async function getLatestTrades(count = 4): Promise<TradeItem[]> {
  const published = getPublishedTrades();
  const cloudData = await safeQuery<TradeItem>('trades', { enabled: true }, { orderBy: [{ field: 'time', desc: true }], limit: count });
  return [...published, ...cloudData].slice(0, count);
}

export async function getShuttlePreview(count = 5): Promise<ShuttleTime[]> {
  const data = await safeQuery<{ time: string; sort: number }>('shuttle_times', { enabled: true }, { orderBy: [{ field: 'sort', desc: false }], limit: count });
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  return data.map((item) => {
    const [h, m] = item.time.split(':').map(Number);
    const itemTime = h * 60 + m;
    return {
      time: item.time,
      status: itemTime < currentTime ? 'passed' : (itemTime - currentTime <= 30 ? 'soon' : 'upcoming'),
    } as ShuttleTime;
  });
}

/** ========== 新闻资讯 ========== */

export async function getNewsList(): Promise<NewsItem[]> {
  return safeQuery<NewsItem>('news', { enabled: true }, { orderBy: [{ field: 'date', desc: true }] });
}

export async function getLatestNewsByCategory(category: string, count = 1): Promise<NewsItem[]> {
  return safeQuery<NewsItem>('news', { enabled: true, category }, { orderBy: [{ field: 'date', desc: true }], limit: count });
}

export async function getNewsDetail(_id: number | string): Promise<NewsDetail | null> {
  try {
    const data = await cloud.query<NewsDetail>('news', { _id: String(_id) }, { limit: 1 });
    if (data.length === 0) return null;
    const item = data[0];
    return { ...item, id: (item as any).id ?? item._id, content: markdownToHtml(item.content) };
  } catch (e) {
    console.error('[cloud] news detail query failed:', e);
    return null;
  }
}

export async function incrementNewsViewCount(_id: string): Promise<void> {
  try {
    await cloud.update('news', _id, {
      viewCount: cloud.db.command.inc(1),
    });
  } catch (e) {
    console.error('[cloud] increment viewCount failed:', e);
  }
}

export async function submitVoice(type: string, content: string, contact: string, deadline: string): Promise<void> {
  await cloud.add('voices', {
    type,
    content,
    contact,
    expired: false,
    deadline,
    createTime: cloud.db.serverDate(),
  });
}

export async function getVoiceList(): Promise<VoiceItem[]> {
  return safeQuery<VoiceItem>('voices', {}, { orderBy: [{ field: 'createTime', desc: true }] });
}

/** ========== 闲置交易 ========== */

export function getTradeCategories(): Category[] {
  return [
    { id: 'all', name: '全部', icon: '' },
    { id: 'furniture', name: '家具', icon: '🪑' },
    { id: 'appliance', name: '电器', icon: '🔌' },
    { id: 'baby', name: '母婴', icon: '🍼' },
    { id: 'books', name: '书籍', icon: '📚' },
    { id: 'others', name: '其他', icon: '📦' },
  ] as Category[];
}

export async function getTradeList(): Promise<TradeItem[]> {
  const published = getPublishedTrades();
  const cloudData = await safeQuery<TradeItem>('trades', { enabled: true }, { orderBy: [{ field: 'time', desc: true }] });
  return [...published, ...cloudData];
}

export async function getTradeDetail(id: number | string): Promise<TradeDetail | null> {
  const published = getPublishedTrades();
  const found = published.find((item) => String(item.id) === String(id));
  if (found) {
    const detail: TradeDetail = { ...found };
    detail.discount = Math.round((detail.originalPrice - detail.price) / detail.originalPrice * 100);
    if ((detail as TradeItem & { image?: string }).image && !detail.images) {
      detail.images = [(detail as TradeItem & { image?: string }).image!];
    }
    if (!detail.images) {
      detail.images = [];
    }
    return detail;
  }

  try {
    const data = await cloud.query<TradeDetail>('trades', { _id: String(id) }, { limit: 1 });
    if (data.length === 0) return null;
    const item = data[0];
    const detail: TradeDetail = { ...item, id: (item as any).id ?? item._id };
    detail.discount = Math.round((detail.originalPrice - detail.price) / detail.originalPrice * 100);
    if ((detail as TradeItem & { image?: string }).image && !detail.images) {
      detail.images = [(detail as TradeItem & { image?: string }).image!];
    }
    if (!detail.images) {
      detail.images = [];
    }
    return detail;
  } catch (e) {
    console.error('[cloud] trade detail query failed:', e);
    return null;
  }
}

export function getPublishedTrades(): TradeItem[] {
  return wx.getStorageSync('publishedTrades') as TradeItem[] || [];
}

export function savePublishedTrade(trade: TradeItem): void {
  let published = getPublishedTrades();
  published.unshift(trade);
  if (published.length > 50) {
    published = published.slice(0, 50);
  }
  wx.setStorageSync('publishedTrades', published);
}

/** ========== 周边生活 ========== */

export function getServiceCategories(): Category[] {
  return [
    { id: '1', name: '超市', icon: '🏪', color: '#576B95' },
    { id: '2', name: '菜场', icon: '🥬', color: '#07C160' },
    { id: '3', name: '美食', icon: '🍜', color: '#FA9D3B' },
    { id: '4', name: '酒店', icon: '🏨', color: '#576B95' },
    { id: '5', name: '交通', icon: '🚇', color: '#576B95' },
    { id: '6', name: '学校', icon: '🏫', color: '#FA5151' },
    { id: '7', name: '休闲', icon: '☕', color: '#999999' },
    { id: '8', name: '医疗', icon: '🏥', color: '#07C160' },
    { id: '9', name: '商场', icon: '🛍️', color: '#FA9D3B' },
  ] as Category[];
}

export async function getServiceList(_category: string): Promise<ServiceItem[]> {
  return safeQuery<ServiceItem>('services', { enabled: true, category: _category }, { orderBy: [{ field: 'sort', desc: false }] });
}

/** ========== 便民安排 ========== */

export async function getSchedules(): Promise<ScheduleItem[]> {
  return safeQuery<ScheduleItem>('schedules', { enabled: true }, { orderBy: [{ field: 'date', desc: false }, { field: 'time', desc: false }] });
}

/** ========== 缴费知识 ========== */

export async function getPaymentList(): Promise<PaymentItem[]> {
  return safeQuery<PaymentItem>('payments', { enabled: true }, { orderBy: [{ field: 'date', desc: true }] });
}

export async function getPaymentDetail(_id: number | string): Promise<PaymentDetail | null> {
  try {
    const data = await cloud.query<PaymentDetail>('payments', { _id: String(_id) }, { limit: 1 });
    if (data.length === 0) return null;
    const item = data[0];
    return { ...item, id: (item as any).id ?? item._id, content: markdownToHtml(item.content) };
  } catch (e) {
    console.error('[cloud] payment detail query failed:', e);
    return null;
  }
}

/** ========== 班车信息 ========== */

export async function getShuttleSchedule(): Promise<ShuttleTime[]> {
  const data = await safeQuery<{ time: string; sort: number }>('shuttle_times', { enabled: true }, { orderBy: [{ field: 'sort', desc: false }] });
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  return data.map((item) => {
    const [h, m] = item.time.split(':').map(Number);
    const itemTime = h * 60 + m;
    return {
      time: item.time,
      status: itemTime < currentTime ? 'passed' : (itemTime - currentTime <= 30 ? 'soon' : 'upcoming'),
    } as ShuttleTime;
  });
}

export async function getShuttleStops(): Promise<string[]> {
  try {
    const data = await cloud.query<{ stops: string[] }>('shuttle_config', { enabled: true }, { limit: 1 });
    return data.length > 0 ? data[0].stops : [];
  } catch (e) {
    console.error('[cloud] shuttle config query failed:', e);
    return [];
  }
}

export async function getShuttleContactPhone(): Promise<string> {
  try {
    const data = await cloud.query<{ contactPhone: string }>('shuttle_config', { enabled: true }, { limit: 1 });
    return data.length > 0 ? data[0].contactPhone : '';
  } catch (e) {
    return '';
  }
}

export async function getShuttleRouteName(): Promise<string> {
  try {
    const data = await cloud.query<{ routeName: string }>('shuttle_config', { enabled: true }, { limit: 1 });
    return data.length > 0 ? data[0].routeName : '';
  } catch (e) {
    return '';
  }
}

export async function getShuttleRunNote(): Promise<string> {
  try {
    const data = await cloud.query<{ runNote: string }>('shuttle_config', { enabled: true }, { limit: 1 });
    return data.length > 0 ? data[0].runNote : '';
  } catch (e) {
    return '';
  }
}

/** ========== 个人中心 ========== */

export function getProfileItems(): ProfileItem[] {
  return [
    { id: 1, title: '关于我们', icon: '/images/icons/profile/info.svg', path: '' },
    { id: 2, title: '小程序反馈', icon: '/images/icons/profile/feedback.svg', path: '/pages/feedback/feedback' },
    { id: 3, title: '联系物业', icon: '/images/icons/profile/call.svg', path: '' },
    { id: 4, title: '使用指南', icon: '/images/icons/profile/help.svg', path: '/pages/guide/guide' },
  ];
}

export async function getContacts(): Promise<ContactItem[]> {
  return safeQuery<ContactItem>('contacts', { enabled: true }, { orderBy: [{ field: 'sort', desc: false }] });
}

export async function getFeedbackConfig(): Promise<FeedbackConfig | null> {
  try {
    const data = await cloud.query<any>('feedback_config', { enabled: true }, { limit: 1 });
    if (data.length === 0) return null;
    const item = data[0];
    return { ...item, id: item.id ?? item._id };
  } catch (e) {
    console.error('[cloud] feedback_config query failed:', e);
    return null;
  }
}

export async function submitFeedback(type: string, content: string, contact: string): Promise<void> {
  await cloud.add('feedback', {
    type,
    content,
    contact,
    status: 'pending',
    createTime: cloud.db.serverDate(),
  });
}

export async function getGuides(): Promise<GuideItem[]> {
  return safeQuery<GuideItem>('guides', { enabled: true }, { orderBy: [{ field: 'sort', desc: false }] });
}

export async function getGuideDetail(_id: number | string): Promise<GuideDetail | null> {
  try {
    const data = await cloud.query<any>('guides', { _id: String(_id) }, { limit: 1 });
    if (data.length === 0) return null;
    const item = data[0];
    return { ...item, id: item.id ?? item._id, content: markdownToHtml(item.content) };
  } catch (e) {
    console.error('[cloud] guide detail query failed:', e);
    return null;
  }
}
