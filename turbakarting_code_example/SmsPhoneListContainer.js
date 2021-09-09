import React from "react";
import {Alert, Button, Col, ControlLabel, FormGroup, Glyphicon, Row} from "react-bootstrap";
import SmsPhoneList from "./SmsPhoneList";
import PhoneField from "../form/PhoneField";
import ErrorsList from "../ErrorsList";
import FrontendRequestAction from "../../actions/FrontendRequestAction";
import FrontendRequestStore from "../../stores/FrontendRequestStore";

/**
 * Все отправленные смс
 *
 * @property {boolean}                       state.isLoading   Идёт загрузка
 * @property {Map<number, SmsPhoneDto>|null} state.items       Список отправленных смс
 * @property {string[]}                      state.errors      Список ошибок
 */
export default class SmsPhoneListContainer extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			isLoading:         true,
			phoneNumber:       '',
			couponCode:        '',
			items:             null,
			errors:            [],
		};
		FrontendRequestAction.smsList(this.getListRequest());

		this.onPhoneNumberChange = this.onPhoneNumberChange.bind(this);
		this.onCouponCodeChange  = this.onCouponCodeChange.bind(this);
		this.onLoad              = this.onLoad.bind(this);
		this.onUpdateBtnClick    = this.onUpdateBtnClick.bind(this);
	}

	/**
	 * @return {SmsPhoneListRequest}
	 */
	getListRequest() {
		/** @type {SmsPhoneListRequest} */
		return {
			phoneNumber: this.state.phoneNumber,
			couponCode:  this.state.couponCode,
		};
	}

	/**
	 * @inheritdoc
	 */
	componentDidMount() {
		FrontendRequestStore.addSmsPhoneFilteredListener(this.onLoad);
	}

	/**
	 * @inheritdoc
	 */
	componentWillUnmount() {
		FrontendRequestStore.removeSmsPhoneFilteredListener(this.onLoad);
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
	 * Обработка изменения поля кода купона.
	 *
	 * @param {Object} EventSource Событие при изменении поля с кодом купона
	 */
	onCouponCodeChange(evt) {
		this.setState({couponCode: evt.target.value});
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

			result.data.forEach(/** @param {SmsPhoneDto} smsPhone */(smsPhone) => {
				newMap.set(smsPhone.id, smsPhone);
			});

			newState.items = newMap;
		}
		else {
			newState.errors = result.errors;
		}

		this.setState(newState);
	}

	onUpdateBtnClick() {
		FrontendRequestAction.smsList(this.getListRequest());
		this.setState({isLoading: true});
	}

	render() {
		return <div className="smsPhones">
			<h1>Заявки</h1>
			<ErrorsList errors={this.state.errors}/>
				<Row>
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
                            <ControlLabel>Код купона</ControlLabel>

                            <input
                                name="couponCode"
                                type="text"
								onChange={this.onCouponCodeChange}
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
						? <SmsPhoneList smsPhones={this.state.items}/>
						: <Alert bsStyle="warning">
							Отправленные смс отсутствуют
						</Alert>
					: null
			}

		</div>;
	}
}