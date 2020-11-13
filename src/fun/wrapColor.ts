import WrappedColor from 'color'
import { Color } from '../model/Color'

export function wrapColor(color: Color | null | undefined): WrappedColor {
	return WrappedColor.hsl(
		(color?.hue ?? 0) * 360,
		(color?.saturation ?? 0) * 100,
		(color?.lightness ?? 0) * 100,
	).alpha(color?.alpha ?? 0)
}
