Component({
  properties: {
    label: { type: String, value: '' },
    placeholder: { type: String, value: '' },
    type: { type: String, value: 'text' },
    value: { type: String, value: '' },
    maxlength: { type: Number, value: -1 },
    error: { type: Boolean, value: false },
    errorText: { type: String, value: '' },
    multiline: { type: Boolean, value: false },
    required: { type: Boolean, value: false },
  },
  methods: {
    onInput(e: WechatMiniprogram.Input) {
      this.triggerEvent('input', { value: e.detail.value });
    },
  },
});
