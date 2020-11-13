export function easeInOutInterpolation(pow = 2) {
	return (t: number): number => {
		if ((t *= 2) < 1) return 0.5 * Math.pow(t, pow)
		return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow))
	}
}
