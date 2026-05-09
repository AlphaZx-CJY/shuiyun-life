Component({
  properties: {
    shape: { type: String, value: 'large' },
    clickable: { type: Boolean, value: false },
  },
  methods: {
    onTap() {
      if (this.data.clickable) {
        this.triggerEvent('tap');
      }
    },
  },
});
