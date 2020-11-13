import { css, cx } from '@emotion/css/macro'
import React from 'react'
import { normalizeValue } from '../fun/normalizeValue'
import { useHandle } from '../hook/useHandle'
import { Color } from '../model/Color'
import { Palette } from '../model/Palette'
import { PalettesStore } from '../store/PalettesStore'
import { UiStore } from '../store/UiStore'

export interface HandlesCompProps {
	_palette: Palette
	_color: Color
	_index: number
}

export function HandlesComp(props: HandlesCompProps) {
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
	const hueHandle = useHandle({
		value: props._color.hue,
		setValue: (hue) => {
			PalettesStore.update((s) => {
				s.palettesById[props._palette.id].colors[props._index].hue = hue
			})
		},
		clamp: false,
	})
	const saturationHandle = useHandle({
		value: props._color.saturation,
		setValue: (saturation) => {
			PalettesStore.update((s) => {
				s.palettesById[props._palette.id].colors[
					props._index
				].saturation = saturation
			})
		},
		clamp: true,
	})
	const lightnessHandle = useHandle({
		value: props._color.lightness,
		setValue: (lightness) => {
			PalettesStore.update((s) => {
				s.palettesById[props._palette.id].colors[
					props._index
				].lightness = lightness
			})
		},
		clamp: true,
	})
	const alphaHandle = useHandle({
		value: props._color.alpha,
		setValue: (alpha) => {
			PalettesStore.update((s) => {
				s.palettesById[props._palette.id].colors[props._index].alpha = alpha
			})
		},
		clamp: true,
	})
	return (
		<div
			className={handlesCss}
			onPointerUp={() => {
				UiStore.update((s) => {
					s.selectedPaletteId = props._palette.id
					s.selectedColorIndex = props._index
				})
			}}
		>
			{showHue && (
				<div
					className={hueCss}
					style={{
						top: `calc(100% - 8px - (100% - 16px) * ${normalizeValue(
							props._color.hue,
						)})`,
					}}
					onPointerDown={hueHandle.onPointerDown}
				>
					H
				</div>
			)}
			{showSaturation && (
				<div
					className={saturationCss}
					style={{
						top: `calc(100% - 8px - (100% - 16px) * ${normalizeValue(
							props._color.saturation,
						)})`,
					}}
					onPointerDown={saturationHandle.onPointerDown}
				>
					S
				</div>
			)}
			{showLightness && (
				<div
					className={lightnessCss}
					style={{
						top: `calc(100% - 8px - (100% - 16px) * ${normalizeValue(
							props._color.lightness,
						)})`,
					}}
					onPointerDown={lightnessHandle.onPointerDown}
				>
					L
				</div>
			)}
			{showAlpha && (
				<div
					className={alphaCss}
					style={{
						top: `calc(100% - 8px - (100% - 16px) * ${normalizeValue(
							props._color.alpha,
						)})`,
					}}
					onPointerDown={alphaHandle.onPointerDown}
				>
					A
				</div>
			)}
		</div>
	)
}

const handlesCss = css({
	flex: 1,
	overflow: 'hidden',
	width: '100%',
	height: '100%',
	position: 'relative',
})

const controlCss = css({
	position: 'absolute',
	top: 0,
	width: '16px',
	height: '16px',
	border: `1px solid white`,
	borderRadius: `8px`,
	textAlign: 'center',
	fontSize: '8px',
	lineHeight: '8px',
	padding: '3px 0',
	overflow: 'hidden',
	color: 'white',
	transform: `translate(-8px, -8px)`,
	userSelect: 'none',
	cursor: 'pointer',
})

const hueCss = cx(
	controlCss,
	css({
		left: '20%',
		background: 'red',
	}),
)

const saturationCss = cx(
	controlCss,
	css({
		left: '40%',
		background: 'green',
	}),
)

const lightnessCss = cx(
	controlCss,
	css({
		left: '60%',
		background: 'blue',
	}),
)

const alphaCss = cx(
	controlCss,
	css({
		left: '80%',
		background: 'black',
	}),
)
