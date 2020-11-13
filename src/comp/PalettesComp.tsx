import { css } from '@emotion/css/macro'
import React from 'react'
import { BREAKPOINT } from '../model/constants'
import { PalettesStore } from '../store/PalettesStore'
import { UiStore } from '../store/UiStore'
import { PaletteComp } from './PaletteComp'

export interface PalettesCompProps {}

export function PalettesComp(props: PalettesCompProps) {
	const { paletteOrder, palettesById } = PalettesStore.useState((s) => ({
		paletteOrder: s.paletteOrder,
		palettesById: s.palettesById,
	}))
	const {
		selectedPaletteId,
		selectedColorIndex,
		lastSelectedColorIndex,
	} = UiStore.useState((s) => ({
		selectedPaletteId: s.selectedPaletteId,
		selectedColorIndex: s.selectedColorIndex,
		lastSelectedColorIndex: s.lastSelectedColorIndex,
	}))
	return (
		<div className={palettesCss}>
			{paletteOrder.map((paletteId, paletteIndex) => (
				<PaletteComp
					key={paletteId}
					_palette={palettesById[paletteId]}
					_isSelected={selectedPaletteId === paletteId}
					_selectedColorIndex={selectedColorIndex}
					_lastSelectedColorIndex={lastSelectedColorIndex}
				/>
			))}
		</div>
	)
}

const palettesCss = css({
	flex: 'none',
	display: 'flex',
	flexDirection: 'column',
	overflow: 'auto',
	width: '100%',
	height: '100%',

	[`@media (min-width: ${BREAKPOINT})`]: {
		flex: 'auto',
	},
})
