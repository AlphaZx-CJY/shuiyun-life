import * as cloud from './cloud';
import { markdownToHtml } from '../utils/util';
import type {
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
  GuideItem,
  GuideDetail,
  VoiceItem,
} from '../types/data';

/** 通用安全查询：自动映射 _id → id，出错返回空数组 */
async function safeQuery<T extends { id?: number | string; _id?: string }>(
  collection: string,
  where?: Record<string, unknown>,
  options?: cloud.QueryOptions,
): Promise<T[]> {
  try {
    const data = await cloud.query<T>(collection, where, options);
    return data.map((item) => ({ ...item, id: item.id ?? item._id }));
  } catch (e) {
    console.error(`[cloud] ${collection} query failed:`, e);
    return [];
  }
}

/** 从对象中收集所有 cloud:// 开头的 fileID */
function collectCloudIds(obj: unknown): string[] {
  const ids: string[] = [];
  const seen = new Set<string>();

  function walk(val: unknown) {
    if (typeof val === 'string') {
      if (val.startsWith('cloud://') && !seen.has(val)) {
        ids.push(val);
        seen.add(val);
      }
      const imgRegex = /<img[^>]+src=["'](cloud:\/\/[^"']+)["']/g;
      let match;
      while ((match = imgRegex.exec(val)) !== null) {
        if (!seen.has(match[1])) {
          ids.push(match[1]);
          seen.add(match[1]);
        }
      }
    } else if (Array.isArray(val)) {
      val.forEach(walk);
    } else if (val && typeof val === 'object') {
      Object.keys(val).forEach((key) => walk((val as Record<string, unknown>)[key]));
    }
  }

  walk(obj);
  return ids;
}

/** 根据映射表替换对象中的 cloudId */
function replaceCloudIds<T>(obj: T, urlMap: Map<string, string>): T {
  function walk(val: unknown): unknown {
    if (typeof val === 'string') {
      let result = val;
      if (val.startsWith('cloud://') && urlMap.has(val)) {
        result = urlMap.get(val)!;
      }
      result = result.replace(
        /<img([^>]+)src=["'](cloud:\/\/[^"']+)["']/g,
        (match: string, attrs: string, fileId: string) => {
          const url = urlMap.get(fileId);
          return url ? `<img${attrs}src="${url}"` : match;
        },
      );
      return result;
    } else if (Array.isArray(val)) {
      return val.map(walk);
    } else if (val && typeof val === 'object') {
      const result: Record<string, unknown> = {};
      for (const k of Object.keys(val)) {
        result[k] = walk((val as Record<string, unknown>)[k]);
      }
      return result;
    }
    return val;
  }

  return walk(obj) as T;
}

/** 将对象中所有 cloud:// fileID 转换为临时 HTTPS URL */
async function resolveCloudUrls<T>(data: T): Promise<T> {
  const ids = collectCloudIds(data);
  if (ids.length === 0) return data;

  try {
    const res = await wx.cloud.getTempFileURL({ fileList: ids });
    const urlMap = new Map<string, string>();
    res.fileList.forEach((item, index) => {
      if (item.tempFileURL) {
        urlMap.set(ids[index], item.tempFileURL);
      }
    });
    return replaceCloudIds(data, urlMap);
  } catch (e) {
    console.error('[cloud] getTempFileURL failed:', e);
    return data;
  }
}

/** ========== 首页 ========== */

export async function getRecentSchedules(limit = 5): Promise<Pick<ScheduleItem, 'id' | 'title' | 'time' | 'location' | 'status' | 'date'>[]> {
  const today = new Date().toISOString().slice(0, 10);
  const data = await safeQuery<ScheduleItem>('schedules', { enabled: true, date: cloud.db.command.gte(today) }, { orderBy: [{ field: 'date', desc: false }, { field: 'time', desc: false }], limit });
  const now = new Date();
  return data.map((s) => {
    const itemDateTime = new Date(`${s.date}T${s.time}`);
    const status = itemDateTime < now ? 'ended' : 'upcoming';
    return { id: s.id, title: s.title, time: s.time, location: s.location, status, date: s.date };
  });
}

export async function getShuttlePreview(count = 5): Promise<ShuttleTime[]> {
  const data = await safeQuery<{ time: string; sort: number; id?: string; _id?: string }>('shuttle_times', { enabled: true }, { orderBy: [{ field: 'sort', desc: false }], limit: count });
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
  const data = await safeQuery<NewsItem>('news', { enabled: true }, { orderBy: [{ field: 'date', desc: true }] });
  return resolveCloudUrls(data);
}

export async function getLatestNewsByCategory(category: string, count = 1): Promise<NewsItem[]> {
  return safeQuery<NewsItem>('news', { enabled: true, category }, { orderBy: [{ field: 'date', desc: true }], limit: count });
}

export async function getNewsDetail(_id: number | string): Promise<NewsDetail | null> {
  try {
    const data = await cloud.query<NewsDetail & { _id: string }>('news', { _id: String(_id) }, { limit: 1 });
    if (data.length === 0) return null;
    const item = data[0];
    const detail = { ...item, id: item.id ?? item._id, content: markdownToHtml(item.content) };
    return resolveCloudUrls(detail);
  } catch (e) {
    console.error('[cloud] news detail query failed:', e);
    return null;
  }
}

