import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import {
    HeaderComponent,
    LoadingComponent
} from '../components';
import { getDateFormat } from '../../helper';
import { connect } from 'react-redux';
import { getQob } from '../../redux/actions/history';
import { addMessage } from '../../redux/actions/message';
import { EmptyMessage, ListLacak, ListOrder } from './components';
import api from '../../api';

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
    const [tracks, setTracks] = useState({ data: [], id: '' });

    useEffect(() => {
        (async () => {
            try {
                //defaultPayload.email = user.email;
                defaultPayload.email = "abdul@gmail.com";
                await props.getQob(defaultPayload);
            } catch (error) {
                props.addMessage('Internal server error', 'error');
            }

            setLoading(false);
        })();
        
    }, []);

    const handleClickLacak = async (extid) => {
        setLoading(true);

        try {
            const tracks = await api.lacakKiriman(extid)
            setTracks({ data: tracks, id: extid });
        } catch (error) {
            if(error.response){
                const { data, status } = error.response;
                props.addMessage(`(${status}) ${data.errors.global}`, 'error');
            }else if(error.request){
                props.addMessage(`(080) Request error!`, 'error');
            }else{
                props.addMessage(`(500) Internal server error`, 'error');
            }
        }
        
        setLoading(false);
    }

    return(
        <View style={{flex: 1}}>
            <HeaderComponent 
                onClickBack={() => props.navigation.goBack()} 
                title='History Kiriman'
            />
            
            <LoadingComponent 
                loading={loading} 
            />

            { list.length <= 0 ? <EmptyMessage 
                    onClickOrder={() => props.navigation.replace('Order', { type: 2 })}
                /> : 
                <ListOrder 
                    orderList={list}
                    onClickDetail={(value) => props.navigation.navigate('DetailOrder', {
						order: value
                    })}
                    onClickLacak={handleClickLacak}
                /> }

            { tracks.data.length > 0 && <ListLacak 
                data={tracks.data}
                extid={tracks.id}
                onClose={() => setTracks({ data: [] })} 
            /> }
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