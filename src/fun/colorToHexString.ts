import Color from 'color'

export function colorToHexString(c: Color) {
	if (c.alpha() === 1) {
		return c.hex()
	} else {
		return (
			c.hex() +
			Math.round(c.alpha() * 255)
				.toString(16)
				.toUpperCase()
				.padStart(2, '0')
		)
	}
}
