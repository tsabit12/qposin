import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import md5 from "react-native-md5";
import styles from '../../styles';
import { Icon } from 'native-base';

const Items = props => {
    const { row } = props;
    return(
        <TouchableOpacity 
            style={styles.list}
            onPress={() => props.onChoose(row)}
        >
            <Text numberOfLines={1} style={styles.text}>{row.label}</Text>
            <View style={styles.iconContent}>
                <Icon name='arrow-forward' style={styles.iconList} />
            </View>
        </TouchableOpacity>
    )
}

Items.propTypes = {
    row: PropTypes.object.isRequired,
    onChoose: PropTypes.func.isRequired
}

const ListComponent = props => {
    const renderItem = ({ item, index }) => (
        <Items 
            row={item}
            onChoose={props.onChooseAddres}
        />
    )

    return(
        <FlatList 
            data={props.data}
            renderItem={renderItem}
            keyExtractor={item => md5.hex_md5(item.label)}
        />
    )
}

ListComponent.propTypes = {
    data: PropTypes.array.isRequired,
    onChooseAddres: PropTypes.func.isRequired
}

export default ListComponent;