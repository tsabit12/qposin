import React, { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl } from 'react-native';
import PropTypes from 'prop-types';
import { Items } from './components';

const ListOrder = props => {
    // console.log(props.orderList)
    const [chooseMode, setChooseMode] = useState(false);

    useEffect(() => {
        if(props.orderList.length > 0){
            const findChoosed = props.orderList.filter(row => row.choosed === true);
			if (findChoosed.length === 0 && chooseMode) {
				setChooseMode(false);
			}
        }
    }, [props.orderList, chooseMode])

    //status only for cancel option
    const handlePressOption = (value, type, status) => {
        if(type === 'detail'){
            props.onClickDetail(value);
        }else if(type === 'lacak'){
            props.onClickLacak(value.extid);
        }else if(type === 'cancel'){
            Alert.alert(
                `BATALKAN ${status === '20' ? 'PICKUP' : 'ORDER'}`,
                `Apakah kamu yakin untuk membatalkan ${status === '20' ? 'pickup' : 'order'} dengan extid ${value.extid}?`,
                [
                    {
                    text: "Batal",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                    },
                    { text: "Ya", onPress: () => props.removeItem(value.extid, status) }
                ],
                { cancelable: false }
            );
        }else{
            const payload = [{ extid: value.extid }];
            props.onPickup(payload);
        }
    }

    const handleChooseItemByLongPress = (orderItem) => {
        if(!chooseMode){
            const isValid = validate(orderItem);
            if(isValid.success){
                props.onChooseItem(orderItem.extid);
                setChooseMode(true);
            }else{
                alert(isValid.message);
            }
        }        
    }

    const validate = (choosedItem) => {
        const isValid = {};
		if (choosedItem.pickupnumber === null || choosedItem.pickupnumber === '') {
			const firstChoosedItem = props.orderList.find(row => row.choosed === true);
			if (firstChoosedItem) {
				const { shippersubdistrict } = firstChoosedItem;
				if (shippersubdistrict.toLowerCase() !== choosedItem.shippersubdistrict.toLowerCase()) {
					isValid.success = false;
					isValid.message = "Harap pilih alamat pengirim yang sama";
				}else{
					isValid.success = true;
					isValid.message = null;
				}
			}else{
				isValid.success = true;
				isValid.message = null;
			}
		}else{
			isValid.success = false;
			isValid.message = `ID ORDER ${choosedItem.extid} sebelumnya sudah dipickup, silahkan pilih ID ORDER lain`;
		}

		return isValid;
    }

    const handleChooseItem = (orderItem) => {
        if(chooseMode){//working only
            const isValid = validate(orderItem);
            if(isValid.success){
                props.onChooseItem(orderItem.extid);
            }else{ 
                alert(isValid.message);
            }
        }
    }

    const renderItem = ({ item, index }) => (
        <Items 
            order={item}
            index={index}
            onPressMenu={handlePressOption}
            onLongPress={handleChooseItemByLongPress}
            onPress={handleChooseItem}
        />
    )

    return(
        <FlatList 
            data={props.orderList.filter(row => row.lasthistorystatusid !== '6')}
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
    onPickup: PropTypes.func.isRequired,
    onChooseItem: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired
}

export default ListOrder;