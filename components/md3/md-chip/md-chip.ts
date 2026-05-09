Component({
  properties: {
    variant: { type: String, value: 'filled' },
    icon: { type: String, value: '' },
    closable: { type: Boolean, value: false },
    active: { type: Boolean, value: false },
  },
  methods: {
    onTap() {
      this.triggerEvent('tap');
    },
    onClose() {
      this.triggerEvent('close');
    },
  },
});
