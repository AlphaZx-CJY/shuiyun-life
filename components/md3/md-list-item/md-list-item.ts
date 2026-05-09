Component({
  properties: {
    headline: { type: String, value: '' },
    supportingText: { type: String, value: '' },
    leadingIcon: { type: String, value: '' },
    trailingIcon: { type: String, value: '' },
    divider: { type: Boolean, value: true },
  },
  methods: {
    onTap() {
      this.triggerEvent('tap');
    },
  },
});
