import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { ListItem, List, Right, Icon, Left } from 'native-base';

const ListKecamatan = props => {
	const [listKec, setKec] = useState([]);
	
	useEffect(() => {
		if (props.kota) {
			props.callApi(props.kota)
				.then(res => {
					 setKec(res);
				})
		}
	}, [props.kota])


	return(
		<View>
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
	}
})

ListKecamatan.propTypes = {
	kota: PropTypes.string.isRequired,
	callApi: PropTypes.func.isRequired,
	onChoose: PropTypes.func.isRequired
}


export default ListKecamatan;