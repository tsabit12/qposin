import React from 'react';
import PropTypes from 'prop-types';
import { Modal, StyleSheet, View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen'; 
import { AntDesign } from '@expo/vector-icons';

const styles = StyleSheet.create({
    backgroundModal: {
		backgroundColor: 'rgba(0,0,0,0.5)',
		flex: 1
    },
    modalContainer: {
        backgroundColor: 'white',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		minHeight: hp('20%')
    },
    title: {
        fontFamily: 'Nunito-Bold',
        textAlign: 'center',
        fontSize: 15,
        color: 'white'
    },
    header: {
        backgroundColor: '#C51C16',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: hp('5%'),
        justifyContent: 'center'
    },
    content: {
        flex: 1,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    list: {
        //backgroundColor: 'red',
        flex: 1,
        width: wp('90%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    btn: {
        backgroundColor: '#C51C16',
        width: wp('6%'),
        height: wp('6%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp('6%') / 2
    }
})

const ListSchedule = props => {
    return(
        <View>
             <Modal
                transparent={true}
                visible={props.open}
                animationType='fade'
                onRequestClose={props.handleClose}
            >
                <StatusBar backgroundColor="rgba(0,0,0,0.5)"/>
                    <TouchableWithoutFeedback onPress={props.handleClose}>
                        <View style={styles.backgroundModal} />
                    </TouchableWithoutFeedback>
                    <View style={styles.modalContainer}>
                        <View style={styles.header}>
                            <Text style={styles.title}>
                                PILIH JADWAL PICKUP
                            </Text>
                        </View>
                        <View style={styles.content}>
                            { props.list.length > 0 ? props.list.map(row => <View key={row.id} style={styles.list}>
                                <Text>
                                    {
                                        `Tahap ${row.tahap} (${row.available_pickup_request}) dipickup (${row.schedule_pickup})`
                                    }
                                </Text>
                                <TouchableOpacity style={styles.btn} onPress={() => props.handleChoose(row.id, props.extid)}>
                                    <AntDesign name="arrowright" size={17} color="white" />
                                </TouchableOpacity>
                            </View>) : <Text>Sedang memuat jadwal pickup..</Text>}
                        </View>
                    </View>
            </Modal>  
        </View>
    );
}

ListSchedule.propTypes = {
    list: PropTypes.array.isRequired,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleChoose: PropTypes.func.isRequired,
    extid: PropTypes.array.isRequired //adding this cause its in array
}

export default ListSchedule;