import { joinFilter } from './joinFilter'

export function joinArray(arr: any[]) {
	return arr.filter(joinFilter).join('')
}
