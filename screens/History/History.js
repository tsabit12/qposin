import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import {
    HeaderComponent,
    LoadingComponent
} from '../components';
import { getDateFormat } from '../../helper';
import { connect } from 'react-redux';
import { 
    getQob, 
    resetHistory, 
    setChoosed, 
    removeAllChoosed,
    removeItem
} from '../../redux/actions/history';
import { getSchedule } from '../../redux/actions/schedule';
import { addMessage } from '../../redux/actions/message';
import { ButtonPickup, EmptyMessage, ListLacak, ListOrder, ListSchedule } from './components';
import api from '../../api';

const PER_PAGE = 5;

const defaultPayload = {
    startdate: '2019-07-01',
    enddate: getDateFormat(new Date(), 'YYYY-MM-DD'),
    extid: '',
    status: '0'
}

const History = props => {
    const { user, list } = props;
    const [loading, setLoading] = useState(true);
    const [tracks, setTracks] = useState({ data: [], id: '' });
    const [limit, setLimit] = useState({
        awal: 1,
        akhir: 5
    })
    //handle onEndReached end cause we dont have total data
    const [isFinish, setFinish] = useState(false);
    const [refreshLoading, setRefresh] = useState(false);
    const [showJadwal, setShowJadwal] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    //bad.. and must change in the future
    useEffect(() => {
        return () => props.resetHistory();
    }, []);

    useEffect(() => {
        if(showJadwal.length > 0){
            props.getSchedule({ id: ''});
        }
    }, [showJadwal]);

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

    const handleGetNewData = () => {
        if(!isFinish){
           getData();
        }
    }

    const onRefresh = async () => {
        setRefresh(true);

        await props.resetHistory();

        await getData('refresh');

        setRefresh(false);
    }

    const getData = async (type) => {
        setLoading(true);

        if(type === 'refresh' && isFinish){
            setFinish(false);
        }

        try {
            defaultPayload.email = user.email;
            // defaultPayload.email = 'abdul@gmail.com';
            defaultPayload.limitawal = type === 'refresh' ? 1 : limit.awal;
            defaultPayload.limitakhir = type === 'refresh' ? 5 : limit.akhir;
            const getOrder = await props.getQob(defaultPayload);

            if(getOrder.orders.length >= PER_PAGE){
                setLimit(limit => ({
                    ...limit,
                    awal: defaultPayload.limitawal + PER_PAGE,
                    akhir: defaultPayload.limitakhir + PER_PAGE
                }))
            }else{
                setFinish(true);
            }
        } catch (error) {
            props.addMessage('Internal server error', 'error');
        }

        setLoading(false);
    }

    const onChooseJadwal = async (jadwalId, value) => {
        setShowJadwal([]);
        setLoading(true);

        const payload = {
            pickupstatus: '1',
            pickupdate: jadwalId,
            email: user.email,
            data: value
        }
        
        try {
            const pickup = await api.qob.requestPickup(payload);
            if(pickup.respcode === '000'){
                props.addMessage(`(000) ${pickup.respmsg}`, 'success');
                props.removeAllChoosed();
			}else{
				props.addMessage(`(${pickup.respcode}) ${pickup.respmsg}`, 'error');
			}
        } catch (error) {
            if(error.response){
                props.addMessage(`(410) Terdapat kesalahan`, 'error');
            }else if(error.request){
                props.addMessage(`(400) Request error`, 'error');
            }else{
                props.addMessage(`(500) Internal server error`, 'error');
            }
        }

        setLoading(false);

    }

    const handleRemoveItem = async (extid, status) => {
        setLoading(true);
        const payload = {
            email: user.email,
            extid,
            status
        }

        console.log(payload);

        try {
            const cancel = await api.removeOrder(payload);
            console.log(cancel);
            if(cancel.respcode === "00"){
                props.removeItem(extid, status);
                props.addMessage(`${extid} berhasil dibatalkan`, 'success');
            }else{
                props.addMessage(`(${cancel.respcode}) ${cancel.respmsg}`, 'error');
            }
        } catch (error) {
            if(error.response){
                props.addMessage(`(410) Terdapat kesalahan`, 'error');
            }else if(error.request){
                props.addMessage(`(400) Request error`, 'error');
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
            
            { !refreshLoading && <LoadingComponent loading={loading} />}

            { list.length <= 0 && !loading ? <EmptyMessage 
                    onClickOrder={() => props.navigation.replace('Order', { type: 2 })}
                /> : <ListOrder 
                    orderList={list}
                    onClickDetail={(value) => props.navigation.navigate('DetailOrder', {
                        order: value
                    })}
                    onClickLacak={handleClickLacak}
                    getNewData={handleGetNewData}
                    refreshLoading={refreshLoading}
                    handeleRefresh={onRefresh}
                    onPickup={(arrId) => setShowJadwal(arrId)}
                    onChooseItem={props.setChoosed}
                    removeItem={handleRemoveItem}
                /> }

            { tracks.data.length > 0 && <ListLacak 
                data={tracks.data}
                extid={tracks.id}
                onClose={() => setTracks({ data: [] })} 
            /> }

            <ListSchedule 
                open={showJadwal.length > 0 ? true : false }
                list={props.schedules}
                extid={showJadwal}
                handleClose={() => setShowJadwal([])}
                handleChoose={onChooseJadwal}
            />

            { list.filter(row => row.choosed === true).length > 0 && 
                <ButtonPickup 
                    total={list.filter(row => row.choosed === true).length}
                    onClose={props.removeAllChoosed}
                    onClick={() => {
                        const getChoosed = list.filter(row => row.choosed === true);
                        const arrExtid  = [];
                        getChoosed.forEach(element => {
                            arrExtid.push({ extid: element.extid });
                        });

                        setShowJadwal(arrExtid);
                    }}
                /> }
        </View>
    )
}

History.propTypes = {
    user: PropTypes.object.isRequired,
    getQob: PropTypes.func.isRequired,
    addMessage: PropTypes.func.isRequired,
    list: PropTypes.array.isRequired,
    resetHistory: PropTypes.func.isRequired,
    schedules: PropTypes.array.isRequired,
    getSchedule: PropTypes.func.isRequired,
    setChoosed: PropTypes.func.isRequired,
    removeAllChoosed: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired
}

function mapStateToProps(state){
    return{
        user: state.auth.localUser,
        list: state.history.qob,
        schedules: state.schedule
    }
}

export default connect(mapStateToProps, { 
    getQob,
    addMessage,
    resetHistory,
    getSchedule,
    setChoosed,
    removeAllChoosed,
    removeItem
})(History);