import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../../api';
import styles from './styles';

const SearchAddress = props => {
    const [param, setParam] = useState('');
    const [label, setLabel] = useState('Cari nama jalan atau kecamatan atau kota diatas');

    useEffect(() => {
        if(param){
            const timeId = setTimeout(() => {
                getAddress();
            }, 1000);

            return () => clearTimeout(timeId);
        }
    }, [param]);

    const getAddress = async () => {
        setLabel('Loading...');

        try {
            const address = await api.google.findLatlongbyAddres(param);
            console.log(address);
        } catch (error) {
            console.log(error);
        }

        setLabel('Something wrong');
    }

    return(
        <View style={styles.root}>
            <View style={styles.header}>
                <View style={styles.input}>
                    <TextInput 
                        placeholder='Cari jalan/kecamatan/kota...'    
                        autoFocus={true}
                        value={param}
                        onChangeText={(text) => setParam(text)}
                    />
                    <TouchableOpacity 
                        style={styles.closeIcon}
                        onPress={() => props.navigation.goBack()}
                    >
                        <Icon name='close' style={{color: 'black', fontSize: 25}} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}> 
                <Text>{label}</Text>
            </View> 
        </View>
    )
}

export default SearchAddress;