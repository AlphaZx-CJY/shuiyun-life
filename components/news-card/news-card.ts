import type { NewsItem } from '../../types/data';

interface INewsCardData {
  news: NewsItem;
}

Component<INewsCardData, Record<string, any>, Record<string, any>>({
  properties: {
    news: {
      type: Object,
      value: {} as NewsItem,
    },
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', { id: (this.data.news as NewsItem).id });
    },
  },
});
