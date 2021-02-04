import { AsyncStorage } from "react-native"
import api from "./api";

export const setIsSync = (boolValue) => {
    let result = new Promise(async function(resolve, reject){
        try {
            await AsyncStorage.setItem('isSyncWeb', JSON.stringify(boolValue));
            resolve({ success: true });
        } catch (error) {
            reject('(101) Failed saving data to storage');
        }
    })

    return result;
}

export const setCod = (boolValue) => {
    let result = new Promise(async function(resolve, reject){
        try {
            await AsyncStorage.setItem('isCodBaru', JSON.stringify(boolValue));
            resolve({ success: true });
        } catch (error) {
            reject('(101) Failed saving data to storage');
        }
    })

    return result;
}

export const pushUserDataToWeb = (userid, email) => {
    let result = new Promise(function(resolve, reject){
        api.generateToken(userid)
            .then(userSecret => {
                if(userSecret.rc_mess === '00'){ 
                    api.syncronizeUserPwd({ email, pin: userSecret.response_data1 })
                        .then(webResponse => {
                            const { respcode } = webResponse;
                            if(respcode === '00' || respcode === '21'){
                                resolve({
                                    code: 200,
                                    status: true
                                })
                            }else{
                                reject({
                                    errorMsg: webResponse.respmsg,
                                    status: false,
                                    code: respcode,
                                    detail: webResponse
                                })    
                            }
                        })
                        .catch(webErr => {  
                            if(webErr.response){
                                reject({
                                    errorMsg: 'Terdapat kesalahan',
                                    status: false,
                                    code: webErr.response.status,
                                    detail: webErr.response
                                })     
                            }else if(webErr.request){
                                reject({
                                    errorMsg: 'Terdapat kesalahan',
                                    status: false,
                                    code: '301'
                                })
                            }else{
                                reject({
                                    errorMsg: 'Internal server error',
                                    status: false,
                                    code: '501'
                                })
                            }
                        })
                }else{
                    reject({
                        errorMsg: userSecret.desk_mess,
                        status: false,
                        code: `1${userSecret.rc_mess}`
                    })
                }
            })
            .catch(err => {
                if(err.response){
                    reject({
                        errorMsg: 'Terdapat kesalahan',
                        status: false,
                        code: '400'
                    })     
                }else if(err.request){
                    reject({
                        errorMsg: 'Terdapat kesalahan',
                        status: false,
                        code: '300'
                    })
                }else{
                    reject({
                        errorMsg: 'Internal server error',
                        status: false,
                        code: '500'
                    })
                }
            })
    })

    return result;
} 


export const asyncGiro = (userid, email, norek, type) => {
    let result = new Promise(async function(resolve, reject){
        try {
            const getPin = await api.generateToken(userid);
            if(getPin.rc_mess === '00'){
                if(type === 'FULL'){ //sync user & giro
                    api.syncronizeUserPwd({ email, pin: getPin.response_data1 })
                        .then(response => {
                            const { respcode, respmsg } = response;
                            AsyncStorage.setItem('isSyncWeb', JSON.stringify(true));
                            if(respcode === '00' || respcode === '21'){
                                api.syncronizeCod({ email, account: norek })
                                    .then(response => {
                                        const { respcode, respmsg } = response;
                                        if(respcode === '00' || respcode === '21'){//success / is exist
                                            resolve({
                                                status: '00',
                                                msg: 'Syncronize sukses'
                                            })
                                        }else{
                                            reject({
                                                status: respcode,
                                                msg: respmsg
                                            })
                                        }
                                    })
                                    .catch(error => {
                                        if(error.response){
                                            reject({
                                                status: '302',
                                                msg: 'Terdapat kesalahan, silahkan coba beberapa saat lagi'
                                            })
                                        }else if(error.request){
                                            reject({
                                                status: '303',
                                                msg: 'Request error!'
                                            })
                                        }else{
                                            reject({
                                                status: '300',
                                                msg: 'Internal server error'
                                            })
                                        }
                                    })
                            }else{
                                reject({
                                    status: respcode,
                                    msg: respmsg
                                })
                            }
                        })
                        .catch(() => {
                            reject({
                                status: '203',
                                msg: 'Sinkronisasi user gagal!'
                            })
                        })
                }else{ //only giro
                    api.syncronizeCod({ email, account: norek })
                        .then(response => {
                            const { respcode, respmsg } = response;
                            if(respcode === '00' || respcode === '21'){//success / is exist
                                resolve({
                                    status: '00',
                                    msg: 'Syncronize sukses'
                                })
                            }else{
                                reject({
                                    status: respcode,
                                    msg: respmsg
                                })
                            }
                        })
                        .catch(error => {
                            if(error.response){
                                reject({
                                    status: '302',
                                    msg: 'Terdapat kesalahan, silahkan coba beberapa saat lagi'
                                })
                            }else if(error.request){
                                reject({
                                    status: '303',
                                    msg: 'Request error!'
                                })
                            }else{
                                reject({
                                    status: '300',
                                    msg: 'Internal server error'
                                })
                            }
                        })
                }
            }else{
                reject({
                    status: getPin.rc_mess,
                    msg: getPin.desk_mess
                })
            }
        } catch (error) {
            if(error.response){
                reject({
                    status: '102',
                    msg: 'Terdapat kesalahan, silahkan coba beberapa saat lagi'
                })
            }else if(error.request){
                reject({
                    status: '103',
                    msg: 'Request error!'
                })
            }else{
                reject({
                    status: '500',
                    msg: 'Internal server error'
                })
            }
        }
    }) 

    return result;
}