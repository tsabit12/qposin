import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../../api';
import styles from './styles';
import { ListComponent } from './components';
import { CommonActions } from '@react-navigation/native';

const SearchAddress = props => {
    const [param, setParam] = useState('');
    const [label, setLabel] = useState('Cari nama jalan atau kecamatan atau kota diatas');
    const [list, setList] = useState([]);

    useEffect(() => {
        if(param){
            const timeId = setTimeout(() => {
                setLabel('Loading...');
                setList([]);
                api.google.findLatlongbyAddres(param)
                    .then(addres => setList(addres))
                    .catch(() => setLabel(`Tidak ditemukan hasil untuk ${param}`)); 
            }, 1000);

            return () => clearTimeout(timeId);
        }
    }, [param]);

    const handleChoose = (value) => {
        props.navigation.dispatch(state => {
            //remove current route
            const routes    = state.routes.filter(r => r.name !== 'SearchAddress');
            const newRoutes = [];
            
            routes.forEach(route => {
                if(route.name === 'ChooseLocation'){ //add lat long
                    newRoutes.push({
                        ...route,
                        params: {
                            ...route.params,
                            coordinate: value.location
                        }
                    })
                }else{
                    newRoutes.push(route);
                }
            });

            return CommonActions.reset({
                ...state,
                routes: newRoutes,
			    index: routes.length - 1,
            })
        })
    }

    return(
        <View style={styles.root}>
            <View style={styles.header}>
                <View style={styles.input}>
                    <TextInput 
                        placeholder='Cari jalan/kecamatan/kota...'    
                        autoFocus={true}
                        value={param}
                        style={{flex: 1}}
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
            { list.length > 0 ? <ListComponent 
                data={list}
                onChooseAddres={handleChoose}
            /> : <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}> 
                <Text>{label}</Text>
            </View> }
        </View>
    )
}

export default SearchAddress;