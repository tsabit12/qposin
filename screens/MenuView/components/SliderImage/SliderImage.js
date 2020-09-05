import React from 'react';
import { View, Text } from 'react-native';
import { SliderBox } from "react-native-image-slider-box";

const images = [
    "https://source.unsplash.com/1024x768/?nature",
    require('../../../../assets/images/slider/1.jpg')
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