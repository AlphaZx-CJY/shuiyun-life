import type {
  Banner,
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
} from '../types/data';

/** ========== 首页 ========== */

export const banners: Banner[] = [
  { id: 1, image: '/images/banners/banner1.jpg', title: '小区绿化升级完成' },
  { id: 2, image: '/images/banners/banner2.jpg', title: '周末社区活动预告' },
];

export const quickEntries: QuickEntry[] = [
  { id: 1, icon: '🏪', label: '周边生活', color: '#1D1D1F', path: '/pages/life-info/life-info' },
  { id: 2, icon: '🔄', label: '闲置交易', color: '#1D1D1F', path: '/pages/trade/trade' },
  { id: 3, icon: '📰', label: '新闻资讯', color: '#1D1D1F', path: '/pages/news/news' },
  { id: 4, icon: '💰', label: '缴费知识', color: '#1D1D1F', path: '/pages/payment/payment' },
  { id: 5, icon: '📅', label: '便民安排', color: '#1D1D1F', path: '/pages/schedule/schedule' },
  { id: 6, icon: '🚌', label: '班车信息', color: '#1D1D1F', path: '/pages/shuttle/shuttle' },
];

export const latestNews: NewsItem[] = [
  {
    id: 1,
    title: '小区地下停车场维护通知',
    summary: '定于本周六对B2层进行地面养护，请业主提前挪车。',
    source: '物业中心',
    date: '2025-04-22',
    tag: '通知',
    category: 'notice',
    cover: '/images/banners/banner1.jpg',
  },
  {
    id: 2,
    title: '周边新开生鲜超市，步行5分钟直达',
    summary: '位于福泉路的新生鲜超市正式营业，业主专享95折优惠。',
    source: '生活圈',
    date: '2025-04-21',
    tag: '周边',
    category: 'around',
    cover: '/images/banners/banner2.jpg',
  },
];

export const todaySchedules: Pick<ScheduleItem, 'id' | 'title' | 'time' | 'location' | 'status'>[] = [
  { id: 1, title: '社区义诊活动', time: '09:00-11:00', location: '中心花园', status: 'upcoming' },
  { id: 2, title: '垃圾分类宣讲', time: '14:00-15:30', location: '物业会议室', status: 'upcoming' },
];

/** ========== 新闻资讯 ========== */

export const allNews: NewsItem[] = [
  {
    id: 1,
    title: '小区地下停车场维护通知',
    summary: '定于本周六对B2层进行地面养护，请业主提前挪车，预计工期2天。',
    source: '物业中心',
    date: '2025-04-22',
    tag: '社区通知',
    category: 'notice',
    cover: '/images/banners/banner1.jpg',
  },
  {
    id: 2,
    title: '周边新开生鲜超市，步行5分钟直达',
    summary: '位于福泉路的新生鲜超市正式营业，业主专享95折优惠，生鲜蔬果每日直供。',
    source: '生活圈',
    date: '2025-04-21',
    tag: '周边动态',
    category: 'around',
    cover: '/images/banners/banner2.jpg',
  },
];

export const newsDetails: Record<number, NewsDetail> = {
  1: {
    id: 1,
    title: '小区地下停车场维护通知',
    summary: '定于本周六对B2层进行地面养护，请业主提前挪车，预计工期2天。',
    source: '物业中心',
    date: '2025-04-22',
    tag: '社区通知',
    category: 'notice',
    cover: '/images/banners/banner1.jpg',
    content: `
<p>尊敬的各位业主：</p>
<p>为进一步提升小区停车环境，物业服务中心定于<strong>2025年4月26日（周六）</strong>对B2层地下停车场进行地面养护施工。</p>
<h3>施工安排</h3>
<ul>
<li>施工时间：4月26日 08:00 - 18:00</li>
<li>施工区域：B2层 A区至C区</li>
<li>预计工期：2天</li>
</ul>
<h3>注意事项</h3>
<ul>
<li>请B2层A-C区车主于4月25日24:00前将车辆挪至B1层或地面临时停车位</li>
<li>施工期间禁止进入施工区域</li>
<li>如有疑问请联系物业：021-12345678</li>
</ul>
<p>给您带来的不便，敬请谅解！</p>
<p style="text-align:right">水韵名邸物业服务中心<br>2025年4月22日</p>
    `,
    viewCount: 256,
  },
  2: {
    id: 2,
    title: '周边新开生鲜超市，步行5分钟直达',
    summary: '位于福泉路的新生鲜超市正式营业，业主专享95折优惠，生鲜蔬果每日直供。',
    source: '生活圈',
    date: '2025-04-21',
    tag: '周边动态',
    category: 'around',
    cover: '/images/banners/banner2.jpg',
    content: `
<p>好消息！位于福泉路188号的<strong>鲜生活生鲜超市</strong>于本周正式开业啦！</p>
<h3>业主专属福利</h3>
<ul>
<li>凭业主卡享全场95折（特价商品除外）</li>
<li>开业前3天满100减20</li>
<li>每日早上7:00新鲜蔬果上架</li>
</ul>
<h3>超市信息</h3>
<ul>
<li>地址：福泉路188号（小区东门出左转步行5分钟）</li>
<li>营业时间：07:00-22:00</li>
<li>联系电话：021-87654321</li>
</ul>
<p>欢迎大家前去选购！</p>
    `,
    viewCount: 189,
  },
};

