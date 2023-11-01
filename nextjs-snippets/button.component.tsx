import * as React from 'react'
import {
	match,
} from 'ts-pattern'

import TextBtn from './components/text-btn.component'
import IconBtn from './components/icon-btn.component'

import {
	ButtonType,
} from './button.types'
import type {
	IconButtonProps, 
        PossibleBtnProps,
	TextBtnProps,
} from './button.types'

type ButtonProps<T extends ButtonType> = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
	loading?: boolean
	additionalProps: T extends ButtonType.TEXT
		? TextBtnProps<T>
		: T extends ButtonType.ICON
		? IconButtonProps<T>
		: never
}

const Button = <T extends ButtonType,>({
	loading,
	additionalProps,
	...buttonAttributes
}: ButtonProps<T>,): React.ReactElement => {
	const isLoading = Boolean(loading,)
	const isDisabled = isLoading || Boolean(buttonAttributes.disabled,)

	const baseProps = {
		isDisabled,
		isLoading,
		...buttonAttributes,
	}

	return match<PossibleBtnProps<ButtonType>>(additionalProps,)
		.with({
			btnType: ButtonType.TEXT,
		}, (props,) => {
			return <TextBtn
				{...baseProps}
				{...props}
			/>
		},)
		.with({
			btnType: ButtonType.ICON,
		}, (props,) => {
			return <IconBtn
				{...baseProps}
				{...props}
			/>
		},)
		.run()
}

export default Button