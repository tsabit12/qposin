import api from '../../api';

export const convertDate = (date) => {
	var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [year, month, day].join('/');
}

export const setOrder = (payload) => dispatch => dispatch({
	type: 'SET_ORDER', 
	payload
})

export const resetOrder = () => dispatch => dispatch({
	type: 'RESET_ORDER'
})

export const detailFetched = (other, pickup, date) => ({
	type: 'FETCH_DETAIL_ORDER',
	other,
	pickup,
	date
})

export const getDetailOrder = (payload) => dispatch => 
	api.getDetailOrder(payload)
		.then(res => {
			// const daterange = convertDate(payload.startdate);
			const { data } 	= res;
			const pickup 	= data.filter(x => x.pickupnumber === null);
			// const other 	= data.filter(x => x.laststatus !== 'Order');
			dispatch(detailFetched(data, pickup, convertDate(payload.startdate)))
		})