import { joinFilter } from './joinFilter'

export function joinWith(joiner: string) {
	return (...arr: any[]) => arr.filter(joinFilter).join(joiner)
}
