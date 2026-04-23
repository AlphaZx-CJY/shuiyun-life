Component({
  properties: {
    schedule: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', { item: this.data.schedule });
    }
  }
});
