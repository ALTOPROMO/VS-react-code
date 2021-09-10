import React from "react";
import {Alert, Button, Col, ControlLabel, FormGroup, Glyphicon, Row} from "react-bootstrap";
import FrontendRequestList from "./FrontendRequestList";
import Config from "../../Config";
import moment from "moment";
import PhoneField from "../form/PhoneField";
import ErrorsList from "../ErrorsList";
import FrontendRequestAction from "../../actions/FrontendRequestAction";
import FrontendRequestStore from "../../stores/FrontendRequestStore";
import DatePickerTz from "../form/DatePickerTz";

/**
 * Все заявки
 *
 * @property {boolean}                              state.isLoading         Идёт загрузка
 * @property {Map<number, FrontendRequestDto>|null} state.items             Уведомления
 * @property {string[]}                             state.errors            Список ошибок
 */
export default class FrontendRequestListContainer extends React.PureComponent {
	constructor(props) {
		super(props);

		const dateTimeFrom = (new moment()).hours(0).minutes(0).seconds(0).milliseconds(0);
		dateTimeFrom.utcOffset(Config.localTimezoneOffset);

		this.state = {
			isLoading:    true,
			dateTimeFrom: dateTimeFrom,
			phoneNumber:  '',
			requestText:  '',
			items:        null,
			errors:       [],
		};
		FrontendRequestAction.list(this.getListRequest());

		this.onDateFromPickerChange = this.onDateFromPickerChange.bind(this);
		this.onPhoneNumberChange    = this.onPhoneNumberChange.bind(this);
		this.onRequestTextChange    = this.onRequestTextChange.bind(this);
		this.onLoad                 = this.onLoad.bind(this);
		this.onUpdateBtnClick       = this.onUpdateBtnClick.bind(this);
	}

	/**
	 * @return {FrontendRequestListRequest}
	 */
	getListRequest() {
		/** @type {FrontendRequestListRequest} */
		return {
			dateTimeFrom: this.state.dateTimeFrom.toISOString(),
			phoneNumber:  this.state.phoneNumber,
			requestText:  this.state.requestText,
		};
	}

	/**
	 * @inheritdoc
	 */
	componentDidMount() {
		FrontendRequestStore.addFilteredListener(this.onLoad);
	}

	/**
	 * @inheritdoc
	 */
	componentWillUnmount() {
		FrontendRequestStore.removeFilteredListener(this.onLoad);
	}

	/**
	 * Обработка изменения поля даты для даты начала периода.
	 *
	 * @param {Date} date Дата
	 */
	onDateFromPickerChange(date){
		this.setState({dateTimeFrom: new moment(date)});
	}

    /**
	 * Обработка изменения поля номера телефона.
	 *
	 * @param {Object} EventSource Событие при изменении поля с телефоном
	 */
    onPhoneNumberChange(evt) {
		this.setState({phoneNumber: evt.target.value});
	}

    /**
	 * Обработка изменения поля текста заявки.
	 *
	 * @param {Object} EventSource Событие при изменении поля с текстом заявки
	 */
	onRequestTextChange(evt) {
		this.setState({requestText: evt.target.value});
	}

	/**
	 * @param {AjaxResponse} result
	 */
	onLoad(result) {
		const newState = {
			isLoading: false,
			items: 	   [],
			errors:    [],
		};
		if (result.isSuccess) {
			const newMap = new Map();

			result.data.forEach(/** @param {FrontendRequestDto} frontendRequest */(frontendRequest) => {
				newMap.set(frontendRequest.id, frontendRequest);
			});

			newState.items = newMap;
		}
		else {
			newState.errors = result.errors;
		}

		this.setState(newState);
	}

	onUpdateBtnClick() {
		FrontendRequestAction.list(this.getListRequest());
		this.setState({isLoading: true});
	}

	render() {
		return <div className="frontendRequests">
			<h1>Заявки</h1>
			<ErrorsList errors={this.state.errors}/>
				<Row>
                    <Col md={3}>
                        <ControlLabel>Дата</ControlLabel>

                        <FormGroup>
                            <ControlLabel>От</ControlLabel>
                            <DatePickerTz selected={this.state.dateTimeFrom}
                                        dropdownMode="select"
                                        onChange={this.onDateFromPickerChange}
                                        dateFormat="dd.MM.yyyy"
                                        maxDate={this.state.dateTimeTo}
                            />
                        </FormGroup>

                    </Col>

                    <Col md={3}>
                        <FormGroup>
                            <ControlLabel>Номер телефона</ControlLabel>

                            <PhoneField
                                name="phoneNumber"
                                onChange={this.onPhoneNumberChange}
                            />
                        </FormGroup>
                    </Col>

                    <Col md={3}>
                        <FormGroup>
                            <ControlLabel>Текст заявки</ControlLabel>

                            <input
                                name="requestText"
                                type="text"
								onChange={this.onRequestTextChange}
                            />
                        </FormGroup>
                    </Col>
                </Row>

			    <Row>
					<Col md={1}>
						<Button onClick={this.onUpdateBtnClick}>Обновить</Button>
					</Col>
					<Col md={1}>
						{
							this.state.isLoading
								? <React.Fragment>
									<Glyphicon glyph="refresh"/> Загрузка...
								</React.Fragment>
								: null
						}
					</Col>
				</Row>

			{
				(this.state.items !== null)
					? (this.state.items.size > 0)
						? <FrontendRequestList frontendRequests={this.state.items}/>
						: <Alert bsStyle="warning">
							Заявки отсутствуют
						</Alert>
					: null
			}

		</div>;
	}
}