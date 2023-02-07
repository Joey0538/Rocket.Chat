import type { SelectOption } from '@rocket.chat/fuselage';
import { Box, Field, TextInput, ToggleSwitch, Select, TextAreaInput } from '@rocket.chat/fuselage';
import { useTranslation } from '@rocket.chat/ui-contexts';
import type { ComponentProps, FC, FormEvent } from 'react';
import React, { useMemo, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { useComponentDidUpdate } from '../../../hooks/useComponentDidUpdate';

type TriggerConditions = {
	name: string;
	value: string | number;
};

type TriggerActions = {
	name: string;
	params: {
		sender: string | undefined;
		msg: string;
		name: string;
	};
};

type TriggersFormProps = {
	values: {
		name: string;
		description: string;
		enabled: boolean;
		runOnce: boolean;
		// In the future, this will be an array
		conditions: TriggerConditions;
		// In the future, this will be an array
		actions: TriggerActions;
	};
	handlers: {
		handleName: (event: FormEvent<HTMLInputElement>) => void;
		handleDescription: (event: FormEvent<HTMLInputElement>) => void;
		handleEnabled: (event: FormEvent<HTMLInputElement>) => void;
		handleRunOnce: (event: FormEvent<HTMLInputElement>) => void;
		handleConditions: (value: TriggerConditions) => void;
		handleActions: (value: TriggerActions) => void;
	};
	className?: ComponentProps<typeof Field>['className'];
};

const TriggersForm: FC<TriggersFormProps> = ({ values, className }) => {
	const { register, control } = useFormContext();

	const {
		field: { onChange: handleEnabled, value: valueEnabled },
	} = useController({
		name: 'enabled',
		control,
	});
	const {
		field: { onChange: handleRunOnce, value: valueRunOnce },
	} = useController({
		name: 'runOnce',
		control,
	});
	const {
		field: { onChange: handleActionSender, value: valueActionSender },
	} = useController({
		name: 'actions.params.sender',
		control,
	});
	const {
		field: { onChange: handleConditionName, value: valueConditionName },
	} = useController({
		name: 'conditions.name',
		control,
	});

	const [nameError, setNameError] = useState('');
	const [msgError, setMsgError] = useState('');
	const t = useTranslation();
	const { name, conditions, actions } = values;

	// const { /* handleName, handleDescription,*/ handleEnabled, handleRunOnce, handleConditions, handleActions } = handlers;

	const { name: conditionName } = conditions;

	const {
		params: { sender: actionSender, msg: actionMsg },
	} = actions;

	const conditionOptions: SelectOption[] = useMemo(
		() => [
			['page-url', t('Visitor_page_URL')],
			['time-on-site', t('Visitor_time_on_site')],
			['chat-opened-by-visitor', t('Chat_opened_by_visitor')],
		],
		[t],
	);

	const conditionValuePlaceholders: { [conditionName: string]: string } = useMemo(
		() => ({
			'page-url': t('Enter_a_regex'),
			'time-on-site': t('Time_in_seconds'),
		}),
		[t],
	);

	const conditionValuePlaceholder = conditionValuePlaceholders[conditionName];

	const senderOptions: SelectOption[] = useMemo(
		() => [
			['queue', t('Impersonate_next_agent_from_queue')],
			['custom', t('Custom_agent')],
		],
		[t],
	);

	// const handleConditionName = useMutableCallback((name) => {
	// 	handleConditions({
	// 		name,
	// 		value: '',
	// 	});
	// });

	// const handleConditionValue = useMutableCallback(({ currentTarget: { value } }) => {
	// 	handleConditions({
	// 		...conditions,
	// 		value,
	// 	});
	// });

	// const handleActionAgentName = useMutableCallback(({ currentTarget: { value: name } }) => {
	// 	handleActions({
	// 		...actions,
	// 		params: {
	// 			...actions.params,
	// 			name,
	// 		},
	// 	});
	// });

	// const handleActionSender = useMutableCallback((sender) => {
	// 	handleActions({
	// 		...actions,
	// 		params: {
	// 			...actions.params,
	// 			sender,
	// 		},
	// 	});
	// });

	// const handleActionMessage = useMutableCallback(({ currentTarget: { value: msg } }) => {
	// 	handleActions({
	// 		...actions,
	// 		params: {
	// 			...actions.params,
	// 			msg,
	// 		},
	// 	});
	// });
	useComponentDidUpdate(() => {
		setNameError(!name ? t('The_field_is_required', t('Name')) : '');
	}, [t, name]);
	useComponentDidUpdate(() => {
		setMsgError(!actionMsg ? t('The_field_is_required', t('Message')) : '');
	}, [t, actionMsg]);
	return (
		<>
			<Field className={className}>
				<Box display='flex' flexDirection='row'>
					<Field.Label>{t('Enabled')}</Field.Label>
					<Field.Row>
						<ToggleSwitch checked={valueEnabled} onChange={handleEnabled} />
					</Field.Row>
				</Box>
			</Field>
			<Field className={className}>
				<Box display='flex' flexDirection='row'>
					<Field.Label>{t('Run_only_once_for_each_visitor')}</Field.Label>
					<Field.Row>
						<ToggleSwitch checked={valueRunOnce} onChange={handleRunOnce} />
					</Field.Row>
				</Box>
			</Field>
			<Field className={className}>
				<Field.Label>{t('Name')}*</Field.Label>
				<Field.Row>
					<TextInput {...register('name')} error={nameError} placeholder={t('Name')} />
				</Field.Row>
				<Field.Error>{nameError}</Field.Error>
			</Field>
			<Field className={className}>
				<Field.Label>{t('Description')}</Field.Label>
				<Field.Row>
					<TextInput {...register('description')} placeholder={t('Description')} />
				</Field.Row>
			</Field>
			<Field className={className}>
				<Field.Label>{t('Condition')}</Field.Label>
				<Field.Row>
					<Select options={conditionOptions} value={valueConditionName} onChange={handleConditionName} />
				</Field.Row>
				{conditionValuePlaceholder && (
					<Field.Row>
						<TextInput {...register('conditions.value')} placeholder={conditionValuePlaceholder} />
					</Field.Row>
				)}
			</Field>
			<Field className={className}>
				<Field.Label>{t('Action')}</Field.Label>
				<Field.Row>
					<TextInput {...register(`${t('Send_a_message')}`)} disabled />
				</Field.Row>
				<Field.Row>
					<Select options={senderOptions} value={valueActionSender} onChange={handleActionSender} placeholder={t('Select_an_option')} />
				</Field.Row>
				{actionSender === 'custom' && (
					<Field.Row>
						<TextInput {...register('actions.params.actionAgentName')} placeholder={t('Name_of_agent')} />
					</Field.Row>
				)}
				<Field.Row>
					<TextAreaInput rows={3} {...register('actions.params.msg')} placeholder={`${t('Message')}*`} />
				</Field.Row>
				<Field.Error>{msgError}</Field.Error>
			</Field>
		</>
	);
};

export default TriggersForm;
