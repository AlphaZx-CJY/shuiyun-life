Component({
  properties: {
    news: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', { id: this.data.news.id });
    }
  }
});
