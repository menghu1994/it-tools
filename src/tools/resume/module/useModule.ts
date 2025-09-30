import { format } from 'date-fns';
export function useModule(props: { readonly value: Record<string, any>; }) {
	const data = computed(() => props.value)
	const hasValue = (value: any): boolean => {
		if(!value) { return false }
		if(Array.isArray(value)) {
			return !!value.length
		}
		if(typeof value === 'object') {
			return Object.keys(value).length > 0;
		}
		return true
	}

	const formatDate = (date: number, formatStr = "yyyy.MM"): string => {
		if(!data) { return ''}
		return format(date, formatStr)
	}

  return {
    data,
    hasValue,
		formatDate
  };
}
