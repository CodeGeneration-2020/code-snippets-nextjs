'use client'

import * as React from 'react'
import {
	Button,
	DialogTrigger,
	Popover,
} from 'react-aria-components'
import classNames from 'classnames'
import {
	match,
} from 'ts-pattern'

import type {
	Positions,
} from '@/shared/types/types'

import {
	bookingPicker,
	bookingPickerActive,
	bookingPickerContent,
	bookingPickerHeader,
	pickerBottomPlacement,
	pickerTopPlacement,
	popover,
} from '../styles.module.scss'

type Props<T> = {
	heading: string
	value: string
	PopoverContent: React.FunctionComponent<T & {
		setPlacement: (pos: Positions | null) => void
		placement: Positions
		width?: number
	}>
	additionalProps: T
	popoverOffset?: number
}

function BookingPicker<T>({
	heading,
	value,
	PopoverContent,
	additionalProps,
	popoverOffset = 0,
}: Props<T>,): React.ReactElement {
	const [selectedValue, setSelectedValue,] = React.useState('',)
	const [popoverPlacement, setPopovertPlacement,] = React.useState<Positions | null>(null,)

	React.useEffect(() => {
		setSelectedValue(value,)
	}, [value,],)

	const buttonRef = React.useRef<HTMLButtonElement>(null,)

	const setPlacement = (pos: Positions | null,): void => {
		setPopovertPlacement(pos,)
	}

	const placementClass = (): string | null => {
		return match(popoverPlacement,)
			.with('bottom', () => {
				return pickerBottomPlacement
			},)
			.with('top', () => {
				return pickerTopPlacement
			},)
			.otherwise(() => {
				return null
			},)
	}

	return <DialogTrigger>
		<Button
			ref={buttonRef}
			className={classNames(bookingPicker, {
				[placementClass() ?? '']: Boolean(popoverPlacement,),
				[bookingPickerActive]:    Boolean(popoverPlacement,),
			},)}
		>
			<div>
				<p className={bookingPickerHeader}>{heading}</p>
				<p className={bookingPickerContent}>{selectedValue}</p>
			</div>
		</Button>

		<Popover
			placement='bottom right'
			crossOffset={popoverOffset}
			className={popover}
			children={(props,): React.ReactNode => {
				return <PopoverContent
					placement={props.placement}
					setPlacement={setPlacement}
					width={buttonRef.current?.offsetWidth}
					{...additionalProps}
				/>
			}}/>
	</DialogTrigger>
}

export default BookingPicker