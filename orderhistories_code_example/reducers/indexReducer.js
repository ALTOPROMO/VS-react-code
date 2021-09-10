import { prestashopAPI } from "../../api/api";
import { updateObjectInArray } from '../../utils/helpers/helperObject';
import { submit } from "redux-form";

// ----- Константы
const SET_INITIALIZED           = 'SET-INIT-APP';
const SET_ORDERS_HISTORIES      = 'SET-ORDERS-HISTORIES';
const SET_TOTAL_ORDER_HISTORIES = 'SET-TOTAL-ORDER-HISTORIES';
const SET_TOTAL_PAGES           = 'SET-TOTAL-PAGES';
const ONCHANGE_CURRENT_PAGE     = 'ONCHANGE-CURRENT-PAGE';
const SET_IF_FETCHING           = 'SET-IS-FETCHING';
const SET_SORT                  = 'SET-SORT';
const UPDATE_COMMENT            = 'UPDATE-COMMENT';
const IS_FILTERS_USED           = 'IS-FILTERS-USED';
const SET_FILTERS               = 'SET-FILTERS';

// ----- Начальное состояние
const initialState = {
    initialized: false,

    table_columns: [
        {
            name      : 'id_order_history',
            label     : 'ID',
            filter    : true,
            table_name: 'main',
            type      : 'number'
        },
        {
            name      : 'id_order',
            label     : 'ID заказа',
            filter    : true,
            table_name: 'main',
            type      : 'number'
        },
        {
            name      : 'old_state_name',
            label     : 'Старый статус',
            filter    : false,
            table_name: 'osl',
        },
        {
            name         : 'state_name',
            label        : 'Новый статус',
            filter       : true,
            table_name   : 'nothing',
            filter_table : 'osl',
            filter_column: 'name',
            type         : 'text',
        },
        {
            name            : 'comment',
            label           : 'Причина изменения',
            filter          : true,
            filter_condition: 'like',
            table_name      : 'main',
            type            : 'text',
        },
        {
            name      : 'employee',
            label     : 'Пользователь',
            filter    : true,
            table_name: 'nothing',
            type      : 'text'
        },
        {
            name      : 'date_add',
            label     : 'Дата изменения',
            filter    : true,
            table_name: 'main',
            type      : 'date'
        },
    ],

    order_histories      : [],
    total_order_histories: undefined,
    total_pages          : undefined,
    current_page         : 1,
    count                : 20,

    sort: {
        table_name: 'main',
        orderby   : 'id_order_history',
        orderway  : 'DESC'
    },

    filters      : {},
    isFiltersUsed: false,
    isFetching   : false,
}

/**
 * Редьюсер
 * 
 * @param {object} state  Старое состояние
 * @param {object} action Экшен
 * 
 * @returns {object} stateCopy Копия состояния
 */
export const indexReducer = (state = initialState, action) => {

    let stateCopy;

    switch (action.type) {
        case SET_INITIALIZED:
            stateCopy = {...state, initialized: action.initialized}
            break;

        case SET_ORDERS_HISTORIES:
            stateCopy = {...state, order_histories: [...action.order_histories]}
            break;

        case SET_TOTAL_ORDER_HISTORIES:
            stateCopy = {...state, total_order_histories: action.total_number}
            break;

        case ONCHANGE_CURRENT_PAGE:
            stateCopy = {...state, current_page: action.current_page}
            break; 

        case SET_IF_FETCHING:
            stateCopy = {...state, isFetching: action.isFetching}
            break; 

        case SET_TOTAL_PAGES:
            stateCopy = {...state, total_pages: action.total_pages}
            break; 

        case SET_SORT:
            stateCopy = {...state, sort: {...action.sort}}
            break; 

        case UPDATE_COMMENT:
            stateCopy = {
                ...state,
                order_histories: updateObjectInArray(state.order_histories, action.id_order_history, 'id_order_history', {comment: action.comment})
            }
            break; 

        case IS_FILTERS_USED:
            stateCopy = {...state, isFiltersUsed: action.isFiltersUsed}
            break; 

        case SET_FILTERS:
            stateCopy = {...state, filters: {...action.filters}}
            break; 

        default:
            stateCopy = {...state};
    }

    return stateCopy;
}

