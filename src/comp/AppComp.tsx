import { css } from '@emotion/css/macro'
import React from 'react'
import { BREAKPOINT } from '../model/constants'
import { UiStore } from '../store/UiStore'
import { PalettesComp } from './PalettesComp'
import { ToolbarComp } from './ToolbarComp'

export interface AppCompProps {}

export function AppComp(props: AppCompProps) {
	const background = UiStore.useState((s) => s.background)
	return (
		<div
			className={appCss}
			style={{ background: background ? 'white' : 'black' }}
		>
			<PalettesComp />
			<ToolbarComp />
		</div>
	)
}

const appCss = css({
	display: 'flex',
	width: '100%',
	height: '100%',
	flexDirection: 'column',
	overflow: 'auto',
	background: 'black',
	padding: '5px',
	gap: '5px',
	[`@media (min-width: ${BREAKPOINT})`]: {
		flexDirection: 'row',
		padding: '20px',
		gap: '20px',
	},
})
