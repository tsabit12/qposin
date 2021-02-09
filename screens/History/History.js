import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import styles from './styles';
import {
    HeaderComponent,
    LoadingComponent
} from '../components';
import { getDateFormat } from '../../helper';
import { connect } from 'react-redux';
import { getQob } from '../../redux/actions/history';
import { addMessage } from '../../redux/actions/message';
import { EmptyMessage } from './components';

const defaultPayload = {
    startdate: '2019-07-01',
    enddate: getDateFormat(new Date(), 'YYYY-MM-DD'),
    extid: '',
    status: '0',
    limitawal: 0,
    limitakhir: 10 
}

const History = props => {
    const { user, list } = props;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                defaultPayload.email = user.email;
                await props.getQob(defaultPayload);
            } catch (error) {
                props.addMessage('Internal server error', 'error');
            }

            setLoading(false);
        })();
        
    }, []);

    console.log(props.list);

    return(
        <View style={{flex: 1}}>
            <HeaderComponent 
                onClickBack={() => props.navigation.goBack()} 
                title='History Kiriman'
            />
            
            <LoadingComponent 
                loading={loading} 
            />
            { list.length <= 0 ? 
                <EmptyMessage 
                    onClickOrder={() => props.navigation.replace('Order', { type: 2 })}
                /> : <View><Text>ok</Text></View>}
        </View>
    )
}

History.propTypes = {
    user: PropTypes.object.isRequired,
    getQob: PropTypes.func.isRequired,
    addMessage: PropTypes.func.isRequired,
    list: PropTypes.array.isRequired
}

function mapStateToProps(state){
    return{
        user: state.auth.localUser,
        list: state.history.qob
    }
}

export default connect(mapStateToProps, { 
    getQob,
    addMessage
})(History);