/** ========== 闲置交易 ========== */

export const trades: TradeItem[] = [
  {
    id: 1,
    title: '宜家双人沙发，9成新',
    price: 800,
    originalPrice: 2999,
    category: 'furniture',
    images: ['/images/banners/banner1.jpg'],
    seller: '3号楼王先生',
    time: '2小时前',
    location: '3号楼',
    description: '搬家转让，使用2年，保养很好，无破损。',
  },
  {
    id: 2,
    title: '小米空气净化器Pro',
    price: 350,
    originalPrice: 899,
    category: 'appliance',
    images: ['/images/banners/banner2.jpg'],
    seller: '5号楼李女士',
    time: '5小时前',
    location: '5号楼',
    description: '滤网刚换，功能完好，因升级换新转让。',
  },
  {
    id: 3,
    title: '婴儿推车（可坐可躺）',
    price: 200,
    originalPrice: 1200,
    category: 'baby',
    images: ['/images/banners/banner3.jpg'],
    seller: '8号楼张妈妈',
    time: '1天前',
    location: '8号楼',
    description: '宝宝大了用不上了，轮子顺滑，可折叠。',
  },
];

export const tradeDetails: Record<number, TradeDetail> = {
  1: {
    ...trades[0],
    phone: '13800135678',
    description: '搬家转让，使用2年，保养很好，无破损。沙发尺寸：长2米，宽0.9米。颜色为深灰色布艺，可拆洗。仅限自提，可协助搬下楼。',
  },
  2: {
    ...trades[1],
    phone: '13900131234',
    description: '滤网刚换，功能完好，因升级换新转让。适用面积35-60平方米，支持米家APP远程控制。',
  },
  3: {
    ...trades[2],
    phone: '13600139876',
    description: '宝宝大了用不上了，轮子顺滑，可折叠。重量约7kg，可登机。附赠雨罩和蚊帐。',
  },
};

export const tradeCategories: Category[] = [
  { id: 'furniture', name: '家具', icon: '家' },
  { id: 'appliance', name: '电器', icon: '电' },
  { id: 'baby', name: '母婴', icon: '婴' },
  { id: 'books', name: '书籍', icon: '书' },
  { id: 'others', name: '其他', icon: '其' },
];

/** ========== 周边生活 ========== */

export const serviceCategories: Category[] = [
  { id: 'supermarket', name: '超市', icon: '超' },
  { id: 'market', name: '菜场', icon: '菜' },
  { id: 'food', name: '美食', icon: '食' },
  { id: 'hotel', name: '酒店', icon: '住' },
  { id: 'transport', name: '交通', icon: '交' },
  { id: 'school', name: '学校', icon: '学' },
  { id: 'leisure', name: '休闲', icon: '休' },
];

export const serviceData: Record<string, ServiceItem[]> = {
  supermarket: [
    {
      id: 1,
      name: '吉买盛超市（重固店）',
      address: '重固镇福泉山路518号',
      distance: '1.2km',
      hours: '08:00-21:30',
      phone: '021-69291234',
      tags: ['综合超市', '生鲜日用'],
    },
  ],
  market: [
    {
      id: 4,
      name: '重固菜市场',
      address: '重固镇重固大街',
      distance: '800m',
      hours: '05:00-12:00',
      phone: '021-69294567',
      tags: ['蔬菜新鲜', '价格实惠'],
    },
  ],
  transport: [
    {
      id: 6,
      name: '重固1路',
      address: '重固汽车站',
      distance: '1.0km',
      hours: '06:00-20:30',
      phone: '',
      tags: ['重固镇内环线'],
    },
  ],
  school: [
    {
      id: 9,
      name: '上海师范大学附属青浦实验学校',
      address: '重固镇福泉山路',
      distance: '1.5km',
      hours: '08:00-16:30',
      phone: '021-69296789',
      tags: ['九年一贯制'],
    },
  ],
  leisure: [
    {
      id: 13,
      name: '重固公园',
      address: '重固镇重固大街东侧',
      distance: '1.0km',
      hours: '05:00-21:00',
      phone: '',
      tags: ['免费开放', '晨练'],
    },
  ],
  food: [
    {
      id: 17,
      name: '重固老饭店',
      address: '重固镇重固大街88号',
      distance: '900m',
      hours: '10:00-21:00',
      phone: '021-69291001',
      tags: ['本帮菜', '农家土菜'],
    },
  ],
  hotel: [
    {
      id: 21,
      name: '如家商旅酒店（赵巷店）',
      address: '赵巷镇赵华路301号',
      distance: '2.8km',
      hours: '24小时',
      phone: '021-69292001',
      tags: ['经济型', '商务出行'],
    },
  ],
};

/** ========== 便民安排 ========== */

