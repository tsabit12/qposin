const convertMonth = (month) => {
	switch(month){
		case '01':
			return '0';
		case '02':
			return '1';
		case '03':
			return '2';
		case '04':
			return '3';
		case '05':
			return '4';
		case '06':
			return '5';
		case '07': 
			return '6';
		case '08':
			return '7';
		case '09':
			return '8';
		case '10':
			return '9';
		case '11':
			return '10';
		case '12':
			return '11';
		default: 
			return null;
	}
}

export default convertMonth;