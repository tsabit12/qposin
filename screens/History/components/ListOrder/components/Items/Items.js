import React from 'react';
import { Image, Text, TouchableOpacity, View, Clipboard, ToastAndroid } from 'react-native';
import PropTypes from 'prop-types';
import styles from '../styles';
import { Feather } from '@expo/vector-icons'; 
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { Icon } from 'native-base';

const isPickup = (pickupnumber) => {
    switch (pickupnumber) {
        case null:
            return {
                color: '#0eab38',
                status: false
            }
        case '':
            return {
                color: '#0eab38',
                status: false
            }
        default:
            return {
                color: '#f59300',
                status: true
            }
    }
}

const Items = props => {
    const { order } = props;

    const handleCopy = (extid) => {
        Clipboard.setString(extid);
        
		if(Platform.OS === 'android'){
			ToastAndroid.showWithGravity(
				"Extid copied to clipboard",
				ToastAndroid.SHORT,
				ToastAndroid.BOTTOM
			);
		}else{
			alert('Extid copied to clipboard')
		}
    }
    
    return(
        <View style={styles.root}>
            <TouchableOpacity activeOpacity={0.8}>
                <View style={styles.header}>
                    <Text 
						style={styles.status}
						onPress={()=> handleCopy(order.extid)}
					>
                        {order.extid}
                    </Text>
                    <View style={{flex: 1}}>
                        <TouchableOpacity 
                            style={[styles.icon, { backgroundColor: isPickup(order.pickupnumber).color}]}
                            disabled
                        >
                            <Feather name="box" size={13} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Menu>
                        <MenuTrigger>
                            <Icon name="ios-more" style={{fontSize: 20, marginRight: 5}}/>
                        </MenuTrigger>
                        <MenuOptions>
                            { !isPickup(order.pickupnumber).status && <MenuOption onSelect={() => props.onPressMenu(order, 'pickup')}>
                                <View style={styles.textMenu}>
                                    <Text>Pickup</Text>
                                </View>
                            </MenuOption> }
                            <MenuOption onSelect={() => props.onPressMenu(order, 'lacak')}>
                                <View style={styles.textMenu}>
                                    <Text>Lacak Kiriman</Text>
                                </View>
                            </MenuOption>
                            <MenuOption onSelect={() => props.onPressMenu(order, 'detail')}>
                                <View style={styles.textMenu}>
                                    <Text>Lihat Detail</Text>
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
									{ order.shippercity }
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
									{ order.desctrans }
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
									{ order.receivercity }
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
									{ order.receivername }
								</Text>
							</View>
						</View>
					</View>
				</View>

                <View style={styles.footer}>
					<Text style={[styles.textItem, {color: '#a3a3a2', flex: 1, marginLeft: 5}]}>
						Dikirim : {order.insertdate.substring(0, 10)}
					</Text>
					<View style={{flex: 1, alignItems: 'flex-end', marginRight: 5}}>
						<Text 
							//ellipsizeMode='tail'
							style={[
								styles.textItem, {
									color: '#a3a3a2'
								}]
							} 
							numberOfLines={1}>Status : {order.lasthistorystatus}
						</Text>
					</View>
				</View>
            </TouchableOpacity>
        </View>
    )
}

Items.propsTypes = {
    order: PropTypes.object.isRequired,
    index: PropTypes.number,
    onPressMenu: PropTypes.func.isRequired
}

export default Items;