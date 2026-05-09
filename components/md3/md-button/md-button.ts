Component({
  properties: {
    variant: { type: String, value: 'filled' },
    size: { type: String, value: 'default' },
    disabled: { type: Boolean, value: false },
    icon: { type: String, value: '' },
  },
  methods: {
    onTap() {
      if (!this.data.disabled) {
        this.triggerEvent('tap');
      }
    },
  },
});
