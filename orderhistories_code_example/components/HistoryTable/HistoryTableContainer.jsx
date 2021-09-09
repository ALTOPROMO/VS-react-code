import React from 'react';
import { connect } from 'react-redux';
import HistoryTable from './HistoryTable';
import { updateOrderHistoriesThunkCreator, setSortThunkCreator } from '../../redux/reducers/indexReducer';

/**
 * Контейнерная компонента для талицы
 * 
 * @param {object} props Свойства
 */
class HistoryTableApiContainer extends React.Component {

    /**
     * Слушатель события при изменении сортировки 
     * 
     * @param {object} sort      Данные о сортировке
     * @param {number} page_num  Номер страницы
     * @param {number} count     Число записей
     * @param {object} filters   Значения фильтров
     * @param {array}  fields    Поля фильтров
     */
    onChangeSort = (sort, current_page, count, filters, table_columns) => {
        this.props.changeSort(sort, current_page, count, filters, table_columns);
    }

    render() {
        return(
            <HistoryTable 
                table_columns={this.props.table_columns}
                filters={this.props.filters}
                order_histories={this.props.order_histories}
                current_page={this.props.current_page}
                total_pages={this.props.total_pages}
                count={this.props.count}
                sort={this.props.sort}
                total_order_histories={this.props.total_order_histories}
                isFetching={this.props.isFetching}
                changeSort={this.onChangeSort}
                updateData={this.props.updateData}
            />
        );
    }
}

/**
 * Выборка данных из state для компоненты
 * 
 * @param {object} state Актуальное состояние
 * 
 * @returns {object} Объект с пропсами для компоненты
 */
const mapStateToProps = (state) => {
    return {
        table_columns        : state.indexReducer.table_columns,
        order_histories      : state.indexReducer.order_histories,
        current_page         : state.indexReducer.current_page,
        total_pages          : state.indexReducer.total_pages,
        count                : state.indexReducer.count,
        sort                 : state.indexReducer.sort,
        total_order_histories: state.indexReducer.total_order_histories,
        isFetching           : state.indexReducer.isFetching,
        filters              : state.indexReducer.filters
    }
}

const actionCreators = {
    updateData: updateOrderHistoriesThunkCreator,
    changeSort: setSortThunkCreator,
}

export default connect(mapStateToProps, actionCreators)(HistoryTableApiContainer);