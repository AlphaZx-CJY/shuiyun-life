Page({
  data: {
    newsId: null,
    news: null
  },

  onLoad(options) {
    const { id } = options;
    this.setData({ newsId: id });
    this.loadNewsDetail(id);
  },

  onShareAppMessage() {
    return {
      title: this.data.news?.title || '资讯详情',
      path: `/pages/news-detail/news-detail?id=${this.data.newsId}`
    };
  },

  loadNewsDetail(id) {
    const newsData = {
      1: {
        id: 1,
        title: '小区地下停车场维护通知',
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
        source: '物业中心',
        date: '2025-04-22',
        viewCount: 256
      },
      2: {
        id: 2,
        title: '周边新开生鲜超市，步行5分钟直达',
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
        source: '生活圈',
        date: '2025-04-21',
        viewCount: 189
      },
      3: {
        id: 3,
        title: '2025年物业费缴纳指南',
        content: `
<p>各位业主您好，2025年度物业费缴纳工作已启动。</p>
<h3>缴纳方式</h3>
<ul>
<li>线上缴纳：通过"水韵名邸"公众号 - 物业服务 - 在线缴费</li>
<li>现场缴纳：物业服务中心前台（工作日 9:00-17:00）</li>
<li>银行转账：开户行：工商银行，账号：xxxx xxxx xxxx</li>
</ul>
<h3>优惠政策</h3>
<ul>
<li>早鸟优惠：5月31日前缴纳享98折</li>
<li>按时缴纳：6月30日前缴纳无滞纳金</li>
</ul>
<h3>收费标准</h3>
<ul>
<li>住宅：2.8元/平方米/月</li>
<li>车位：80元/月</li>
</ul>
        `,
        source: '物业中心',
        date: '2025-04-20',
        viewCount: 312
      },
      4: {
        id: 4,
        title: '上海市公积金提取新政解读',
        content: `
<p>上海市住房公积金管理中心发布新政，自2025年5月1日起实施。</p>
<h3>主要变化</h3>
<ul>
<li>租房提取月额度从2500元提高至3000元</li>
<li>老旧小区加装电梯可申请提取公积金</li>
<li>多子女家庭租房提取额度上浮20%</li>
</ul>
<h3>申请条件</h3>
<ul>
<li>连续缴存满3个月</li>
<li>本人及配偶在沪无自有住房</li>
<li>租赁房屋已在住房租赁平台备案</li>
</ul>
        `,
        source: '政策速递',
        date: '2025-04-18',
        viewCount: 156
      },
      5: {
        id: 5,
        title: '小区周边公交线路优化调整',
        content: `
<p>为方便居民出行，市交通委对788路公交线路进行优化调整。</p>
<h3>新增站点</h3>
<ul>
<li>福泉路金钟路站（距小区东门200米）</li>
<li>淞虹路天山西路站（可换乘地铁2号线）</li>
</ul>
<h3>运营时间</h3>
<ul>
<li>首班车：06:00</li>
<li>末班车：22:30</li>
<li>发车间隔：高峰8分钟，平峰15分钟</li>
</ul>
        `,
        source: '生活圈',
        date: '2025-04-15',
        viewCount: 98
      }
    };

    this.setData({ news: newsData[id] || null });
  }
});
