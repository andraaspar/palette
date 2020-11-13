import { Store } from 'pullstate'
import { OutputFormat } from '../model/OutputFomat'

export interface IUiStore {
	background: boolean
	showHue: boolean
	showSaturation: boolean
	showLightness: boolean
	showAlpha: boolean
	selectedPaletteId: string
	selectedColorIndex: number
	lastSelectedColorIndex: number
	outputFormat: OutputFormat
}

export const UiStore = new Store<IUiStore>({
	background: false,
	showHue: true,
	showSaturation: true,
	showLightness: true,
	showAlpha: true,
	selectedPaletteId: '',
	selectedColorIndex: 0,
	lastSelectedColorIndex: 0,
	outputFormat: OutputFormat.Css,
})

UiStore.subscribe(
	(s) => s.selectedColorIndex,
	(selectedColorIndex, s, lastSelectedColorIndex) => {
		UiStore.update((s) => {
			s.lastSelectedColorIndex = lastSelectedColorIndex
		})
	},
)