export default indexReducer;

/* ----- Action creators ----- */

/**
 * Создание экшена установки истории заказов
 * 
 * @param {array} order_histories История заказов
 * 
 * @returns {object} Экшен установки истории заказов
 */
export const setOrdersHistoriesActionCreator = (order_histories) => ({type: SET_ORDERS_HISTORIES, order_histories: order_histories});

/**
 * Создание экшена инициализации
 * 
 * @returns {object} Экшен инициализации
 */
export const setInitializedCreator = () => ({type: SET_INITIALIZED, initialized: true});

/**
 * Создание экшена установки общего числа записей в истории
 * 
 * @param {number} total_number Общее число записей
 * 
 * @returns {object} Экшен установки общего числа записей в истории
 */
export const setTotalOrderHistoriesActionCreator = (total_number) => ({type: SET_TOTAL_ORDER_HISTORIES, total_number: total_number});

/**
 * Создание экшена установки общего числа страниц с записями
 * 
 * @param {number} total_pages Общее число страниц
 * 
 * @returns {object} Экшен установки общего числа страниц с записями
 */
export const setTotalPagesActionCreator = (total_pages) => ({type: SET_TOTAL_PAGES, total_pages: total_pages});

/**
 * Создание экшена смены выбранной страницы
 * 
 * @param {number} current_page Выбранная страница
 * 
 * @returns {object} Экшен смены выбранной страницы
 */
export const onChangeCurrentPageActionCreator = (current_page) => ({type: ONCHANGE_CURRENT_PAGE, current_page: current_page});

/**
 * Создание экшена установки флага получения данных
 * 
 * @param {boolean} isFetching Получаем ли мы данные
 * 
 * @returns {object} Экшен установки флага получения данных
 */
export const setIsFetchingActionCreator = (isFetching) => ({type: SET_IF_FETCHING, isFetching: isFetching});

/**
 * Создание экшена установки сортировки
 * 
 * @param {object} sort Данные о сортировке
 * 
 * @returns {object} Экшен установки сортировки
 */
export const setSortActionCreator = (sort) => ({type: SET_SORT, sort: sort});

/**
 * Создание экшена установки сортировки
 * 
 * @param {object} sort Данные о сортировке
 * 
 * @returns {object} Экшен установки сортировки
 */
export const updateCommentActionCreator = (id_order_history, comment) => ({type: UPDATE_COMMENT, id_order_history: id_order_history, comment: comment});

/**
 * Создание экшена установки флага использования фильтров
 * 
 * @param {boolean} isFiltersUsed Используются ли фильтры
 * 
 * @returns {object} Экшен установки флага использования фильтров
 */
export const setIsFiltersUsedActionCreator = (isFiltersUsed) => ({type: IS_FILTERS_USED, isFiltersUsed: isFiltersUsed});

/**
 * Создание экшена установки фильтров
 * 
 * @param {object} filters Включенные фильтры
 * 
 * @returns {object} Экшен установки фильтров
 */
export const setFiltersActionCreator = (filters) => ({type: SET_FILTERS, filters: filters});


/* ----- Thunk creators ----- */

/**
 * Создание асинхронного экшена установки истории заказов
 * 
 * @param {object} getParams GET-параметры запроса
 * @param {number} count     Необходимое число записей
 * 
 * @returns {Function} Асинхронная функция для диспетчеризации экшенов
 */
