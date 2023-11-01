import * as React from 'react'
import {
	notFound,
} from 'next/navigation'
import type {
	Metadata,
} from 'next'

import {
	paymentsService,
} from '@/app/services/payments/payments.service'
import {
	formMetadata,
} from '@/shared/utils/form-metadata.util'

import Banner from './components/banner.component'
import {
	fetchTempBooking,
} from './utils/get-temp-booking-details.util'
import {
	calculatePrice,
} from './utils/calculate-price.util'
import BookingFormWrapper from './components/booking-form-wrapper.component'

import {
	wrapper,
} from './styles.module.scss'

export const metadata: Metadata = formMetadata({
	title:       'Sing Pods / Book',
	description: 'Book a pod',
},)

type Props = {
	params: {
		tempBookingId: string
	}
}

const Book: React.FunctionComponent<Props> = async({
	params,
},) => {
	const tempBooking = await fetchTempBooking(params.tempBookingId,)

	const stripePublishableKey = await paymentsService.getStripePublishableKey()

	if (!tempBooking) {
		notFound()
	}

	const price = calculatePrice({
		bookingInterval:  tempBooking.location.booking_interval,
		priceForInterval: tempBooking.location.price_for_interval_in_gbp,
		priceForPerson:   tempBooking.location.price_for_person_in_gbp,
		personsAmount:    tempBooking.persons_amount,
		startDate:        tempBooking.start_date,
		endDate:          tempBooking.end_date,
	},)

	return (
		<div className={wrapper}>
			<Banner
				locationName={tempBooking.location.name}
				locationAddress={tempBooking.location.location}
				podName={tempBooking.pod.name}
				locationLogo={tempBooking.location.logo ?? ''}
				startDate={tempBooking.start_date}
				endDate={tempBooking.end_date}
				personsAmount={tempBooking.persons_amount}
				timezone={tempBooking.location.timezone}
			/>

			<BookingFormWrapper
				tempBookingId={tempBooking.id}
				stripePublishableKey={stripePublishableKey}
				price={price}
				podId={tempBooking.pod_id}
				startDate={tempBooking.start_date}
				endDate={tempBooking.end_date}
			/>
		</div>
	)
}

export default Book