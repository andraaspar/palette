import { PalettesStore } from '../store/PalettesStore'
import { UiStore } from '../store/UiStore'

export function applyInterpolation(interpolation: (t: number) => number) {
	const {
		selectedPaletteId,
		selectedColorIndex,
		lastSelectedColorIndex,
	} = UiStore.getRawState()
	PalettesStore.update((s) => {
		const palette = s.palettesById[selectedPaletteId]
		if (!palette) return
		const i1 = Math.min(selectedColorIndex, lastSelectedColorIndex)
		const i2 = Math.max(selectedColorIndex, lastSelectedColorIndex)
		const c1 = palette.colors[i1]
		const c2 = palette.colors[i2]
		if (!c1 || !c2) return
		const {
			showHue,
			showSaturation,
			showLightness,
			showAlpha,
		} = UiStore.getRawState()
		const steps = i2 - i1 - 1
		for (let i = 1; i <= steps; i++) {
			const t = interpolation(i / (steps + 1))
			const c = palette.colors[i1 + i]
			if (showHue) {
				c.hue = c1.hue + (c2.hue - c1.hue) * t
			}
			if (showSaturation) {
				c.saturation = c1.saturation + (c2.saturation - c1.saturation) * t
			}
			if (showLightness) {
				c.lightness = c1.lightness + (c2.lightness - c1.lightness) * t
			}
			if (showAlpha) {
				c.alpha = c1.alpha + (c2.alpha - c1.alpha) * t
			}
		}
	})
}