export const setOrdersHistoriesThunkCreator = (getParams, count) => async (dispatch) => {
    let response = await prestashopAPI.getOrdersHistories(getParams);

    if (response.status >= 400) {
        Promise.reject(response.data);
    }
    else if (response.data.order_histories === undefined || response.data.order_histories === null) {
        Promise.reject(response.error_msg); 
    }
    else {
        dispatch(setOrdersHistoriesActionCreator(response.order_histories));
        dispatch(setTotalOrderHistoriesActionCreator(response.count));

        const total_pages = Math.ceil(response.count / count);

        dispatch(setTotalPagesActionCreator(total_pages));
    }
}

/**
 * Создание асинхронного экшена обновления истории заказов
 * 
 * @param {number} page_num  Номер страницы
 * @param {number} count     Число записей
 * @param {object} sort      Данные о сортировке
 * @param {object} filters   Значения фильтров
 * @param {object} fields    Поля фильтров
 * 
 * @returns {Function} Асинхронная функция для диспетчеризации экшенов
 */
export const updateOrderHistoriesThunkCreator = (page_num, count, sort, filters, fields) => async (dispatch) => {
    const offset    = parseInt((page_num - 1) * count - 1);
    const getParams = {
        'sort': `[${sort.table_name}|${sort.orderby}-${sort.orderway}]`,
        'limit': parseInt(page_num) === 1 ? `${count}` : `${offset},${count}`,
        'filter': getRequestParamsByFilters(filters, fields),
    }

    dispatch(setIsFetchingActionCreator(true));
    let updateOrderHistories = dispatch(setOrdersHistoriesThunkCreator(getParams, count));

    Promise.all([updateOrderHistories]).then(() => {
        dispatch(setIsFetchingActionCreator(false));
        dispatch(onChangeCurrentPageActionCreator(page_num));
    })
}

/**
 * Создание асинхронного экшена установки сортировки
 * 
 * @param {object} sort      Данные о сортировке
 * @param {number} page_num  Номер страницы
 * @param {number} count     Число записей
 * @param {object} filters   Значения фильтров
 * @param {object} fields    Поля фильтров
 * 
 * @returns {Function} Асинхронная функция для диспетчеризации экшенов
 */
export const setSortThunkCreator = (sort, page_num, count, filters, fields) => async (dispatch) => {
    const offset    = parseInt((page_num - 1) * count - 1);
    const getParams = {
        'sort': `[${sort.table_name}|${sort.orderby}-${sort.orderway}]`,
        'limit': parseInt(page_num) === 1 ? `${count}` : `${offset},${count}`,
        'filter': getRequestParamsByFilters(filters, fields),
    }
    
    dispatch(setIsFetchingActionCreator(true));
    let updateOrderHistories = dispatch(setOrdersHistoriesThunkCreator(getParams, count));

    Promise.all([updateOrderHistories]).then(() => {
        dispatch(setIsFetchingActionCreator(false));
        dispatch(setSortActionCreator(sort));
    })
}

/**
 * Создание асинхронного экшена обновления причины изменения статуса
 * 
 * @param {number} id_order_history ID записи с историей
 * @param {string} comment          Текст причины
 * 
 * @returns {Function} Асинхронная функция для диспетчеризации экшенов
 */
export const updateCommentThunkCreator = (id_order_history, comment) => async (dispatch) => {
    let response = await prestashopAPI.updateComment(id_order_history, comment);

    if (response.status >= 400) {
        Promise.reject(response.data);
    }
    else if (response.data.affected_rows == 0) {
        Promise.reject(response.data.error_msg);
    }
    else {
        dispatch(updateCommentActionCreator(id_order_history, comment));
    }
}

/**
 * Создание асинхронного экшена установки фильтров
 * 
 * @param {object} filters Значения фильтров
 * @param {object} fields  Поля фильтров
 * @param {object} sort    Данные о сортировке
 * @param {number} count   Число записей
 * 
 * @returns {Function} Асинхронная функция для диспетчеризации экшенов
 */
