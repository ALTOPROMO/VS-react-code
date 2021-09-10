import axios from 'axios';

/**
 * @var {string} domain Доменное имя сайта, на который устанавливается модуль с указание протокола передачи данных
 */
const domain = 'https://example-domain.com';

/**
 * @var {Axios} instanceModule Экземпляр класса Axios
 */
const instanceModule = axios.create({
    baseURL: `${domain}/module/pworderhistories/orderhistories`,
});

/**
 * @var {object} prestashopAPI Объект для работы с API модуля
 */
export const prestashopAPI = {

    /**
     * Получение истории статусов заказов
     * 
     * @param {object} getParams GET-параметры запроса
     * 
     * @return {Promise} Результат запроса
     */
    getOrdersHistories: async (getParams = {}) => {

        // ----- Дефолтные параметры запроса
        let params = {
            'method'                  : 'getOrderHistories',
            'limit'                   : getParams['limit'] ? getParams['limit'] : 20,
            'display'                 : 'full',
            'sort'                    : getParams['sort'] ? getParams['sort'] : '[main|id_order_history-DESC]',
            'filter[main|id_employee]': `![0]`
        };

        // ----- Установка параметров запроса на основе getParams
        if (getParams['filter']) {
            params  = {...params, ...getParams['filter']};

            params['filterModal'] = true;
        }

        return instanceModule.get(``, {params: params}).then( response => {
            return response;
        });
    },

    /**
     * Обновление причины изменения статуса
     * 
     * @param {number} id_order_history ID записи с изменением статуса 
     * @param {string} comment          Причина изменения статуса
     * 
     * @return {Promise} Результат обновления причины
     */
    updateComment: async (id_order_history, comment) => {

        // ------ Тело запроса 
        const postParams = {
            'method'          : 'updateComment',
            'id_order_history': id_order_history,
            'comment'         : comment,
        }

        return instanceModule.put(``, postParams).then( response => {
            return response;
        });
    }
}