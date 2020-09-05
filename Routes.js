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
  KotaView
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
		        	</React.Fragment> : <React.Fragment>
						<Stack.Screen name="Home" component={HomeScreen} />
						<Stack.Screen name="FormRegister" component={FormRegisterScreen} />
						<Stack.Screen name="Restore" component={PulihkanAkun} />
						<Stack.Screen name="Login" component={LoginView} />
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