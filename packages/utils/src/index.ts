import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

export const formatDate = (date: string | Date, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(date).format(format);
};

export const formatRelativeTime = (date: string | Date) => {
  return dayjs(date).fromNow();
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
