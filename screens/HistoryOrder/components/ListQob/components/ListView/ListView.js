import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	ScrollView,
	FlatList,
	SafeAreaView,
	TouchableOpacity,
	Clipboard,
	ToastAndroid,
	RefreshControl,
	Alert
} from 'react-native';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Icon } from 'native-base';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import rgba from 'hex-to-rgba';

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}


const Item  = props => {
	const { col } = props;
	const handleCopy = (extid) => {
		Clipboard.setString(props.id);
		ToastAndroid.showWithGravity(
	      "Extid copied to clipboard",
	      ToastAndroid.SHORT,
	      ToastAndroid.BOTTOM
	    );
	}

	return(
		<React.Fragment>
			{ props.index === 0 && <View style={{height: hp('11%')}} />}
			<TouchableOpacity 
				style={
					[styles.list, col.choosed ? 
						{backgroundColor: '#d0d6d3', elevation: 1} : 
						{
							backgroundColor: 'white', 
							elevation: 3
						}
				]} 
				activeOpacity={props.toDisabled ? 0.8 : 2 } 
				onLongPress={() => props.onLongPress()}
				onPress={props.onPressItem}
				// disabled={props.toDisabled}
			>
				<View style={styles.header}>
					<Text 
						style={styles.status}
						onPress={()=> handleCopy(props.id)}
					>{col.extid}</Text>
					<Icon name='ios-checkmark-circle' style={styles.icon} />
					{ !col.choosed && <React.Fragment>
						<Menu>
							<MenuTrigger>
								<Icon name="ios-more" style={{fontSize: 20, marginRight: 5}}/>
							</MenuTrigger>
							<MenuOptions>
								{ col.pickupnumber === null && <MenuOption 
										onSelect={() => props.onPressMenu(col.extid, '1')}
									>
						          	<View style={styles.textMenu}>
						          		<Text>Pickup</Text>
						          	</View>
						        </MenuOption> }
						        
						        {/* <MenuOption>
						          	<View style={styles.textMenu}>
						          		<Text>Order ulang</Text>
						          	</View>
						        </MenuOption> */}

						        <MenuOption onSelect={() => props.onPressMenu(col.extid, '3')}>
						          	<View style={styles.textMenu}>
						          		<Text>Lacak kiriman</Text>
						          	</View>
						        </MenuOption>
								<MenuOption onSelect={() => props.onPressMenu(col.extid, '4')}>
						        	<View style={styles.textMenu}>
						          		<Text>Lihat detail</Text>
						          	</View>
						        </MenuOption>
							</MenuOptions>
						</Menu> 
					</React.Fragment> }
					
				</View>
				<View style={styles.box}>
					<View style={[styles.boxinside, {borderRightWidth: 0.3}]}>
						<View style={styles.item}>
							<View style={styles.left}>
								<Image 
									source={require('../../../../../../assets/images/icon/from.png')}
									style={styles.image}
									resizeMode='contain'
								/>
							</View>
							<View style={{flex: 1}}>
								<Text style={styles.textItem}>Dari</Text>
								<Text 
									style={[styles.textItem, {color: '#a3a3a2'}]}
									numberOfLines={2}
								>
									{ capitalize(col.shippercity) }
								</Text>
							</View>
						</View>
					</View>
					<View style={styles.boxinside}>
						<View style={styles.item}>
							<View style={styles.left}>
								<Image 
									source={require('../../../../../../assets/images/icon/kiriman.png')}
									style={styles.image}
									resizeMode='contain'
								/>
							</View>
							<View style={{flex: 1}}>
								<Text style={styles.textItem}>Kiriman</Text>
								<Text 
									style={[styles.textItem, {color: '#a3a3a2'}]}
									numberOfLines={2}
								>
									{capitalize(col.desctrans)}
								</Text>
							</View>
						</View>
					</View>
				</View>

				<View style={styles.box}>
					<View style={styles.hr} />
					<View style={styles.hr} />
				</View>

				<View style={styles.box}>
					<View style={[styles.boxinside, {borderRightWidth: 0.3}]}>
						<View style={styles.item}>
							<View style={styles.left}>
								<Image 
									source={require('../../../../../../assets/images/icon/to.png')}
									style={styles.image}
									resizeMode='contain'
								/>
							</View>
							<View style={{flex: 1}}>
								<Text style={styles.textItem}>Ke</Text>
								<Text 
									style={[styles.textItem, {color: '#a3a3a2'}]}
									numberOfLines={2}
								>
									{ capitalize(col.receivercity) }
								</Text>
							</View>
						</View>
					</View>
					<View style={styles.boxinside}>
						<View style={styles.item}>
							<View style={styles.left}>
								<Image 
									source={require('../../../../../../assets/images/icon/people.png')}
									style={styles.image}
									resizeMode='contain'
								/>
							</View>
							<View style={{flex: 1}}>
								<Text style={styles.textItem}>Penerima</Text>
								<Text 
									style={[styles.textItem, {color: '#a3a3a2'}]}
									numberOfLines={2}
								>
									{ capitalize(col.receivername) }
								</Text>
							</View>
						</View>
					</View>
				</View>

				<View style={styles.footer}>
					<Text style={[styles.textItem, {color: '#a3a3a2', flex: 1, marginLeft: 5}]}>
						Dikirim : {col.insert_date.substring(0, 10)}
					</Text>
					<View style={{flex: 1, alignItems: 'flex-end', marginRight: 5}}>
						<Text 
							//ellipsizeMode='tail'
							style={[
								styles.textItem, {
									color: '#a3a3a2'
								}]
							} 
							numberOfLines={1}>Status : {col.laststatus}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		</React.Fragment>
	);
} 



