'use client'

import {
	Calendar as ReactAriaCalendar,
} from 'react-aria-components'

import * as React from 'react'
import classNames from 'classnames'
import type {
	CalendarDate,
} from '@internationalized/date'
import {
	getLocalTimeZone, today,
} from '@internationalized/date'

import Header from './components/header.component'
import Grid from './components/grid.component'

import {
	wrapper,
} from './styles.module.scss'

type Props = {
    date: CalendarDate
	wrapperClass?: string
	handleDateChange: (value: CalendarDate) => void
}

const Calendar: React.FunctionComponent<Props> = ({
	date,
	wrapperClass,
	handleDateChange,
},) => {
	return <div className={classNames(wrapper, {
		[wrapperClass ?? '']: Boolean(wrapperClass,),
	},)}>
		<ReactAriaCalendar
			minValue={today(getLocalTimeZone(),)}
			aria-label='Appointment date'
			value={date}
			onChange={handleDateChange}
		>
			<Header />

			<Grid />
		</ReactAriaCalendar>
	</div>
}

export default Calendar