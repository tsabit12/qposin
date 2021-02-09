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

const defaultPayload = {
    startdate: '2019-07-01',
    enddate: getDateFormat(new Date(), 'YYYY-MM-DD'),
    extid: '',
    status: '0',
    limitawal: 0,
    limitakhir: 10 
}

const History = props => {
    const { user } = props;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                defaultPayload.email = user.email;
                const getOrder = await props.getQob(defaultPayload);
                console.log(getOrder);
            } catch (error) {
                console.log(error);
            }

            setLoading(false);
        })();
        
    }, []);

    return(
        <View style={{flex: 1}}>
            <HeaderComponent 
                onClickBack={() => props.navigation.goBack()} 
                title='History Kiriman'
            />
            
            <LoadingComponent 
                loading={loading} 
            />
            
            <View style={styles.centered}>
                
            </View>
        </View>
    )
}

History.propTypes = {
    user: PropTypes.object.isRequired,
    getQob: PropTypes.func.isRequired
}

function mapStateToProps(state){
    return{
        user: state.auth.localUser
    }
}

export default connect(mapStateToProps, { 
    getQob
})(History);