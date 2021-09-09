import React from 'react';
import OrderHistory from './OrderHistory';
import { connect } from 'react-redux';
import { updateCommentThunkCreator } from '../../redux/reducers/indexReducer';

/**
 * Контейнерная компонента строки в таблице
 * 
 * @param {object} props Пропсы компоненты
 */
const OrderHistoryAPI = ({
    order_history,
    odd_even,
    updateComment
}) => {
    return (
        <OrderHistory 
            id_order_history={order_history.id_order_history}
            employee={order_history.employee}
            state_name={order_history.state_name}
            old_state_name={order_history.old_state_name}
            id_order={order_history.id_order}
            comment={order_history.comment}
            date_add={order_history.date_add}
            odd_even={odd_even}
            updateComment={updateComment}
        />
    ); 
}

/**
 * Выборка данных из state для компоненты
 * 
 * @param {object} state    Актуальное состояние
 * @param {object} ownProps Собственные пропсы
 * 
 * @returns {object} Объект с пропсами для компоненты
 */
const mapStateToProps = (state, ownProps) => {
    return {
        order_history: ownProps.order_history,
        odd_even: ownProps.odd_even,
    }
}

const actionCreators = {
    updateComment: updateCommentThunkCreator
}

export default connect(mapStateToProps, actionCreators)(OrderHistoryAPI);