const ListView = props => {
	const { data: DATA } = props;
	const [loading, setLoading] = useState(false);
	const [itemPressed, setItemPressed] = useState(false);

	useEffect(() => {
		if (DATA.length > 0) {
			const findChoosed = DATA.filter(row => row.choosed === true);
			if (findChoosed.length === 0 && itemPressed) {
				setItemPressed(false);
			}
		}
	}, [DATA, itemPressed])

	const handlePressMenu = (value, type) => {
		const detail = DATA.find(order => order.extid === value);
		if (type === '4') {
			props.onViewDetail(detail);
		}else if(type === '3'){
			props.lacakKiriman(detail.extid);
		}else if(type === '1'){
			props.onPickup(detail);
		}
	}

	const handleRefresh = () => {
		setLoading(true);
		props.onRefresh()
			.then(res => {
				setLoading(false);
			})
			.catch(err => {
				setLoading(false);
			});
	}

	const handleLongPress = (col) => {
		const isValidItem = validate(col);
		if (isValidItem.success) {
			props.setChoosed(col.extid);
			setItemPressed(true);
		}else{
			alert(isValidItem.message);	
		}
	}

	const handlePressItem = (item) => {
		if (itemPressed) { //work after long press
			const isValidItem = validate(item);
			if (isValidItem.success) {
				props.setChoosed(item.extid);
			}else{
				alert(isValidItem.message);	
			}
		}
	}

	const validate = (choosedItem) => {
		const isValid = {};
		if (choosedItem.pickupnumber === null) {
			const firstChoosedItem = DATA.find(row => row.choosed === true);
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

	const renderItem = ({ item, index }) => (
		<Item 
			col={item}
			onPressMenu={handlePressMenu}
			index={index}
			onLongPress={() => handleLongPress(item)}
			onPressItem={() => handlePressItem(item)}
			toDisabled={itemPressed}
		/>
	);

	const onPressbtnpickup = () => {
		Alert.alert(
	      "Konfirmasi",
	      `Apakah anda yakin untuk melakukan pickup?`,
	      [
	        {
	          text: "Cancel",
	          // onPress: () => console.log("Cancel Pressed"),
	          style: "cancel"
	        },
	        { 
	        	text: "OK", 
	        	onPress: () => props.onMultiplePickup()
	        }
	      ],
	      { cancelable: false }
	    );
	}

	return(
		<View style={itemPressed ? styles.choosedMode : null}>
			<FlatList
		        data={DATA}
		        renderItem={renderItem}
		        onEndReached={() => props.getNewData()}
		        refreshControl={
	                <RefreshControl
	                    refreshing={loading}
	                    progressViewOffset={90}
	                    onRefresh={handleRefresh}
	                />
	            }
		        onEndReachedThreshold={0.5}
		        onScroll={(e) => props.onScroll(e.nativeEvent.contentOffset.y)}
		        keyExtractor={item => item.id.toString()}
		    />
		    { DATA.filter(row => row.choosed === true).length > 0 && 
			    <TouchableOpacity 
			    	style={styles.btn_pickup} 
			    	activeOpacity={0.7}
			    	onPress={onPressbtnpickup}
			    >
			    	<Text style={{color: 'white', textAlign: 'center'}}>
			    		Pickup{'\n'}{DATA.filter(row => row.choosed === true).length} item
			    	</Text>
			    </TouchableOpacity> }
	    </View>
	);
}

const styles = StyleSheet.create({
	list: {
		// backgroundColor: 'white',
		height: hp('26%'),
		borderRadius: 6,
		margin: 7
	},
	footer: {
		padding: 5,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	container: {
		flex: 1
	},
	header: {
		padding: 5,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	status: {
		width: wp('45%'),
		color: '#f59300',
		fontSize: 12
	},
	icon: {
		fontSize: 20, 
		flex: 1,
		color: '#f59300'
	},
	box: {
		flexDirection: 'row',
		justifyContent: 'center'
	},
	boxinside: {
		flex: 1,
		alignItems: 'center'
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: wp('43%'),
		height: hp('9%')
	},
	hr: {
		height: 1,
		flex: 1,
		marginLeft: 15,
		marginRight: 15,
		backgroundColor: '#a3a3a2'
	},
	image: {
		width: wp('4%'),
		height: hp('5%')
	},
	textItem: {
		fontSize: 12
	},
	left: {
		alignItems: 'center', 
		width: wp('13%')
	},
	textMenu: {
		paddingLeft: 10, 
		paddingBottom: 6, 
		paddingTop: 6
	},
	choosedMode: {
		backgroundColor: 'white'
	},
	btn_pickup: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		backgroundColor: '#C51C16',
		margin: 10,
		height: hp('9%'),
		width: hp('9%'),
		borderRadius: hp('9%') / 2,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 3,
		padding: 5
	}
})

ListView.propTypes = {
	data: PropTypes.array.isRequired,
	onViewDetail: PropTypes.func.isRequired,
	lacakKiriman: PropTypes.func.isRequired,
	onPickup: PropTypes.func.isRequired,
	getNewData: PropTypes.func.isRequired,
	onRefresh: PropTypes.func.isRequired,
	onScroll: PropTypes.func.isRequired,
	setChoosed: PropTypes.func.isRequired,
	onMultiplePickup: PropTypes.func.isRequired
}

export default ListView;