import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { ListItem, List, Right, Icon, Left } from 'native-base';
import AnimatedLoader from "react-native-animated-loader";

const ListKecamatan = props => {
	const [listKec, setKec] = useState([]);
	const [loading, setLoading] = useState(true);
	
	useEffect(() => {
		if (props.kota) {
			props.callApi(props.kota)
				.then(res => {
					 setKec(res);
					 setLoading(false)
				})
		}
	}, [props.kota])


	return(
		<View>
			<AnimatedLoader
		        visible={loading}
		        overlayColor="rgba(0,0,0,0.6)"
		        source={require("../../../../assets/images/loader/3098.json")}
		        animationStyle={styles.lottie}
		        speed={1}
		    />
		    { loading &&  <StatusBar backgroundColor="rgba(0,0,0,0.6)"/> }
			<Text style={styles.title}>
				PILIH KECAMATAN
			</Text>
			<List>
				{ listKec.length > 0 && listKec.map((row, index) => (
					<ListItem key={index} onPress={() => props.onChoose(row)}>
						<Left>
		              		<Text>{row.KEC}</Text>
		              	</Left>
		              	<Right>
		                	<Icon name="ios-arrow-forward" />
		              	</Right>
		            </ListItem>
				))}
			</List>
		</View>
	);
}

const styles = StyleSheet.create({
	title: {
		fontFamily: 'Nunito-Bold',
		margin: 10
	},
	list: {
		marginTop: 10
	},
	lottie: {
	    width: 100,
	    height: 100
	}
})

ListKecamatan.propTypes = {
	kota: PropTypes.string.isRequired,
	callApi: PropTypes.func.isRequired,
	onChoose: PropTypes.func.isRequired
}


export default ListKecamatan;