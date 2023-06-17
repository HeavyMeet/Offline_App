import React,{ useEffect, useContext } from 'react';
import DropDownContext from '../context/DropDownContext';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { botonesEncabezado } from '../config/botonesEncabezado';
import { useNetInfo } from "@react-native-community/netinfo";

const Menu = () => {
     const valuec = useContext(DropDownContext);
     const { picker } = valuec;
     const navigation = useNavigation();
     const { isConnected } = useNetInfo();  
     useEffect(() => {
      if(isConnected !== null){
        botonesEncabezado(navigation, CommonActions, isConnected);
      }
  }, [isConnected]);
    
  return (
    <>
    {picker()}
   </>
);
}

export default Menu;


