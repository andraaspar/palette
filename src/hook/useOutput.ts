import { useMemo } from 'react'
import { colorToHexString } from '../fun/colorToHexString'
import { join } from '../fun/join'
import { joinArrayWith } from '../fun/joinArrayWith'
import { joinWith } from '../fun/joinWith'
import { wrapColor } from '../fun/wrapColor'
import { OutputFormat } from '../model/OutputFomat'
import { IPalettesStore } from '../store/PalettesStore'

export function useOutput(
	palettesById: IPalettesStore['palettesById'],
	paletteOrder: IPalettesStore['paletteOrder'],
	outputFormat: OutputFormat,
	fileName: string,
): string {
	return useMemo((): string => {
		switch (outputFormat) {
			case OutputFormat.Gimp:
				return (
					joinWith('\n')(
						`GIMP Palette`,
						`Name: ${fileName}`,
						`#`,
						joinArrayWith('\n')(
							paletteOrder.map((paletteId, paletteIndex): string => {
								const palette = palettesById[paletteId]
								return joinArrayWith('\n')(
									palette.colors.map((color, index) => {
										const wrappedColor = wrapColor(color)
										return join(
											joinWith(' ')(
												Math.round(wrappedColor.red())
													.toString()
													.padStart(3, ' '),
												Math.round(wrappedColor.green())
													.toString()
													.padStart(3, ' '),
												Math.round(wrappedColor.blue())
													.toString()
													.padStart(3, ' '),
											),
											'\t',
											color.name ||
												join(
													palette.name || join(`Palette`, paletteIndex),
													`-`,
													index,
												),
										)
									}),
								)
							}),
						),
					) + '\n'
				)
			case OutputFormat.Synfig:
				return (
					joinWith('\n\n')(
						joinWith('\n')(`SYNFIGPAL1.0`, fileName),
						joinArrayWith('\n\n')(
							paletteOrder.map((paletteId, paletteIndex): string => {
								const palette = palettesById[paletteId]
								return joinArrayWith('\n\n')(
									palette.colors.map((color) => {
										const wrappedColor = wrapColor(color)
										return joinWith('\n')(
											wrappedColor.red() / 255,
											wrappedColor.green() / 255,
											wrappedColor.blue() / 255,
											wrappedColor.alpha(),
										)
									}),
								)
							}),
						),
					) + '\n'
				)
			case OutputFormat.Css:
				return (
					joinWith('\n')(
						`:root {`,
						joinArrayWith('\n\n')(
							paletteOrder.map((paletteId, paletteIndex): string => {
								const palette = palettesById[paletteId]
								return joinArrayWith('\n')(
									palette.colors.map((color, index): string =>
										join(
											`\t--`,
											color.name ||
												join(
													palette.name || join(`Palette`, paletteIndex),
													`-`,
													index,
												),
											`: `,
											colorToHexString(wrapColor(color)),
											`;`,
										),
									),
								)
							}),
						),
						`}`,
					) + '\n'
				)
			default:
				throw new Error(`[qjqvd9] Unknown OutputFormat: ${outputFormat}`)
		}
	}, [palettesById, paletteOrder, outputFormat, fileName])
}
