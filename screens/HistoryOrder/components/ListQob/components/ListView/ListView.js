import React, { useState } from 'react';
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
	ToastAndroid
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

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}

const Item  = props => {
	const handleCopy = (extid) => {
		Clipboard.setString(props.id);
		ToastAndroid.showWithGravity(
	      "Extid copied to clipboard",
	      ToastAndroid.SHORT,
	      ToastAndroid.BOTTOM
	    );
	}
	return(
		<View style={styles.list}>
			<View style={styles.header}>
				<Text style={styles.status}>{props.status}</Text>
				<Icon name='ios-checkmark-circle' style={styles.icon} />
				<Menu>
					<MenuTrigger>
						<Icon name="ios-more" style={{fontSize: 20, marginRight: 5}}/>
					</MenuTrigger>
					<MenuOptions>
						{ props.pickupnumber === null && <MenuOption onSelect={() => props.onPress(props.id, '1')}>
				          	<View style={styles.textMenu}>
				          		<Text>Pickup</Text>
				          	</View>
				        </MenuOption> }
				        
				        {/* <MenuOption>
				          	<View style={styles.textMenu}>
				          		<Text>Order ulang</Text>
				          	</View>
				        </MenuOption> */}

				        <MenuOption onSelect={() => props.onPress(props.id, '3')}>
				          	<View style={styles.textMenu}>
				          		<Text>Lacak kiriman</Text>
				          	</View>
				        </MenuOption>
						<MenuOption onSelect={() => props.onPress(props.id, '4')}>
				        	<View style={styles.textMenu}>
				          		<Text>Lihat detail</Text>
				          	</View>
				        </MenuOption>
					</MenuOptions>
				</Menu> 
				
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
								{ props.shippercity }
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
								{ props.kiriman }
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
								{ props.receivercity }
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
								{ props.receivername }
							</Text>
						</View>
					</View>
				</View>
			</View>

			<View style={styles.footer}>
				<Text style={[styles.textItem, {color: '#a3a3a2'}]}>Dikirim : {props.date.substring(0, 10)}</Text>
				<Text 
					style={[styles.textItem, {color: '#f59300'}]}
					onPress={()=> handleCopy(props.id)}
				>{props.id}</Text>
			</View>
		</View>
	);
} 



const ListView = props => {
	const { data: DATA } = props;
	const [loading, setLoading] = useState(false);

	const handlePress = (value, type) => {
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

	const renderItem = ({ item }) => (
		<Item 
			status={item.laststatus}
			shippercity={capitalize(item.shippercity)}
			receivercity={capitalize(item.receivercity)}
			kiriman={capitalize(item.desctrans)}
			receivername={capitalize(item.receivername)}
			date={item.insert_date}
			pickupnumber={item.pickupnumber}
			id={item.extid}
			onPress={handlePress}
		/>
	);

	return(
		<SafeAreaView style={styles.container}>
			 <FlatList
		        data={DATA}
		        renderItem={renderItem}
		        refreshing={loading}
		        onEndReached={() => props.getNewData()}
		        // onEndReachedThreshold={0.4}
		        onRefresh={handleRefresh}
		        keyExtractor={item => item.id.toString()}
		     />
	    </SafeAreaView>
	);
}

const styles = StyleSheet.create({
	list: {
		backgroundColor: 'white',
		height: hp('26%'),
		borderRadius: 6,
		elevation: 3,
		marginLeft: 15,
		marginRight: 15,
		marginTop: 5,
		marginBottom: 5
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
		width: wp('43%'),
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
		width: wp('40%'),
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
	}
})

ListView.propTypes = {
	data: PropTypes.array.isRequired,
	onViewDetail: PropTypes.func.isRequired,
	lacakKiriman: PropTypes.func.isRequired,
	onPickup: PropTypes.func.isRequired,
	getNewData: PropTypes.func.isRequired,
	onRefresh: PropTypes.func.isRequired
}

export default ListView;