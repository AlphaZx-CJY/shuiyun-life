Component({
  properties: {
    service: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', { item: this.data.service });
    }
  }
});