export const schedules: ScheduleItem[] = [
  {
    id: 1,
    title: '社区义诊活动',
    date: '2025-04-26',
    time: '09:00-11:00',
    location: '中心花园',
    description: '邀请社区医院医生为业主免费测量血压、血糖，提供健康咨询。',
    status: 'upcoming',
    type: '健康',
  },
  {
    id: 4,
    title: '春季消防安全演练',
    date: '2025-04-20',
    time: '10:00-11:00',
    location: '小区广场',
    description: '消防器材使用演示、逃生疏散演练，欢迎业主积极参与。',
    status: 'ended',
    type: '安全',
  },
];

/** ========== 缴费知识 ========== */

export const payments: PaymentItem[] = [
  {
    id: 1,
    title: '物业费缴纳指南',
    summary: '2025年度物业费缴纳方式、优惠政策及常见问题解答',
    tag: '物业费',
    tagType: 'blue',
    date: '2025-04-20',
    hot: true,
  },
  {
    id: 2,
    title: '水费缴纳流程',
    summary: '线上缴纳水费的详细步骤，支持微信/支付宝/银行APP',
    tag: '水费',
    tagType: 'green',
    date: '2025-04-15',
    hot: false,
  },
];

export const paymentDetails: Record<number, PaymentDetail> = {
  1: {
    id: 1,
    title: '物业费缴纳指南',
    tag: '物业费',
    content: `
<h2>缴纳方式</h2>
<ul>
<li><strong>线上缴纳</strong>：通过"水韵名邸"公众号 → 物业服务 → 在线缴费，支持微信/支付宝/银联</li>
<li><strong>现场缴纳</strong>：物业服务中心前台（工作日 9:00-17:00，周末 10:00-16:00）</li>
<li><strong>银行转账</strong>：开户行工商银行长宁支行，账号：6222 0000 0000 0000 000</li>
</ul>
<h2>优惠政策</h2>
<ul>
<li>早鸟优惠：5月31日前缴纳享<strong>98折</strong></li>
<li>按时缴纳：6月30日前缴纳无滞纳金</li>
<li>一次性缴纳全年送保洁服务1次</li>
</ul>
<h2>收费标准</h2>
<table>
<tr><td>住宅</td><td>2.8元/平方米/月</td></tr>
<tr><td>地下车位</td><td>80元/月</td></tr>
<tr><td>地面临时停车</td><td>5元/小时，封顶30元/天</td></tr>
</table>
<h2>常见问题</h2>
<p><strong>Q：物业费包含哪些内容？</strong></p>
<p>A：包含公共区域保洁、绿化养护、电梯维保、消防设施维护、保安巡逻等。</p>
<p><strong>Q：逾期未缴纳会怎样？</strong></p>
<p>A：逾期将按日收取0.05%滞纳金，连续3个月未缴纳将暂停门禁卡权限。</p>
    `,
    date: '2025-04-20',
  },
  2: {
    id: 2,
    title: '水费缴纳流程',
    tag: '水费',
    content: `
<h2>缴费渠道</h2>
<ul>
<li><strong>微信</strong>：我 → 服务 → 生活缴费 → 水费 → 选择"上海自来水"</li>
<li><strong>支付宝</strong>：生活缴费 → 水费 → 输入户号</li>
<li><strong>银行APP</strong>：工行/建行/招行APP生活缴费板块</li>
</ul>
<h2>户号查询</h2>
<p>水费账单上12位数字即为户号，或拨打供水热线962740查询。</p>
<h2>收费标准</h2>
<p>上海居民用水实行阶梯价格：</p>
<ul>
<li>第一阶梯（0-220立方米/年）：3.45元/立方米</li>
<li>第二阶梯（220-300立方米/年）：4.83元/立方米</li>
<li>第三阶梯（300立方米以上/年）：5.83元/立方米</li>
</ul>
    `,
    date: '2025-04-15',
  },
};

/** ========== 班车信息 ========== */

export const shuttleSchedule: ShuttleTime[] = [
  { time: '06:30', status: 'upcoming' },
  { time: '07:20', status: 'upcoming' },
  { time: '08:10', status: 'upcoming' },
  { time: '09:00', status: 'upcoming' },
  { time: '16:30', status: 'upcoming' },
  { time: '17:20', status: 'upcoming' },
  { time: '18:10', status: 'upcoming' },
  { time: '19:00', status: 'upcoming' },
];

export const shuttleStops = ['小区（起点）', '赵巷地铁站一号口（终点）'];
export const shuttleContactPhone = '15001713063';
export const shuttleRouteName = '小区 → 赵巷地铁站一号口';
export const shuttleRunNote = '工作日及节假日均运行';

/** ========== 个人中心 ========== */

export const profileItems: ProfileItem[] = [
  { id: 1, title: '关于我们', icon: '🏠', path: '' },
  { id: 2, title: '意见反馈', icon: '✉️', path: '' },
  { id: 3, title: '联系物业', icon: '📞', path: '' },
  { id: 4, title: '使用指南', icon: '📖', path: '' },
];

export const contactPhones = [
  { label: '物业前台 59251006', number: '59251006' },
  { label: '监控室夜班 59251005', number: '59251005' },
  { label: '重固派出所 021-59781249', number: '021-59781249' },
];
