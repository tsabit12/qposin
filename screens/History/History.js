import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';
import {
    HeaderComponent
} from '../components';

const History = props => {
    return(
        <View style={{flex: 1}}>
            <HeaderComponent 
                onClickBack={() => props.navigation.goBack()} 
                title='History Kiriman'
            />
            <View style={styles.centered}>
                <Text>Hello world</Text>
            </View>
        </View>
    )
}

export default History;