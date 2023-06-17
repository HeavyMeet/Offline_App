import React, { useState, useEffect, useContext, useRef } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { gql, useLazyQuery } from '@apollo/client';
import DropDownContext from '../context/DropDownContext';
import { global } from '../styles/globalStyles';
import { botonesEncabezado } from '../config/botonesEncabezado';
import { useNetInfo } from "@react-native-community/netinfo";

const OBTENER_CURP = gql`
query ObtenerCURP($curpc: String) {
  obtenerCURP(curpc: $curpc) {
    cantidad
    cve_beneficio
    cve_municipio
    cve_periodicidad
    cve_programa
    n_periodo
  }
}`;

const Curp = () => {
  const datacontext = useContext(DropDownContext);
  const { setCurpData, setMunicipio, setPrograma, setBeneficio, setPeriodo, setPeriodicidad, setCantidad, municipios, programas, beneficios, periodos, periodicidads } = datacontext;
  const navigation = useNavigation();
  const value = useRef("x");
  const [ existeCurp ] = useLazyQuery(OBTENER_CURP, { onCompleted: data => {  value.current = data }, onError: err => {value.current= 'x'},
  fetchPolicy: "network-only"});
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [option, setOption] = useState(0);
  const { isConnected } = useNetInfo();  
  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }
  // Request Camera Permission
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      askForCameraPermission();
    });
    return unsubscribe;
  }, [navigation]);
 
  useEffect(() => {
        if(isConnected !== null){
          botonesEncabezado(navigation, CommonActions, isConnected, 0);
        }
  }, [isConnected]);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    let regex = /^[A-Za-z0-9]+$/;
    
    if (data.indexOf('|') !== 18 || regex.test(data.substring(0, data.indexOf('|'))) !==true) {
      setOption(3);
      return;
    }

    setCurpData(data.split('|'));
    const curpc = data.substring(0, data.indexOf('|'));

    await existeCurp({ variables: { curpc }});
    // console.log(value.current.obtenerCURP!==null," coenctado a mongodb es así ")
    if(value.current === "x"){
         setOption(2);
    }else if(value.current.obtenerCURP.cantidad!==null){
   
    const { cantidad, cve_beneficio, cve_municipio, cve_periodicidad, cve_programa, n_periodo } = value.current.obtenerCURP
    const benef = beneficios.find(i => i.ide === cve_beneficio);
    const munic = municipios.find(i => i.ide === cve_municipio);
    const period = periodicidads.find(i => i.ide === cve_periodicidad);
    const progra = programas.find(i => i.ide === cve_programa);
    const perio = periodos.find(i => i.ide === n_periodo);
    const canti = cantidad.toString();
     setBeneficio(benef); setCantidad(canti); setMunicipio(munic); setPeriodicidad(period); setPrograma(progra); setPeriodo(perio);
     setOption(0);
    }else{
      setOption(1);
    }
  }

  const boton = () => {
    let text='Es beneficiario'; let btnText='Siguiente'; let gB = global.button; let gbT = global.buttonText; let b = false;
    switch (option) {
      case 1:
        text = "No es beneficiario";
        btnText = 'Registrar';
        gB = [global.button, { borderColor: 'green' }]
        gbT = [global.buttonText, { color: 'green' }]
        break;
      case 2:
        text = 'Sin Internet: Se usará la base de datos local. Modifique los valores correctos para el usuario.';
        break;
      case 3:
        b = true;  
        text='El código QR es erróneo. Favor de escanear el código QR de un CURP.';
        break;
    }
  
    return (
      <>
        <Text style={global.maintext}>{text}</Text>
        {b == false && 
        <TouchableOpacity
          style={gB}
          onPress={() => navigation.navigate("Menu")}>
          <Text style={gbT}>{btnText}</Text>
        </TouchableOpacity>
        }
      </>
    )
  }

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={global.contenidoCU}>
        <Text>Acceso de permiso a la camara</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={global.contenidoCU}>
        <Text style={{ margin: 10 }}>No tiene accesso a la camara. Dar permisos</Text>
      </View>)
  }

  return (
    <>
      <View style={{flex:0.3}}></View>
      <View style={global.contenidoCU}>
        <View style={global.barcodebox}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ height: 700, width: 700 }} />
        </View>
        <View style={{flex:0.1}}></View>
        <View style={global.contenidoCU2}>
        {scanned &&
          <TouchableOpacity
            style={global.button}
            onPress={() => setScanned(false)}>
            <Text style={global.buttonText}>{'¿Escanear Nuevamente?'}</Text>
          </TouchableOpacity>
        }
        </View>
      </View>
      <View style={[global.botones, {flex:1}]}>
        {scanned ? boton() : <Text style={global.maintext}>{'Aun sin escanear CURP'}</Text>}
      </View>
    </>
  );

}

export default Curp;
