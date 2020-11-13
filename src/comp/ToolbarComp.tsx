import { css } from '@emotion/css/macro'
import WrappedColor from 'color'
import { enumValues } from 'illa/EnumUtil'
import { get } from 'illa/FunctionUtil'
import React, { useMemo, useState } from 'react'
import { v4 } from 'uuid'
import { applyInterpolation } from '../fun/applyInterpolation'
import { colorToHexString } from '../fun/colorToHexString'
import { easeInInterpolation } from '../fun/easeInInterpolation'
import { easeInOutInterpolation } from '../fun/easeInOutInterpolation'
import { easeOutInterpolation } from '../fun/easeOutInterpolation'
import { getExtensionByOutputFormat } from '../fun/getExtensionByOutputFormat'
import { getNameByOutputFormat } from '../fun/getNameByOutputFormat'
import { linearInterpolation } from '../fun/linearInterpolation'
import { wrapColor } from '../fun/wrapColor'
import { useInput } from '../hook/useInput'
import { useOutput } from '../hook/useOutput'
import { BREAKPOINT } from '../model/constants'
import { OutputFormat } from '../model/OutputFomat'
import { PalettesStore } from '../store/PalettesStore'
import { UiStore } from '../store/UiStore'

export interface ToolbarCompProps {}

export function ToolbarComp(props: ToolbarCompProps) {
	const [$radioGroupId] = useState(() => v4())
	const { palettesById, paletteOrder, fileName } = PalettesStore.useState(
		(s) => ({
			palettesById: s.palettesById,
			paletteOrder: s.paletteOrder,
			fileName: s.fileName,
		}),
	)
	const {
		selectedPaletteId,
		selectedColorIndex,
		lastSelectedColorIndex,
		outputFormat,
		showAlpha,
		showHue,
		showLightness,
		showSaturation,
	} = UiStore.useState((s) => ({
		selectedPaletteId: s.selectedPaletteId,
		selectedColorIndex: s.selectedColorIndex,
		lastSelectedColorIndex: s.lastSelectedColorIndex,
		outputFormat: s.outputFormat,
		showAlpha: s.showAlpha,
		showHue: s.showHue,
		showLightness: s.showLightness,
		showSaturation: s.showSaturation,
	}))
	const palette = palettesById[selectedPaletteId]
	const color = palette?.colors?.[selectedColorIndex]
	const lastColor = palette?.colors?.[lastSelectedColorIndex]
	const wrappedColor = wrapColor(color)
	const hueInput = useInput({
		value: color?.hue ?? 0,
		setValue: (hue) => {
			PalettesStore.update((s) => {
				s.palettesById[selectedPaletteId].colors[selectedColorIndex].hue = hue
			})
		},
		valueFromString: hueFromString,
		valueToString: hueToString,
	})
	const saturationInput = useInput({
		value: color?.saturation ?? 0,
		setValue: (saturation) => {
			PalettesStore.update((s) => {
				s.palettesById[selectedPaletteId].colors[
					selectedColorIndex
				].saturation = saturation
			})
		},
		valueFromString: percentFromString,
		valueToString: percentToString,
	})
	const lightnessInput = useInput({
		value: color?.lightness ?? 0,
		setValue: (lightness) => {
			PalettesStore.update((s) => {
				s.palettesById[selectedPaletteId].colors[
					selectedColorIndex
				].lightness = lightness
			})
		},
		valueFromString: percentFromString,
		valueToString: percentToString,
	})
	const alphaInput = useInput({
		value: color?.alpha ?? 0,
		setValue: (alpha) => {
			PalettesStore.update((s) => {
				s.palettesById[selectedPaletteId].colors[
					selectedColorIndex
				].alpha = alpha
			})
		},
		valueFromString: percentFromString,
		valueToString: percentToString,
	})
	const redInput = useInput({
		value: wrappedColor.red(),
		setValue: (red) => {
			setRGBA(
				red,
				wrappedColor.green(),
				wrappedColor.blue(),
				wrappedColor.alpha(),
			)
		},
		valueFromString: rgbValueFromString,
		valueToString: numberToString,
	})
	const greenInput = useInput({
		value: wrappedColor.green(),
		setValue: (green) => {
			setRGBA(
				wrappedColor.red(),
				green,
				wrappedColor.blue(),
				wrappedColor.alpha(),
			)
		},
		valueFromString: rgbValueFromString,
		valueToString: numberToString,
	})
	const blueInput = useInput({
		value: wrappedColor.blue(),
		setValue: (blue) => {
			setRGBA(
				wrappedColor.red(),
				wrappedColor.green(),
				blue,
				wrappedColor.alpha(),
			)
		},
		valueFromString: rgbValueFromString,
		valueToString: numberToString,
	})
	const hexInput = useInput({
		value: colorToHexString(wrappedColor),
		setValue: (hex) => {
			const color = get(() => WrappedColor(hex)) ?? WrappedColor('black')
			setRGBA(color.red(), color.green(), color.blue(), color.alpha())
		},
		valueFromString: identity,
		valueToString: identity,
	})
	const output = useOutput(palettesById, paletteOrder, outputFormat, fileName)
	const outputHref = useMemo(() => {
		const file = new Blob([output], { type: 'text/plain' })
		return URL.createObjectURL(file)
	}, [output])
	return (
		<div className={toolbarCss}>
			<div className={labelWrapperCss}>
				<div className={labelCss}>File name:</div>
				<input
					className={inputCss}
					value={fileName ?? ''}
					onFocus={onFocusSelect}
					onChange={(e) => {
						PalettesStore.update((s) => {
							s.fileName = e.currentTarget.value
						})
					}}
				/>
			</div>
			<div className={labelWrapperCss}>
				{(enumValues(OutputFormat) as OutputFormat[]).map((anOutputFormat) => (
					<label key={anOutputFormat}>
						<input
							type='radio'
							radioGroup={$radioGroupId}
							value={anOutputFormat}
							checked={outputFormat === anOutputFormat}
							onChange={(e) => {
								UiStore.update((s) => {
									s.outputFormat = e.currentTarget.value as OutputFormat
								})
							}}
						/>{' '}
						{getNameByOutputFormat(anOutputFormat)}
					</label>
				))}
			</div>
			<textarea className={outputCss} disabled value={output} />
			<div className={buttonRowCss}>
				<button
					onClick={() => {
						navigator.clipboard.writeText(output)
					}}
				>
					Copy
				</button>
				<a
					href={outputHref}
					download={`${fileName}.${getExtensionByOutputFormat(outputFormat)}`}
				>
					Save
				</a>
			</div>
			<button
				onClick={() => {
					UiStore.update((s) => {
						s.background = !s.background
					})
				}}
			>
				Background
			</button>
			<button
				onClick={() => {
					let newSelectedPaletteId = ''
					PalettesStore.update((s) => {
						const id = (newSelectedPaletteId = v4())
						s.palettesById[id] = {
							id: id,
							name: '',
							colors: [
								{
									id: v4(),
									name: '',
									hue: 0,
									saturation: 0,
									lightness: 0.5,
									alpha: 1,
								},
							],
						}
						s.paletteOrder.push(id)
					})
					UiStore.update((s) => {
						s.selectedPaletteId = newSelectedPaletteId
						s.selectedColorIndex = 0
					})
				}}
			>
				New Palette
			</button>
			{palette && (
				<>
					<div className={labelWrapperCss}>
						<div className={labelCss}>Palette:</div>
						<input
							className={inputCss}
							value={palette?.name ?? ''}
							onFocus={onFocusSelect}
							onChange={(e) => {
								PalettesStore.update((s) => {
									s.palettesById[selectedPaletteId].name = e.currentTarget.value
								})
							}}
						/>
					</div>
					<button
						onClick={() => {
							if (window.confirm(`Delete palette?`)) {
								let index = -1
								let newSelectedPaletteId = ''
								let newSelectedColorIndex = -1
								PalettesStore.update((s) => {
									delete s.palettesById[selectedPaletteId]
									index = s.paletteOrder.indexOf(selectedPaletteId)
									if (index >= 0) {
										s.paletteOrder.splice(index, 1)
										newSelectedPaletteId =
											s.paletteOrder[index - 1] ?? s.paletteOrder[index] ?? ''
										const colors =
											s.palettesById[selectedPaletteId]?.colors ?? []
										newSelectedColorIndex = Math.max(
											0,
											Math.min(colors.length - 1, selectedColorIndex),
										)
									}
								})
								UiStore.update((s) => {
									if (index >= 0) {
										s.selectedPaletteId = newSelectedPaletteId
										s.selectedColorIndex = newSelectedColorIndex
									}
								})
							}
						}}
					>
						Delete Palette
					</button>
				</>
			)}
			{color && (
				<>
					<div className={labelWrapperCss}>
						<div className={labelCss}>Color:</div>
						<input
							className={inputCss}
							value={color?.name || selectedColorIndex}
							onFocus={onFocusSelect}
							onChange={(e) => {
								PalettesStore.update((s) => {
									s.palettesById[selectedPaletteId].colors[
										selectedColorIndex
									].name = e.currentTarget.value
								})
							}}
						/>
					</div>
					<div className={labelWrapperCss}>
						<div className={labelCss}>HSLA:</div>
						<input
							className={inputCss}
							value={hueInput.value}
							onFocus={hueInput.onFocus}
							onBlur={hueInput.onBlur}
							onChange={hueInput.onChange}
						/>
						<input
							className={inputCss}
							value={saturationInput.value}
							onFocus={saturationInput.onFocus}
							onBlur={saturationInput.onBlur}
							onChange={saturationInput.onChange}
						/>
						<input
							className={inputCss}
							value={lightnessInput.value}
							onFocus={lightnessInput.onFocus}
							onBlur={lightnessInput.onBlur}
							onChange={lightnessInput.onChange}
						/>
						<input
							className={inputCss}
							value={alphaInput.value}
							onFocus={alphaInput.onFocus}
							onBlur={alphaInput.onBlur}
							onChange={alphaInput.onChange}
						/>
					</div>
					<div className={labelWrapperCss}>
						<div className={labelCss}>RGBA:</div>
						<input
							className={inputCss}
							value={redInput.value}
							onFocus={redInput.onFocus}
							onBlur={redInput.onBlur}
							onChange={redInput.onChange}
						/>
						<input
							className={inputCss}
							value={greenInput.value}
							onFocus={greenInput.onFocus}
							onBlur={greenInput.onBlur}
							onChange={greenInput.onChange}
						/>
						<input
							className={inputCss}
							value={blueInput.value}
							onFocus={blueInput.onFocus}
							onBlur={blueInput.onBlur}
							onChange={blueInput.onChange}
						/>
						<input
							className={inputCss}
							value={alphaInput.value}
							onFocus={alphaInput.onFocus}
							onBlur={alphaInput.onBlur}
							onChange={alphaInput.onChange}
						/>
					</div>
					<div className={labelWrapperCss}>
						<div className={labelCss}>Hex:</div>
						<input
							className={inputCss}
							value={hexInput.value}
							onFocus={hexInput.onFocus}
							onBlur={hexInput.onBlur}
							onChange={hexInput.onChange}
						/>
					</div>
					<button
						onClick={() => {
							let newSelectedColorIndex = -1
							PalettesStore.update((s) => {
								const palette = s.palettesById[selectedPaletteId]
								palette.colors.splice(selectedColorIndex, 1)
								newSelectedColorIndex = Math.max(
									0,
									Math.min(palette.colors.length - 1, selectedColorIndex - 1),
								)
							})
							UiStore.update((s) => {
								s.selectedColorIndex = newSelectedColorIndex
							})
						}}
					>
						Delete Swatch
					</button>
					<div className={labelWrapperCss}>
						<label>
							<input
								type='checkbox'
								checked={showHue}
								onChange={(e) => {
									UiStore.update((s) => {
										s.showHue = e.currentTarget.checked
									})
								}}
							/>
							<br />
							Hue
						</label>{' '}
						<label>
							<input
								type='checkbox'
								checked={showSaturation}
								onChange={(e) => {
									UiStore.update((s) => {
										s.showSaturation = e.currentTarget.checked
									})
								}}
							/>
							<br />
							Saturation
						</label>{' '}
						<label>
							<input
								type='checkbox'
								checked={showLightness}
								onChange={(e) => {
									UiStore.update((s) => {
										s.showLightness = e.currentTarget.checked
									})
								}}
							/>
							<br />
							Lightness
						</label>{' '}
						<label>
							<input
								type='checkbox'
								checked={showAlpha}
								onChange={(e) => {
									UiStore.update((s) => {
										s.showAlpha = e.currentTarget.checked
									})
								}}
							/>
							<br />
							Alpha
						</label>
					</div>
					{lastColor && (
						<>
							<button
								onClick={() => {
									applyInterpolation(linearInterpolation)
								}}
							>
								Interpolate: Linear
							</button>
							<button
								onClick={() => {
									applyInterpolation(easeInInterpolation())
								}}
							>
								Interpolate: Ease In
							</button>
							<button
								onClick={() => {
									applyInterpolation(easeOutInterpolation())
								}}
							>
								Interpolate: Ease Out
							</button>
							<button
								onClick={() => {
									applyInterpolation(easeInOutInterpolation())
								}}
							>
								Interpolate: Ease In Out
							</button>
						</>
					)}
				</>
			)}
		</div>
	)
}

