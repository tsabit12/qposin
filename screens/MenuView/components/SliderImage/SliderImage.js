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
    require('../../../../assets/images/slider/6.jpg'),
];

// console.log(Math.round(wp('100%')));
// console.log(Math.round(hp('0%')));

const SliderImage = props => {
	return(
		<SliderBox  
			images={images} 
  			ImageComponentStyle={{
          width: wp('100%'),
          // height: hp('35%')
        }}
  			resizeMode={'cover'}
  			sliderBoxHeight={hp('31.6%')}
			  autoplay={true}
  			circleLoop
		/>
	);	
}

export default SliderImage;