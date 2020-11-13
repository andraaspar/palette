import { get } from 'illa/FunctionUtil'
import { jsonFromUri, jsonToUri } from 'illa/JsonUtil'
import { withInterface } from 'illa/Type'
import { Store } from 'pullstate'
import { v4 } from 'uuid'
import { Color } from '../model/Color'
import { Palette } from '../model/Palette'

export interface IPalettesStore {
	palettesById: Record<string, Palette>
	paletteOrder: string[]
	fileName: string
}

export const PalettesStore = new Store<IPalettesStore>(
	get(() => jsonFromUri(window.location.hash.slice(1))) ??
		(() => {
			const id = v4()
			return withInterface<IPalettesStore>({
				palettesById: {
					[id]: withInterface<Palette>({
						id: id,
						name: '',
						colors: [
							withInterface<Color>({
								id: v4(),
								name: '',
								hue: 0,
								saturation: 0.5,
								lightness: 0.5,
								alpha: 1,
							}),
						],
					}),
				},
				paletteOrder: [id],
				fileName: 'Palettes',
			})
		})(),
)

PalettesStore.subscribe(
	(s) => s,
	(s) => {
		window.location.hash = '#' + jsonToUri(s)
	},
)

window.addEventListener('hashchange', (e) => {
	PalettesStore.update(() => jsonFromUri(window.location.hash.slice(1)))
})