export async function submitVoice(type: string, content: string, contact: string, deadline: string, images?: string[]): Promise<string> {
  const res = await cloud.add('voices', {
    type,
    content,
    contact,
    expired: false,
    deadline,
    images: images || [],
    createTime: cloud.db.serverDate(),
  });
  const docId = (res as unknown as { _id: string })._id;
  const ids = wx.getStorageSync<string[]>('myVoiceIds') || [];
  wx.setStorageSync('myVoiceIds', [...ids, docId]);
  return docId;
}

export async function getVoiceList(): Promise<VoiceItem[]> {
  const data = await safeQuery<VoiceItem>('voices', {}, { orderBy: [{ field: 'createTime', desc: true }] });
  return data.map((item) => ({ ...item, id: (item as unknown as { _id: string })._id }));
}

export async function getVoiceDetail(id: string): Promise<VoiceItem | null> {
  const list = await safeQuery<VoiceItem>('voices', { _id: id });
  return list[0] || null;
}

export async function updateVoice(id: string, data: Partial<VoiceItem>): Promise<void> {
  await cloud.update('voices', id, data as Record<string, unknown>);
}

export async function deleteVoice(id: string): Promise<void> {
  await cloud.remove('voices', id);
  const ids = wx.getStorageSync<string[]>('myVoiceIds') || [];
  wx.setStorageSync('myVoiceIds', ids.filter((docId) => docId !== id));
}

export async function getMyVoiceList(): Promise<VoiceItem[]> {
  const ids = wx.getStorageSync<string[]>('myVoiceIds') || [];
  if (ids.length === 0) return [];
  const data = await safeQuery<VoiceItem>('voices', { _id: cloud.db.command.in(ids) });
  const result = data.map((item) => ({ ...item, id: (item as unknown as { _id: string })._id }));
  const returnedIds = new Set(result.map((item) => String(item.id)));
  const validIds = ids.filter((id) => returnedIds.has(id));
  if (validIds.length !== ids.length) {
    wx.setStorageSync('myVoiceIds', validIds);
  }
  return result;
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
  const data = await safeQuery<TradeItem>('trades', { enabled: true }, { orderBy: [{ field: 'createTime', desc: true }] });
  return resolveCloudUrls(data.map((item) => ({ ...item, id: (item as unknown as { _id: string })._id })));
}

/** 统一处理 TradeDetail 的图片兼容（image → images）和折扣计算 */
function normalizeTradeDetail(item: TradeItem): TradeDetail {
  const detail: TradeDetail = { ...item };
  if (detail.originalPrice > 0) {
    detail.discount = Math.round((detail.originalPrice - detail.price) / detail.originalPrice * 100);
  }
  if ((detail as TradeItem & { image?: string }).image && !detail.images) {
    detail.images = [(detail as TradeItem & { image?: string }).image!];
  }
  if (!detail.images) {
    detail.images = [];
  }
  return detail;
}

export async function getTradeDetail(id: number | string): Promise<TradeDetail | null> {
  try {
    const data = await cloud.query<TradeDetail & { _id: string }>('trades', { _id: String(id) }, { limit: 1 });
    if (data.length === 0) return null;
    const item = data[0];
    return normalizeTradeDetail({ ...item, id: item.id ?? item._id });
  } catch (e) {
    console.error('[cloud] trade detail query failed:', e);
    return null;
  }
}

export async function savePublishedTrade(trade: TradeItem, localImages: string[]): Promise<string> {
  // 1. 上传图片到云存储
  let imageFileIDs: string[] = [];
  if (localImages.length > 0) {
    const uploadTasks = localImages.map((path) =>
      wx.cloud.uploadFile({
        cloudPath: `trades/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`,
        filePath: path,
      }),
    );
    const results = await Promise.all(uploadTasks);
    imageFileIDs = results.map((res) => res.fileID);
  }

  // 2. 写入云数据库
  const res = await cloud.add('trades', {
    title: trade.title,
    price: trade.price,
    originalPrice: trade.originalPrice,
    category: trade.category,
    images: imageFileIDs,
    seller: trade.seller,
    phone: trade.phone || '',
    location: trade.location,
    description: trade.description,
    enabled: true,
    createTime: cloud.db.serverDate(),
  });
  const docId = (res as unknown as { _id: string })._id;
  const ids = wx.getStorageSync<string[]>('myTradeIds') || [];
  wx.setStorageSync('myTradeIds', [...ids, docId]);
  return docId;
}

export async function updateTrade(id: string, data: Partial<TradeItem>): Promise<void> {
  await cloud.update('trades', id, data as Record<string, unknown>);
}

export async function deleteTrade(id: string): Promise<void> {
  await cloud.remove('trades', id);
  const ids = wx.getStorageSync<string[]>('myTradeIds') || [];
  wx.setStorageSync('myTradeIds', ids.filter((docId) => docId !== id));
}

