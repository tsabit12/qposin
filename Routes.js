import React from 'react';
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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
  CityCourier as CityCourierView
} from './screens';


const Stack = createStackNavigator();

const Routes = props => {
	const { isLoggedin } = props; 
	return(
		<React.Fragment>
			<NavigationContainer>
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
		        	</React.Fragment> : <React.Fragment>
						<Stack.Screen name="Home" component={HomeScreen} />
						<Stack.Screen name="FormRegister" component={FormRegisterScreen} />
						<Stack.Screen name="Restore" component={PulihkanAkun} />
						<Stack.Screen name="Login" component={LoginView} />
						<Stack.Screen name="CompleteRegistrasi" component={CompleteRegistrasiView} />
						<Stack.Screen name="CreatePin" component={CreatePinView} />
		        	</React.Fragment> }
		        </Stack.Navigator>
		    </NavigationContainer>
	    </React.Fragment>
	);
}

function mapStateToProps(state) {
	return{
		isLoggedin: state.auth.logged
	}
}

export default connect(mapStateToProps, null)(Routes);