import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { HeaderComponent, LoadingAnimatedComponent } from '../components';
import * as Location from 'expo-location';
import { CustomMarkerLabel, ListSchedule } from './components';
import api from '../../api';
import styles from './styles';
import { connect } from 'react-redux';
import { getSchedule } from '../../redux/actions/schedule';
import { updateNomorPickup } from '../../redux/actions/history';
import { addMessage } from '../../redux/actions/message';

const { height, width } = Dimensions.get( 'window' );
const LATITUDE          = -7.419420;
const LOGITUDE          = 112.680573;
const LATITUDE_DELTA    = 0.02;
const LONGITUDE_DELTA   = LATITUDE_DELTA * (width / height);

const ChooseLocation = props => {
    const { user, route } = props;
    const [coordinates] = useState(new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LOGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    }))
    const [region, setRegion] = useState({
        latitude: LATITUDE,
        longitude: LOGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    })
    const [subtitle, setSubtitle] = useState('Loading...');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if(status === 'granted'){
                getCurrentPosition();
            }
        })();
    }, []);

    useEffect(() => {
        if(open){
            props.getSchedule({ id: ''});
        }
    }, [open]);

    useEffect(() => {
        if(route.params.coordinate){
            const { lat, lng } = route.params.coordinate;
            coordinates.timing({
                latitude: lat,
                longitude: lng,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }).start();

            setRegion(region => ({
                ...region,
                latitude: lat,
                longitude: lng
            }))
        }
    }, [route]);

    const getCurrentPosition = async () => {
        try {
            const curloc = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High});
            const { longitude, latitude } = curloc.coords;
            coordinates.timing({
                latitude,
                longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }).start();

            setRegion(region => ({
                ...region,
                latitude,
                longitude
            }))
            
        } catch (error) {
            console.log(error); 
        }
    }
    
    const onCompleteChangesRegion = async (location) => {
        setRegion(location); 
        try {
            const addres = await api.google.getAddres({ latitude: location.latitude, longitude: location.longitude });
            setSubtitle(`${addres.kota} ${addres.kecamatan} (${addres.street})`);
        } catch (error) {
            setSubtitle('Error');
        }
    }

    const handlePickup = async (jadwalId) => {
        setLoading(true);
        setOpen(false);

        const payload = {
            pickupstatus: '1',
            pickupdate: jadwalId,
            email: user.email,
            latitude: region.latitude,
            longitude: region.longitude,
            address: subtitle,
            data: props.route.params.extid
        }

        try {
            const pickup = await api.qob.requestPickup(payload);
            if(pickup.respcode === '000'){
                props.addMessage(`(000) ${pickup.respmsg}`, 'success');
                //remove key object in array
                const groupExtid = [];
                props.route.params.extid.forEach(row => {
                    groupExtid.push(row.extid);
                });
                props.updateNomorPickup(pickup.transref, groupExtid);

                setTimeout(() => {
                    props.navigation.goBack();
                }, 100);
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

    return(
        <View style={{flex: 1}}>
            <HeaderComponent 
                title='Pilih lokasi pickup'
                subtitle={subtitle}
                onClickBack={() => props.navigation.goBack()}
                searching={true}
                onSearch={() => props.navigation.push("SearchAddress")}
            />
            <MapView
                region={region}
                onRegionChange={(loc) => coordinates.timing(loc).start()}
                onRegionChangeComplete={onCompleteChangesRegion}
                style={{flex: 1}}
            >
                <Marker.Animated coordinate={coordinates}>
                    <CustomMarkerLabel />
                </Marker.Animated>
            </MapView>

            <LoadingAnimatedComponent 
                loading={loading}
            />

            <ListSchedule 
                open={open}
                list={props.schedules}
                handleChoose={handlePickup}
                handleClose={() => setOpen(false)}
            />
            
            {!open && !loading && <View style={styles.btnContainer}>
                <TouchableOpacity 
                    style={styles.btn}
                    activeOpacity={0.7}
                    onPress={() => setOpen(true)}
                >
                    <Text style={styles.title}>SELANJUTNYA</Text>
                </TouchableOpacity>
            </View> }
        </View>
    )
}

ChooseLocation.propTypes = {
    route: PropTypes.shape({
        params: PropTypes.shape({
            extid: PropTypes.array.isRequired,
            coordinate: PropTypes.object
        }).isRequired
    }).isRequired,
    schedules: PropTypes.array.isRequired,
    getSchedule: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    updateNomorPickup: PropTypes.func.isRequired,
    addMessage: PropTypes.func.isRequired
}

function mapStateToProps(state){
    return {
        schedules: state.schedule,
        user: state.auth.localUser
    }
}

export default connect(mapStateToProps, { 
    getSchedule,
    updateNomorPickup,
    addMessage 
})(ChooseLocation);