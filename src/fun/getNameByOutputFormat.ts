import { OutputFormat } from '../model/OutputFomat'

export function getNameByOutputFormat(f: OutputFormat) {
	switch (f) {
		case OutputFormat.Css:
			return 'CSS'
		case OutputFormat.Gimp:
			return 'Gimp'
		case OutputFormat.Synfig:
			return 'Synfig'
		default:
			throw new Error(`[qjqy86] Unknown OutputFormat: ${f}`)
	}
}
