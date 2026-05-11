import { format } from 'date-fns';
import { useResumeStore } from '@/stores/resume.store';

export function useModule(props: { readonly value: Record<string, any> }) {
  const data = computed(() => props.value);
  const store = useResumeStore();

  const hasValue = (value: any): boolean => {
    if (!value) {
      return false;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === 'object') {
      return Object.keys(value).length > 0;
    }
    return true;
  };

  const formatDate = (date: number | string | null | undefined, formatStr = 'yyyy.MM'): string => {
    if (date === null || date === undefined || date === '') {
      return '';
    }

    const parsedDate = typeof date === 'number' ? new Date(date) : new Date(String(date));
    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    return format(parsedDate, formatStr);
  };

  return {
    data,
    layout: store.resume.template,
    hasValue,
    formatDate,
  };
}
