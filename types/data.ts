/** ========== 通用类型 ========== */

export type NewsCategory = 'all' | 'notice' | 'policy' | 'around';
export type TradeCategory = 'all' | 'furniture' | 'appliance' | 'baby' | 'books' | 'others';
export type ScheduleStatus = 'upcoming' | 'ended';
export type ShuttleStatus = 'passed' | 'soon' | 'upcoming';

export interface GeoPoint {
  longitude: number;
  latitude: number;
}

/** ========== 新闻资讯 ========== */

export interface NewsItem {
  id: number | string;
  title: string;
  summary: string;
  source: string;
  date: string;
  tag: string;
  category: Exclude<NewsCategory, 'all'>;
  cover: string;
}

export interface NewsDetail extends NewsItem {
  content: string;
  viewCount: number;
}

/** ========== 闲置交易 ========== */

export interface TradeItem {
  id: number | string;
  title: string;
  price: number;
  originalPrice: number;
  category: Exclude<TradeCategory, 'all'>;
  images: string[];
  seller: string;
  phone?: string;
  time: string;
  location: string;
  description: string;
  imageError?: boolean;
  categoryName?: string;
  discount?: number;
}

export interface TradeDetail extends TradeItem {
  phone?: string;
  discount?: number;
}

export interface TradeForm {
  title: string;
  price: string;
  originalPrice: string;
  description: string;
  seller: string;
  phone: string;
  location: string;
}

/** ========== 周边生活 ========== */

export interface Category {
  id: number | string;
  name: string;
  icon: string;
}

export type JumpType = 'miniprogram' | 'officialAccount';

export interface ServiceItem {
  id: number | string;
  name: string;
  category: string;
  address: string;
  distance: string;
  hours: string | string[];
  phone: string;
  tags: string[];
  location?: GeoPoint;
  jump?: {
    type: JumpType;
    appId?: string;
    username?: string;
    path?: string;
  };
}

/** ========== 活动安排 ========== */

export const SCHEDULE_TYPE_MAP: Record<string, string> = {
  community: '社区活动',
  sports: '体育活动',
  culture: '文化活动',
  volunteer: '志愿服务',
  lecture: '讲座培训',
  entertainment: '休闲娱乐',
  health: '健康医疗',
  education: '亲子教育',
  party: '节日庆典',
  meeting: '业主大会',
  other: '其他活动',
};

export interface ScheduleItem {
  id: number | string;
  title: string;
  /** 活动开始日期 YYYY-MM-DD */
  startDate: string;
  /** 活动结束日期 YYYY-MM-DD，不填则默认等于 startDate */
  endDate?: string;
  /** 计算后的展示日期，如 "2024-02-10" 或 "2024-02-10 ~ 2024-02-12" */
  date: string;
  time: string;
  location: string;
  description: string;
  status: ScheduleStatus;
  type: string;
}

/** ========== 缴费知识 ========== */

export interface PaymentItem {
  id: number | string;
  title: string;
  summary: string;
  tag: string;
  tagType: string;
  date: string;
  hot: boolean;
}

export interface PaymentDetail {
  id: number | string;
  title: string;
  tag: string;
  content: string;
  date: string;
}

/** ========== 班车信息 ========== */

export interface ShuttleTime {
  time: string;
  status: ShuttleStatus;
  minutesUntil?: number;
}

/** ========== 个人中心 ========== */

export interface ProfileItem {
  id: number | string;
  title: string;
  icon: string;
  path: string;
}

/** ========== 物业联系方式 ========== */

export interface ContactItem {
  id: number | string;
  label: string;
  number: string;
}

/** ========== 社区心声 ========== */

export interface VoiceItem {
  id: number | string;
  type: string;
  content: string;
  contact: string;
  expired: boolean;
  deadline: string;
  createTime: Date;
  images?: string[];
}

/** ========== 使用指南 ========== */

export interface GuideItem {
  id: number | string;
  title: string;
  tag: string;
  date: string;
}

export interface GuideDetail extends GuideItem {
  content: string;
}

/** ========== 发现页 Feed ========== */

export interface DiscoverItem {
  id: number | string;
  type: 'news' | 'service' | 'payment' | 'schedule' | 'voice';
  title: string;
  summary: string;
  date: string;
  tag: string;
  containerClass: string;
  url: string;
}
