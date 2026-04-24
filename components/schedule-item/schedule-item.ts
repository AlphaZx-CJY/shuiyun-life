import type { ScheduleItem } from '../../types/data';

interface IScheduleItemData {
  schedule: ScheduleItem;
}

Component<IScheduleItemData, Record<string, any>, Record<string, any>>({
  properties: {
    schedule: {
      type: Object,
      value: {} as ScheduleItem,
    },
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', { item: this.data.schedule });
    },
  },
});
