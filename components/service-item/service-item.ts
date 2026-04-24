import type { ServiceItem } from '../../types/data';

interface IServiceItemData {
  service: ServiceItem;
}

Component<IServiceItemData, Record<string, any>, Record<string, any>>({
  properties: {
    service: {
      type: Object,
      value: {} as ServiceItem,
    },
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', { item: this.data.service });
    },
  },
});