const toolbarCss = css({
	flex: '1 0 auto',
	display: 'flex',
	flexDirection: 'column',
	overflow: 'auto',
	width: '100%',
	gap: '5px',
	color: 'gray',
	fontSize: '10px',

	[`@media (min-width: ${BREAKPOINT})`]: {
		maxWidth: '300px',
		height: '100%',
	},
})

const labelWrapperCss = css({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	gap: '5px',

	'& > label': {
		flex: 'auto',
		textAlign: 'center',
	},
})

const labelCss = css({
	whiteSpace: 'nowrap',
})

const inputCss = css({
	width: '100%',
})

const outputCss = css({
	flex: 'none',
	width: '100%',
	resize: 'vertical',
})

const buttonRowCss = css({
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	gap: '5px',

	'& > button': {
		flex: 'auto',
	},
})

const format = new Intl.NumberFormat('en-US', { useGrouping: false })

function numberToString(v: number) {
	return isNaN(v) ? '' : format.format(v)
}

function rgbValueFromString(v: string): number {
	const value = parseFloat(v)
	return isNaN(value) ? 0 : value
}

function hueFromString(v: string): number {
	const value = parseFloat(v)
	return isNaN(value) ? 0 : value / 360
}

function hueToString(v: number): string {
	return numberToString(v * 360)
}

function percentFromString(v: string): number {
	const value = parseFloat(v)
	return isNaN(value) ? 0 : value / 100
}

function percentToString(v: number): string {
	return numberToString(v * 100)
}

function setRGBA(r: number, g: number, b: number, a: number) {
	const { selectedColorIndex, selectedPaletteId } = UiStore.getRawState()
	const newColor = WrappedColor.rgb(r, g, b).alpha(a)
	PalettesStore.update((s) => {
		const color = s.palettesById[selectedPaletteId].colors[selectedColorIndex]
		if (color) {
			color.hue = newColor.hue() / 360
			color.saturation = newColor.saturationl() / 100
			color.lightness = newColor.lightness() / 100
			color.alpha = newColor.alpha()
		}
	})
}

function identity<T>(v: T): T {
	return v
}

function onFocusSelect(e: React.FocusEvent<HTMLInputElement>) {
	e.currentTarget.setSelectionRange(0, e.currentTarget.value.length)
}
