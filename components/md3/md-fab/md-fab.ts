Component({
  properties: {
    variant: { type: String, value: 'default' },
    icon: { type: String, value: '' },
    label: { type: String, value: '' },
  },
  methods: {
    onTap() {
      this.triggerEvent('tap');
    },
  },
});
