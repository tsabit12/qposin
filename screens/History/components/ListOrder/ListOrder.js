import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import PropTypes from 'prop-types';
import { Items } from './components';

const ListOrder = props => {
    // console.log(props.orderList)
    const handlePressOption = (value, type) => {
        if(type === 'detail'){
            props.onClickDetail(value);
        }else if(type === 'lacak'){
            props.onClickLacak(value.extid);
        }else{
            const payload = [{ extid: value.extid }];
            props.onPickup(payload);
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
            onEndReached={props.getNewData}
            onEndReachedThreshold={0.3}
            refreshControl={<RefreshControl 
                refreshing={props.refreshLoading}
                progressViewOffset={90}
                onRefresh={props.handeleRefresh}
            />}
        />
    )
}

ListOrder.propTypes = {
    orderList: PropTypes.array.isRequired,
    onClickDetail: PropTypes.func.isRequired,
    onClickLacak: PropTypes.func.isRequired,
    getNewData: PropTypes.func.isRequired,
    refreshLoading: PropTypes.bool.isRequired,
    handeleRefresh: PropTypes.func.isRequired,
    onPickup: PropTypes.func.isRequired
}

export default ListOrder;