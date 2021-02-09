import React from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { Items } from './components';

const ListOrder = props => {
    // console.log(props.orderList)
    const handlePressOption = (value, type) => {
        if(type === 'detail'){
            props.onClickDetail(value);
        }else if(type === 'lacak'){
            props.onClickLacak(value.extid);
        }
    }

    const renderItem = ({ item, index }) => (
        <Items 
            order={item}
            index={index}
            onPressMenu={handlePressOption}
        />
    )

    return(
        <FlatList 
            data={props.orderList}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
        />
    )
}

ListOrder.propTypes = {
    orderList: PropTypes.array.isRequired,
    onClickDetail: PropTypes.func.isRequired,
    onClickLacak: PropTypes.func.isRequired
}

export default ListOrder;