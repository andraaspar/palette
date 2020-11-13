export function easeInInterpolation(pow = 2) {
	return (t: number): number => {
		return Math.pow(t, pow)
	}
}
