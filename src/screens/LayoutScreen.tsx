import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';



function LayoutScreen(): React.JSX.Element {


  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Layout Screen
      </Text>


      <Text style={styles.text}>
        Đây là màn hình Layout của bài 6
      </Text>


    </View>

  );

}



const styles = StyleSheet.create({

  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#ffffff',
  },


  title:{
    fontSize:24,
    fontWeight:'bold',
    marginBottom:10,
  },


  text:{
    fontSize:16,
    color:'#666',
  },


});



export default LayoutScreen;