import React from 'react';
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PropTypes from 'prop-types';
import {
  HomeScreen,
  FormRegister as FormRegisterScreen,
  PulihkanAkun,
  LoginView,
  MenuView,
  KotaView,
  ListTarif as ListTarifView,
  ProfileView,
  UbahPinView,
  CompleteRegistrasiView,
  CreatePinView,
  OrderView,
  DataPenerima as DataPenerimaView,
  CityCourier as CityCourierView,
  ScanBarcode as ScanBarcodeView,
  ConnectGiroView,
  ChooseLocation,
  EditAlamatView,
  UpdatePlaystoreView,
  FindDriverView,
  DetailOrder as DetailOrderView,
  ChoosePickup,
  History as HistoryOrderScreen,
  SearchAddress
} from './screens';
import Notification from './Notification';
import { closeMessage } from './redux/actions/message';


const Stack = createStackNavigator();

const Routes = props => {
	const { isLoggedin, updateAvailable, flashMessage } = props; 
	return(
		<React.Fragment>
			<NavigationContainer>
				{ !updateAvailable ? 
					<Stack.Navigator 
			          initialRouteName="Home"
			          screenOptions={{
			            headerShown: false
			          }}
			        >
			        	{ isLoggedin ? <React.Fragment>
			        		<Stack.Screen name="Home" component={MenuView} />
			        		<Stack.Screen name="Restore" component={PulihkanAkun} />
			        		<Stack.Screen name="Kota" component={KotaView} />
			        		<Stack.Screen name="Tarif" component={ListTarifView} />
			        		<Stack.Screen name="Profile" component={ProfileView} />
			        		<Stack.Screen name="Ubahpin" component={UbahPinView} />
			        		<Stack.Screen name="Order" component={OrderView} />
			        		<Stack.Screen name="DataPenerima" component={DataPenerimaView} />
			        		<Stack.Screen name="CityCourier" component={CityCourierView} />
			        		<Stack.Screen name="ScanBarcode" component={ScanBarcodeView} />
			        		<Stack.Screen name="ConnectGiro" component={ConnectGiroView} />
			        		<Stack.Screen name="History" component={HistoryOrderScreen} />
			        		<Stack.Screen name="UpdateAlamat" component={EditAlamatView} />
			        		<Stack.Screen name="Bidding" component={FindDriverView} />
			        		<Stack.Screen name="DetailOrder" component={DetailOrderView} />
			        		<Stack.Screen name="ChoosePickup" component={ChoosePickup} />
			        		<Stack.Screen name="ChooseLocation" component={ChooseLocation} />
							<Stack.Screen name="SearchAddress" component={SearchAddress}/>
			        	</React.Fragment> : <React.Fragment>
							<Stack.Screen name="Home" component={HomeScreen} />
							<Stack.Screen name="FormRegister" component={FormRegisterScreen} />
							<Stack.Screen name="Restore" component={PulihkanAkun} />
							<Stack.Screen name="Login" component={LoginView} />
							<Stack.Screen name="CompleteRegistrasi" component={CompleteRegistrasiView} />
							<Stack.Screen name="CreatePin" component={CreatePinView} />
			        	</React.Fragment> }
			        </Stack.Navigator> 
			        : 
		        	<Stack.Navigator
		        		initialRouteName="Home"
				        screenOptions={{
				            headerShown: false
				        }}
		        	>
		        		<Stack.Screen name="Home" component={UpdatePlaystoreView} />
		        	</Stack.Navigator>
		       	}
		    </NavigationContainer>
			<Notification 
				variant={flashMessage.variant}
				message={flashMessage.msg}
				open={flashMessage.open}
				onClose={props.closeMessage}
			/>
	    </React.Fragment>
	);
}


Routes.propTypes = {
	isLoggedin: PropTypes.bool.isRequired,
	updateAvailable: PropTypes.bool.isRequired,
	flashMessage: PropTypes.object.isRequired,
	closeMessage: PropTypes.func
}

function mapStateToProps(state) {
	return{
		isLoggedin: state.auth.logged,
		flashMessage: state.message 
	}
}

export default connect(mapStateToProps, { closeMessage })(Routes);