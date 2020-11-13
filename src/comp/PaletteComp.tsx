import { css, cx } from '@emotion/css/macro'
import React from 'react'
import { v4 } from 'uuid'
import { normalizeValue } from '../fun/normalizeValue'
import { Palette } from '../model/Palette'
import { PalettesStore } from '../store/PalettesStore'
import { UiStore } from '../store/UiStore'
import { HandlesComp } from './HandlesComp'

export interface PaletteCompProps {
	_palette: Palette
	_isSelected: boolean
	_selectedColorIndex: number
	_lastSelectedColorIndex: number
}

export function PaletteComp(props: PaletteCompProps) {
	const count = props._palette.colors.length
	const percentSize = 100 / count
	function popOut(
		v1: number,
		v2: number,
		i1: number,
		i2: number,
		offset: number,
	) {
		if (v1 != null && v2 != null) {
			const diff = (v2 - v1) * 100
			if (
				(v1 < 0
					? v2 >= 0 || Math.ceil(v2) > Math.ceil(v1)
					: Math.floor(v2) > Math.floor(v1)) ||
				(v1 >= 0
					? v2 < 0 || Math.floor(v2) < Math.floor(v1)
					: Math.ceil(v2) < Math.ceil(v1))
			) {
				return `L ${(i2 + offset) * percentSize} ${
					100 - (normalizeValue(v1) * 100 + diff)
				} M ${(i1 + offset) * percentSize} ${
					100 - (normalizeValue(v2) * 100 - diff)
				}`
			}
		}
		return ''
	}
	const hueD = props._palette.colors
		.map(
			(color, index, arr) =>
				popOut(arr[index - 1]?.hue, color.hue, index - 1, index, 0.2) +
				(index === 0 ? 'M ' : 'L ') +
				(percentSize * index + percentSize * 0.2) +
				' ' +
				(100 - normalizeValue(color.hue) * 100),
		)
		.join(' ')
	const saturationD = props._palette.colors
		.map(
			(color, index, arr) =>
				(index === 0 ? 'M ' : 'L ') +
				(percentSize * index + percentSize * 0.4) +
				' ' +
				(100 - normalizeValue(color.saturation) * 100),
		)
		.join(' ')
	const lightnessD = props._palette.colors
		.map(
			(color, index, arr) =>
				(index === 0 ? 'M ' : 'L ') +
				(percentSize * index + percentSize * 0.6) +
				' ' +
				(100 - normalizeValue(color.lightness) * 100),
		)
		.join(' ')
	const alphaD = props._palette.colors
		.map(
			(color, index, arr) =>
				(index === 0 ? 'M ' : 'L ') +
				(percentSize * index + percentSize * 0.8) +
				' ' +
				(100 - normalizeValue(color.alpha) * 100),
		)
		.join(' ')
	const {
		showAlpha,
		showHue,
		showLightness,
		showSaturation,
	} = UiStore.useState((s) => ({
		showAlpha: s.showAlpha,
		showHue: s.showHue,
		showLightness: s.showLightness,
		showSaturation: s.showSaturation,
	}))
	return (
		<div className={paletteCss}>
			<div className={paletteColorsCss}>
				{props._palette.colors.map((color, index) => (
					<div
						key={color.id}
						className={cx(
							swatchCss,
							props._isSelected &&
								props._lastSelectedColorIndex === index &&
								swatchLastSelectedCss,
							props._isSelected &&
								props._selectedColorIndex === index &&
								swatchSelectedCss,
						)}
						style={{
							background: `hsla(${color.hue}turn, ${color.saturation * 100}%, ${
								color.lightness * 100
							}%, ${color.alpha * 100}%)`,
						}}
					/>
				))}
				<div className={paletteLinesWrapperCss}>
					<svg
						className={paletteLinesCss}
						viewBox={`0 0 100 100`}
						preserveAspectRatio='none'
					>
						{showHue && (
							<>
								<path className={backLineCss} d={hueD} />
								<path
									className={frontLineCss}
									style={{ stroke: 'red' }}
									d={hueD}
								/>
							</>
						)}
						{showSaturation && (
							<>
								<path className={backLineCss} d={saturationD} />
								<path
									className={frontLineCss}
									style={{ stroke: 'green' }}
									d={saturationD}
								/>
							</>
						)}
						{showLightness && (
							<>
								<path className={backLineCss} d={lightnessD} />
								<path
									className={frontLineCss}
									style={{ stroke: 'blue' }}
									d={lightnessD}
								/>
							</>
						)}
						{showAlpha && (
							<>
								<path className={backLineCss} d={alphaD} />
								<path className={frontLineCss} d={alphaD} />
							</>
						)}
					</svg>
				</div>
				<div className={paletteHandlesCss}>
					{props._palette.colors.map((color, index) => (
						<HandlesComp
							key={color.id}
							_palette={props._palette}
							_color={color}
							_index={index}
						/>
					))}
				</div>
			</div>
			<button
				className={addButtonCss}
				title='Add Swatch'
				onClick={() => {
					PalettesStore.update((s) => {
						const id = v4()
						const colors = s.palettesById[props._palette.id].colors
						const lastColor = colors[colors.length - 1]
						colors.push({
							id: id,
							name: '',
							hue: lastColor?.hue ?? 0,
							saturation: lastColor?.saturation ?? 0,
							lightness: lastColor?.lightness ?? 0.5,
							alpha: lastColor?.alpha ?? 1,
						})
					})
					UiStore.update((s) => {
						s.selectedPaletteId = props._palette.id
						s.selectedColorIndex = count
					})
				}}
			>
				+
			</button>
		</div>
	)
}

const paletteCss = css({
	flex: 'auto',
	display: 'flex',
	width: '100%',
	height: '100%',
})

const paletteColorsCss = css({
	flex: 'auto',
	display: 'flex',
	width: '100%',
	height: '100%',
	position: 'relative',
})

const paletteLinesWrapperCss = css({
	position: 'absolute',
	top: `8px`,
	left: 0,
	bottom: `8px`,
	right: 0,
})

const paletteLinesCss = css({
	width: `100%`,
	height: `100%`,
	fill: 'transparent',
})

const backLineCss = css({
	stroke: 'white',
	strokeWidth: 3,
	vectorEffect: 'non-scaling-stroke',
})

const frontLineCss = css({
	stroke: 'black',
	strokeWidth: 1,
	vectorEffect: 'non-scaling-stroke',
})

const paletteHandlesCss = css({
	position: 'absolute',
	top: 0,
	bottom: 0,
	left: 0,
	right: 0,
	display: 'flex',
})

const swatchCss = css({
	flex: 1,
	overflow: 'hidden',
	width: '100%',
	height: '100%',
	position: 'relative',
})

const swatchLastSelectedCss = css({
	'&::before': {
		content: '""',
		position: 'absolute',
		bottom: `6px`,
		left: `6px`,
		width: `4px`,
		height: `4px`,
		background: 'white',
		border: `1px solid black`,
		borderRadius: `2px`,
		opacity: 0.4,
	},
})

const swatchSelectedCss = css({
	'&::before': {
		content: '""',
		position: 'absolute',
		bottom: `4px`,
		left: `4px`,
		width: `8px`,
		height: `8px`,
		background: 'white',
		border: `1px solid black`,
		borderRadius: `4px`,
	},
})

const addButtonCss = css({
	flex: 'none',
	overflow: 'hidden',
	height: '100%',
})
