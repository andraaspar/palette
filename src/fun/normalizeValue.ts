export function normalizeValue(v: number) {
	if (v === 0) return v
	v %= 1
	if (v < 0) v++
	return v || 1
}
