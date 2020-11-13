import { joinFilter } from './joinFilter'

export function joinArrayWith(joiner: string) {
	return (arr: any[]) => arr.filter(joinFilter).join(joiner)
}
