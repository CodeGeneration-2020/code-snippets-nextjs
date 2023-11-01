'use client'

import * as React from 'react'
import dayjs from 'dayjs'
import {
	usePathname,
	useRouter,
} from 'next/navigation'
import {
	useShallow,
} from 'use-shallow'
import {
	msToTimestringDuration,
} from '@/shared/utils/ms-to-timestring-duration.util'
import type {
	OpeningHours,
} from '@/app/services/booking/booking.types'
import {
	convertToPersonSentence,
} from '@/shared/utils/convert-to-person-sentence.util'

import BookingPicker from './booking-picker.component'
import CounterControl from './counter-control.component'
import CalendarDialog from './calendar-dialog.component'
import TimelistDialog from './timelist-dialog.component'

import type {
	CalendarDialogAdditionalProps,
	SearchParams,
	TimelistDialogAdditionalProps,
} from '../types'
import {
	updateCounterQueryParam,
} from '../utils/update-counter-search-param.util'
import {
	calculateCurrentTime,
} from '../utils/calculate-current-time.util'
import {
	setStartTime,
} from '../utils/set-start-time.util'
import {
	calculateDate,
} from '../utils/calculate-calendar-time.util'
import {
	setNewDate,
} from '../utils/set-new-date.util'

import {
	controlsList,
} from '../styles.module.scss'

type SetControlValues = {
	setIntervalMultiplier: React.Dispatch<React.SetStateAction<string>>
	setStartDate: React.Dispatch<React.SetStateAction<string>>
	setEndDate: React.Dispatch<React.SetStateAction<string>>
	setPersonsAmount: React.Dispatch<React.SetStateAction<string>>
}

type Props = {
	openingHours: Array<OpeningHours>
	bookingInterval: number
	personsSelect: boolean
	controlsValues: SearchParams
	setControlsValues: SetControlValues
	startDate: string
	timezone: string
}

const BookingControls: React.FunctionComponent<Props> = ({
	openingHours,
	bookingInterval,
	personsSelect,
	controlsValues,
	setControlsValues,
	startDate,
	timezone,
},) => {
	const pathname = usePathname()
	const router = useRouter()
	const [queries, push,] = useShallow()

	const currDay = openingHours.find((el,) => {
		return el.day === dayjs(startDate,).format('dddd',)
			.toUpperCase()
	},)

	const updateCounter = (
		paramName: string,
		incrementValue: number,
		setState: React.Dispatch<React.SetStateAction<string>>,
		state: string,
	): void => {
		updateCounterQueryParam({
			paramName,
			newValue:     incrementValue,
			searchParams: queries,
			pathname,
			push,
			setState,
			state,
		},)
	}

	return <ul className={controlsList}>
		<BookingPicker<CalendarDialogAdditionalProps>
			heading='Select a day'
			value={dayjs(controlsValues.startDate,).format('dddd DD MMMM',)}
			PopoverContent={CalendarDialog}
			additionalProps={{
				date:    calculateDate({
					date:         new Date(controlsValues.startDate,),
				},),
				setDate: setNewDate({
					searchParams:       queries,
					router,
					pathname,
					push,
					date:               new Date(controlsValues.startDate,),
					setDate:            setControlsValues.setStartDate,
					bookingInterval,
					setEndDate:         setControlsValues.setEndDate,
					intervalMultiplier: parseFloat(controlsValues.intervalMultiplier,),
					timezone,
				},),
			}}
			popoverOffset={1}
		/>

		<BookingPicker<TimelistDialogAdditionalProps>
			heading='Start with'
			value={calculateCurrentTime({
				date: new Date(controlsValues.startDate,),
				timezone,
			},).timestring}
			PopoverContent={TimelistDialog}
			additionalProps={{
				openingHours,
				bookingInterval,
				currOpeningHours:  currDay?.opening_at ?? 0,
				selectedStarttime: calculateCurrentTime({
					date: new Date(controlsValues.startDate,),
					timezone,
				},).timestring,
				setStarttime:      setStartTime({
					searchParams:       queries,
					pathname,
					push,
					date:               new Date(controlsValues.startDate,),
					setDate:            setControlsValues.setStartDate,
					bookingInterval,
					setEndDate:         setControlsValues.setEndDate,
					intervalMultiplier: parseFloat(controlsValues.intervalMultiplier,),
					timezone,
				},),
				startDate: calculateDate({
					date:         new Date(controlsValues.startDate,),
				},).toString(),
				timezone,
			}}
		/>

		<CounterControl
			plusAction={updateCounter(1)}
			minusAction={updateCounter(-1)}
			minusDisabled={((parseFloat(controlsValues.intervalMultiplier,) * bookingInterval) - bookingInterval) === 0}
			value={msToTimestringDuration(parseFloat(controlsValues.intervalMultiplier,) * bookingInterval,)}
		/>

		{personsSelect && <CounterControl
			plusAction={updateCounter(1)}
			minusAction={updateCounter(-1)}
			minusDisabled={parseFloat(controlsValues.personsAmount,) === 1}
			value={convertToPersonSentence(parseFloat(controlsValues.personsAmount,),)}
		/>}
	</ul>
}

export default BookingControls