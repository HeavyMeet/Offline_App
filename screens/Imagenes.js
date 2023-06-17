import React, { useEffect, useContext } from 'react';
import { Text, StyleSheet, View, ImageBackground, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import DropDownContext from '../context/DropDownContext';
import {global} from '../styles/globalStyles';
import { Icon } from 'react-native-elements';
import { botonesEncabezado } from '../config/botonesEncabezado';
import { useNetInfo } from "@react-native-community/netinfo";

const Curpp = () => { 
  const datacontext = useContext(DropDownContext);
  const {fotos,setFotos} = datacontext; 
  const navigation = useNavigation();
  const { isConnected } = useNetInfo();  
  
  useEffect(() => {
    if(isConnected !== null){
      botonesEncabezado(navigation, CommonActions, isConnected);
    }
}, [isConnected]);
  
  const accesoBoton = () => {
    if(fotos.length === 2){
    return <>{ToastAndroid.show('¡Se necesita eliminar una foto para agregar otra!', ToastAndroid.SHORT)}</>
    }else{
    navigation.push("Camera");
    }
  }

 return (
   <>
   {fotos.length === 0 ? 
   <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
   <Text style={{fontSize: 20}}>No hay fotos para mostrar</Text>
   </View>
       :
       <ScrollView style={styles.parentScrollViewStyle}>
         <ScrollView horizontal={true} contentContainerStyle={styles.childScrollViewStyle}>
           {fotos.map(i => (
             <ImageBackground key={i[0]} style={{ height: 550, width: 450 }} source={{ uri: i[1] }} resizeMode='contain'>
               <View style={{ width: '100%', flexDirection: 'row' }}>
                 <TouchableOpacity
                   style={[global.button, { backgroundColor: 'red', borderColor: 'white', borderWidth: 2, top: -15, left: 15 }]}
                   onPress={() => {
                     let fa = fotos.filter(item => item !== i)
                     if (fotos.length == 1) { setFotos([]) } else { setFotos([...fa]) }
                   }}>
                   <Icon name="trash-2" size={30} type='feather' color="white" />
                 </TouchableOpacity>
               </View>
             </ImageBackground>
           ))}
         </ScrollView>
       </ScrollView>
   }
     <View style={{  width: '100%',flexDirection:'row',justifyContent:'center'}}>
          <TouchableOpacity
                 style={[global.button]} onPress={()=> navigation.goBack()}>
                 <Text style={[global.buttonText]}>REGRESAR</Text>       
                 </TouchableOpacity>
                 <TouchableOpacity
                 style={[global.button]} onPress={()=> accesoBoton()}>
                 <Text style={[global.buttonText]}>CÁMARA</Text>       
                 </TouchableOpacity>
                 </View>
    </>
 );

}

const styles = StyleSheet.create({
  parentScrollViewStyle: {
      // height: height-300,
      borderWidth: 1,
      borderColor: '#D3D3D3'
  },
  childScrollViewStyle: {
      borderWidth: 1,
      borderColor: '#D3D3D3'
  },
  gridStyle: {
      width: '100%',
      marginTop: 20
  },
  cell: {
    width: '100%',
     color: '#DDDDDD',
    borderColor: 'gray',
    padding: 7,
    fontSize: 20
  },
  cell1: {
    width: '100%',
     color: '#c1c1c1',
    padding: 7,
    fontSize: 20,
    fontWeight: 'bold'
  },
  title: {
    width: '100%',
    color: '#efefef',
    borderColor: '#efefef',
    padding: 7,
    fontSize: 20,
    fontWeight: 'bold'
  }
})

export default Curpp;
