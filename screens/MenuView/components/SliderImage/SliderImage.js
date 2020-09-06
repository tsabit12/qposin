import React from 'react';
import { View, Text } from 'react-native';
import { SliderBox } from "react-native-image-slider-box";

const images = [
    require('../../../../assets/images/slider/2.jpg'),
    require('../../../../assets/images/slider/3.jpg'),
    require('../../../../assets/images/slider/4.jpg'),
    require('../../../../assets/images/slider/5.jpg'),
];

const SliderImage = props => {
	return(
		<SliderBox 
			images={images} 
  			//ImageComponentStyle={{}}
  			resizeMode={'cover'}
  			sliderBoxHeight={240}
			autoplay={true}
  			circleLoop
		/>
	);	
}

export default SliderImage;