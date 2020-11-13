import { OutputFormat } from '../model/OutputFomat'

export function getExtensionByOutputFormat(f: OutputFormat) {
	switch (f) {
		case OutputFormat.Css:
			return 'css'
		case OutputFormat.Gimp:
			return 'gpl'
		case OutputFormat.Synfig:
			return 'spal'
		default:
			throw new Error(`[qjqy53] Unknown OutputFormat: ${f}`)
	}
}
