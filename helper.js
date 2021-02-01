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