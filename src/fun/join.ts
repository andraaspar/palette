import { joinFilter } from './joinFilter'

export function join(...rest: any[]) {
	return rest.filter(joinFilter).join('')
}
