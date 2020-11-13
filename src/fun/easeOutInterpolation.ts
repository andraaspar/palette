export function easeOutInterpolation(pow = 2) {
	return (t: number): number => {
		return 1 - Math.pow(1 - t, pow)
	}
}
