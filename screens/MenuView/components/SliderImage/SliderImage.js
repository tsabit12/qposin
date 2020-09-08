import React from 'react';
import { View, Text } from 'react-native';
import { SliderBox } from "react-native-image-slider-box";
import {
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

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
  			ImageComponentStyle={{
          width: wp('100%'),
          height: hp('32%')
        }}
  			resizeMode={'contain'}
  			sliderBoxHeight={240}
			  autoplay={true}
  			circleLoop
		/>
	);	
}

export default SliderImage;