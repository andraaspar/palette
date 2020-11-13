import { useEffect, useRef, useState } from 'react'

export interface UseInputParams<T> {
	value: T
	setValue(v: T): void
	valueFromString(v: string): T
	valueToString(v: T): string
}

export function useInput<T>(o: UseInputParams<T>) {
	const inputFocusedRef = useRef<boolean>(false)
	const [$value, set$value] = useState(o.valueToString(o.value))
	const { value, valueToString } = o
	useEffect(() => {
		if (!inputFocusedRef.current) {
			set$value(valueToString(value))
		}
	}, [value, valueToString])
	return {
		value: $value,
		onFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
			inputFocusedRef.current = true
			try {
				e.currentTarget.setSelectionRange(0, e.currentTarget.value.length)
			} catch (e) {}
		},
		onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
			inputFocusedRef.current = false
			o.setValue(o.valueFromString(e.currentTarget.value))
		},
		onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
			set$value(e.currentTarget.value)
			o.setValue(o.valueFromString(e.currentTarget.value))
		},
	}
}
