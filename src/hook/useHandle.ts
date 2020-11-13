export interface UseHandleParams {
	value: number
	setValue(v: number): void
	clamp: boolean
}

export function useHandle(o: UseHandleParams) {
	return {
		onPointerDown(e: React.PointerEvent) {
			if (e.isPrimary) {
				const dragStartValue = o.value
				// const dragStartY = e.currentTarget.getBoundingClientRect().y
				const dragStartHeight =
					e.currentTarget.parentElement!.getBoundingClientRect().height - 16
				const dragStartPointerY = e.pageY
				const onPointerMove = (e: PointerEvent) => {
					if (e.isPrimary) {
						let value =
							dragStartValue - (e.pageY - dragStartPointerY) / dragStartHeight
						if (o.clamp) {
							value = Math.max(0, Math.min(1, value))
						}
						o.setValue(value)
					}
				}
				const onPointerUp = (e: PointerEvent) => {
					if (e.isPrimary) {
						window.removeEventListener('pointermove', onPointerMove)
						window.removeEventListener('pointerup', onPointerUp)
						window.removeEventListener('pointercancel', onPointerUp)
					}
				}
				window.addEventListener('pointermove', onPointerMove)
				window.addEventListener('pointerup', onPointerUp)
				window.addEventListener('pointercancel', onPointerUp)
			}
		},
	}
}