export const setFiltersThunkCreator = (filters, fields, sort, count) => async (dispatch) => {
    const getParams = {
        'filter': getRequestParamsByFilters(filters, fields),
        'limit': `${count}`,
        'sort': `[${sort.table_name}|${sort.orderby}-${sort.orderway}]`
    };

    dispatch(setIsFetchingActionCreator(true));
    let updateOrderHistories = dispatch(setOrdersHistoriesThunkCreator(getParams, count));

    Promise.all([updateOrderHistories]).then(() => {
        dispatch(setIsFetchingActionCreator(false));
        dispatch(onChangeCurrentPageActionCreator(1));
        dispatch(setFiltersActionCreator(filters));
        dispatch(setIsFiltersUsedActionCreator(true));
    });
}

/**
 * Создание асинхронного экшена сброса фильтров
 * 
 * @param {object} sort  Данные о сортировке
 * @param {number} count Число записей
 * 
 * @returns {Function} Асинхронная функция для диспетчеризации экшенов
 */
export const unsetFiltersThunkCreator = (sort, count) => async (dispatch) => {
    const getParams = {
        'limit': `${count}`,
        'sort': `[${sort.table_name}|${sort.orderby}-${sort.orderway}]`
    }

    dispatch(setIsFetchingActionCreator(true));
    let updateOrderHistories = dispatch(setOrdersHistoriesThunkCreator(getParams, count));

    Promise.all([updateOrderHistories]).then(() => {
        dispatch(setIsFetchingActionCreator(false));
        dispatch(onChangeCurrentPageActionCreator(1));
        dispatch(setFiltersActionCreator({}));
        dispatch(setIsFiltersUsedActionCreator(false));
    });
}

/**
 * Ручное подтверждение формы с фильтрами
 * 
 * @returns {Function} Асинхронная функция для диспетчеризации экшенов
 */
export const formSubmitThunkCreator = () => async (dispatch) => {
    const action = submit('filter');
    dispatch(action);
}

/**
 * Инициализация модуля
 * 
 * @param {object} getParams GET-параметры запроса 
 * @param {number} count     Число записей 
 * 
 * @returns {Function} Асинхронная функция для диспетчеризации экшенов
 */
export const initializeApp = (getParams = {}, count) => async (dispatch) => {
    let setOrdersHistories =  dispatch(setOrdersHistoriesThunkCreator(getParams, count, true));

    Promise.all([setOrdersHistories]).then(() => {
        dispatch(setInitializedCreator());
    })
}


/* ----- Дополнительные функции ----- */

/**
 * Получение параметров запроса исходя из включенных фильтров
 *  
 * @param {object} filters Выбранные фильтры
 * @param {array}  fields  Названия полей с фильтрами
 * 
 * @returns {object|boolean} getParams|false 
 */
const getRequestParamsByFilters = (filters, fields) => {
    let getParams = {};

    for (let key in filters) {
        let name_condition_arr = key.split('||');

        for (let field of fields) {

            if (field.name === name_condition_arr[0] && filters[key] !== '') {
                let get_params_key = '';

                if (field.filter_table !== undefined) 
                    get_params_key = `filter[${field.filter_table}|${field.filter_column}]`; 
                else
                    get_params_key = `filter[${field.table_name}|${name_condition_arr[0]}]`; 

                let value = filters[key];

                if (name_condition_arr[1] !== undefined) {

                    if (field.filter_table !== undefined) 
                        get_params_key = `filter[${field.filter_table}|${field.filter_column}||${name_condition_arr[1]}]`; 
                    else
                        get_params_key = `filter[${field.table_name}|${name_condition_arr[0]}||${name_condition_arr[1]}]`; 

                    getParams[get_params_key] = `[${value}]`;

                }
                else getParams[get_params_key] = `%[${value}]%`;
            }

        }
    }

    return Object.keys(getParams).length > 0 ? getParams : false;
}