export async function getMyTradeList(): Promise<TradeItem[]> {
  const ids = wx.getStorageSync<string[]>('myTradeIds') || [];
  if (ids.length === 0) return [];
  const data = await safeQuery<TradeItem>('trades', { _id: cloud.db.command.in(ids) });
  const result = data.map((item) => ({ ...item, id: (item as unknown as { _id: string })._id }));
  const returnedIds = new Set(result.map((item) => String(item.id)));
  const validIds = ids.filter((id) => returnedIds.has(id));
  if (validIds.length !== ids.length) {
    wx.setStorageSync('myTradeIds', validIds);
  }
  return resolveCloudUrls(result);
}

/** ========== 周边生活 ========== */

export async function getServiceList(_category: string): Promise<ServiceItem[]> {
  const where: Record<string, unknown> = { enabled: true };
  if (_category !== 'all') {
    where.category = _category;
  }
  return safeQuery<ServiceItem>('services', where, { orderBy: [{ field: 'sort', desc: false }] });
}

export async function getServiceDetail(_id: number | string): Promise<ServiceItem | null> {
  try {
    const data = await safeQuery<ServiceItem>('services', { _id });
    return data[0] ?? null;
  } catch (e) {
    console.error('[api] getServiceDetail failed:', e);
    return null;
  }
}

/** ========== 活动安排 ========== */

export async function getSchedules(): Promise<ScheduleItem[]> {
  return safeQuery<ScheduleItem>('schedules', { enabled: true }, { orderBy: [{ field: 'date', desc: false }, { field: 'time', desc: false }] });
}

export async function getScheduleDetail(_id: number | string): Promise<ScheduleItem | null> {
  try {
    const data = await safeQuery<ScheduleItem>('schedules', { _id });
    return data[0] ?? null;
  } catch (e) {
    console.error('[api] getScheduleDetail failed:', e);
    return null;
  }
}

/** ========== 缴费知识 ========== */

export async function getPaymentList(): Promise<PaymentItem[]> {
  return safeQuery<PaymentItem>('payments', { enabled: true }, { orderBy: [{ field: 'date', desc: true }] });
}

export async function getPaymentDetail(_id: number | string): Promise<PaymentDetail | null> {
  try {
    const data = await cloud.query<PaymentDetail & { _id: string }>('payments', { _id: String(_id) }, { limit: 1 });
    if (data.length === 0) return null;
    const item = data[0];
    const detail = { ...item, id: item.id ?? item._id, content: markdownToHtml(item.content) };
    return resolveCloudUrls(detail);
  } catch (e) {
    console.error('[cloud] payment detail query failed:', e);
    return null;
  }
}

/** ========== 班车信息 ========== */

export async function getShuttleSchedule(): Promise<ShuttleTime[]> {
  const data = await safeQuery<{ time: string; sort: number; id?: string; _id?: string }>('shuttle_times', { enabled: true }, { orderBy: [{ field: 'sort', desc: false }] });
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
  } catch {
    return '';
  }
}

export async function getShuttleRouteName(): Promise<string> {
  try {
    const data = await cloud.query<{ routeName: string }>('shuttle_config', { enabled: true }, { limit: 1 });
    return data.length > 0 ? data[0].routeName : '';
  } catch {
    return '';
  }
}

export async function getShuttleRunNote(): Promise<string> {
  try {
    const data = await cloud.query<{ runNote: string }>('shuttle_config', { enabled: true }, { limit: 1 });
    return data.length > 0 ? data[0].runNote : '';
  } catch {
    return '';
  }
}

/** ========== 个人中心 ========== */

export function getProfileItems(): ProfileItem[] {
  return [
    { id: 1, title: '关于小程序', icon: '/images/icons/profile/info.svg', path: '' },
    { id: 2, title: '小程序反馈', icon: '/images/icons/profile/feedback.svg', path: '/pages/feedback/feedback' },
    { id: 3, title: '联系物业', icon: '/images/icons/profile/call.svg', path: '' },
    { id: 4, title: '使用指南', icon: '/images/icons/profile/help.svg', path: '/pages/guide/guide' },
  ];
}

export async function getContacts(): Promise<ContactItem[]> {
  return safeQuery<ContactItem>('contacts', { enabled: true }, { orderBy: [{ field: 'sort', desc: false }] });
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

export async function getGuideList(): Promise<GuideItem[]> {
  return safeQuery<GuideItem>('guides', { enabled: true }, { orderBy: [{ field: 'sort', desc: false }] });
}

export async function getGuideDetail(_id: number | string): Promise<GuideDetail | null> {
  try {
    const data = await cloud.query<GuideDetail & { id?: string; _id?: string }>('guides', { _id: String(_id) }, { limit: 1 });
    if (data.length === 0) return null;
    const item = data[0];
    const detail = { ...item, id: item.id ?? item._id, content: markdownToHtml(item.content) };
    return resolveCloudUrls(detail);
  } catch (e) {
    console.error('[cloud] guide detail query failed:', e);
    return null;
  }
}
