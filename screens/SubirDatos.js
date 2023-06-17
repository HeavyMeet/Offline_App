import React, { useState, useEffect, useContext, useRef } from 'react';
import { Alert, ActivityIndicator, View, StyleSheet, TextInput, TouchableOpacity, Text, ScrollView, ToastAndroid } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { gql, useMutation } from '@apollo/client';
import { ReactNativeFile } from 'apollo-upload-client';
import * as mime from 'react-native-mime-types';
import DropDownContext from '../context/DropDownContext';
import db from '../config/dbOffline';
import * as Location from 'expo-location';
import { global } from '../styles/globalStyles';
import { DataTable } from 'react-native-paper';
import { useNetInfo } from "@react-native-community/netinfo";
import { botonesEncabezado } from '../config/botonesEncabezado';
import AsyncStorage from '@react-native-async-storage/async-storage';

let foto = []; let fotox = [];

function generateRNFile(uri, name) {
  const names = name;
  const t = mime.lookup(uri);
  const types = t.substring(t.indexOf("/") + 1);
  fotox.push(names + '.' + types);
  return uri ? new ReactNativeFile({
    uri,
    type: mime.lookup(uri) || 'image',
    name
  }) : null;
}

const UPLOAD_IMAGE = gql`mutation MultipleUpload($foto: [Upload]) {
  multipleUpload(foto: $foto) 
}`;

const NUEVO_BENEFICIARIO = gql`
      mutation NuevoBeneficiario($input: BeneficiarioInput) {
        nuevoBeneficiario(input: $input)
      } 
`;

const SubirDatos = () => {
  const valuec = useContext(DropDownContext);
  const { periodo, programa, periodicidad, beneficio, cantidad, municipio, curpData, fotos, tarjeta, setTarjeta, setFotos } = valuec;
  let [CURP, , AP, AM, nombres, , fec_nac] = curpData;
  const navigation = useNavigation();
  const [showUser, setShowUser] = useState([]);
  const [showProgram, setShowProgram] = useState([]);
  const { isConnected } = useNetInfo();
  // State del formulario
  const [uploadImage] = useMutation(UPLOAD_IMAGE);
  const [longitud, setLongitud] = useState(0);
  const [latitud, setLatitud] = useState(0);
  const [flag, setFlag] = useState(false);
  const [indice, setIndice] = useState(0);
  const conn = useRef(true);
  // Mutation de apollo
  const [nuevoBeneficiario] = useMutation(NUEVO_BENEFICIARIO);

  useEffect(() => {
    const initdb = async () => {
      try {
        await db.init();
      } catch (e) {
        console.log(e)
      }
    }
    initdb();
  }, []);

  useEffect(() => {
    if (isConnected === true) {
      const coordenadas = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLatitud(location.coords.latitude);
        setLongitud(location.coords.longitude);
        AsyncStorage.setItem("latitud", JSON.stringify(location.coords.latitude))
        AsyncStorage.setItem("longitud", JSON.stringify(location.coords.longitude))
      }
      coordenadas();
    } else if (isConnected === false) {
      const sinCoordenadas = async () => {
        setLatitud(parseFloat(await AsyncStorage.getItem('latitud')));
        setLongitud(parseFloat(await AsyncStorage.getItem('longitud')));
      }
      sinCoordenadas();
    }
  }, [isConnected]);

  useEffect(() => {
    if (municipio === null || programa === null || beneficio === null || periodo === null || periodicidad === null || cantidad === null) {
      Alert.alert('Los valores seleccionados en el menú aparecen como nulos.', 'Cierre la aplicación y vuélvala a abrir. Si eso no funciona, necesita cargar de nuevo el menú de la aplicación conectado a Internet para guardar correctamente'
        + ' los valores en el cache y así utilizarlos la proxima vez que se quede sin conexión', [
        {
          text: 'OK', onPress: () => regresarQR()
        }]
      )
    } else {
      const nombrec = AP + " " + AM + " " + nombres;
      setShowUser([[1, 'Curp: ' + CURP], [2, 'Nombre: ' + nombrec], [3, 'Fecha Nac: ' + fec_nac], [4, 'Municipio: ' + municipio.val]]);
      setShowProgram([[1, 'Programa: ', programa.val], [2, 'Beneficio: ', beneficio.val],
      [3, 'Periodo: ', periodo.val], [4, 'Periodicidad: ', periodicidad.val], [5, 'Cantidad: ', cantidad]]);
    }
  }, [municipio, programa, beneficio, periodo, periodicidad, cantidad]);

  useEffect(() => {
    if (isConnected !== null) {
      botonesEncabezado(navigation, CommonActions, isConnected);
    }
  }, [isConnected]);
  
  const saveData = async () => {

    setFlag(true);
    if (tarjeta === '') {
      setFlag(false);
      ToastAndroid.show('Falta llenar número de tarjeta', ToastAndroid.SHORT);
      return;
    }
    else if (fotos.length <= 1) {
      setFlag(false);
      ToastAndroid.show('Faltan agregar fotos', ToastAndroid.SHORT);
      return;
    }
    else if (cantidad === '') {
      setFlag(false);
      ToastAndroid.show('Falta llenar la cantidad del beneficio en el menú', ToastAndroid.SHORT);
      return;
    }

    const benef = beneficio.ide; const muni = municipio.ide; const period = periodo.ide; const periodici = periodicidad.ide; const program = programa.ide;
    let valoresUsuario = [period, program, curpData, muni, latitud, longitud, benef, cantidad, periodici, tarjeta, fotos]
    if (isConnected === true) {
      fotos.forEach(fot => {
        const random = Math.random().toString(36).substr(2);
        const fecha = Date.now().toString(36)
        let randate = fecha + random;

        foto.push(generateRNFile(fot[1], `picture-${randate}`));
      })

      try {
        await uploadImage({
          variables: { foto }
        });

      } catch (error) {
        conn.current = false;
        ToastAndroid.show(error.message.replace('GraphQL error: ', ''), ToastAndroid.SHORT);
      }
      const foto_ref1 = fotox;
      try {
        const count = await db.notEmpty()
        if (count.result !== 0) {
          foto = []; fotox = [];
          const v = await db.find();
          console.log(v, " vvv ")
          for (let i = 0; i < count.result; i++) {
            try {
            [v[i].foto1, v[i].foto2].forEach(fot => {
                const random = Math.random().toString(36).substr(2);
                const fecha = Date.now().toString(36)
                let randate = fecha + random;
                foto.push(generateRNFile(fot, `picture-${randate}`));
              })
              
                await uploadImage({
                  variables: { foto }
                });

              } catch (error) {
                conn.current = false;
                ToastAndroid.show(error.message.replace('GraphQL error: ', ''), ToastAndroid.SHORT);
              }
              const curpDat = [v[i].curp, "", v[i].ap, v[i].am, v[i].nombres, "", v[i].fec_nac, "", v[i].cve_lugar_nac, ""]
              const valoresUsuarix = [v[i].period, v[i].program, curpDat, v[i].muni, v[i].latitud, v[i].longitud, v[i].benef, v[i].cantidad, v[i].periodici, v[i].tarjeta, fotox]
              
              await submitInformacion(nuevoBeneficiario, ...valoresUsuarix);
              setIndice((i * 100 / count.result).toFixed(0))
              if(conn.current === true) {
                await db.remove(v[i].id)
              }else{
                i = count.result;
              }
              foto = []; fotox = [];
          }
        }
        setIndice(100)
      } catch (e) {
        ToastAndroid.show(e, ToastAndroid.SHORT);
      }
      if(conn.current === true){
        valoresUsuario = [period, program, curpData, muni, latitud, longitud, benef, cantidad, periodici, tarjeta, foto_ref1]
        await submitInformacion(nuevoBeneficiario, ...valoresUsuario);
      }
      if(conn.current === false){
        valoresUsuario = [period, program, curpData, muni, latitud, longitud, benef, cantidad, periodici, tarjeta, fotos]
        await db.create(...valoresUsuario);
      }
    } else {
        await db.create(...valoresUsuario);
    }
    regresarQR();
  }

  async function submitInformacion(nuevoBeneficiario, period, program, curpData, muni, latitud, longitud, benef, cantidad, periodici, tarjeta, fotox) {
    try {
      await nuevoBeneficiario({
        variables: {
          input: {
            period, program, curpData, muni, latitud, longitud, benef, cantidad, periodici, tarjeta, fotox
          }
        }
      });
  
    } catch (error) {
      conn.current = false;
      ToastAndroid.show(error.message.replace('GraphQL error: ', ''), ToastAndroid.SHORT);
    }
  }

  const regresar = () => {
    foto = [];
    navigation.push('Menu');
  }

  const regresarQR = () => {
    setFotos([]); setTarjeta(''); foto = []; fotox = [];
    navigation.dispatch(CommonActions.reset({
      index: 1,
      routes: [{ name: 'Curp' }]
    }))
  }

  return (
    <>
      {flag ?
        (
          <View
            style={global.contenidoCU}>
            <ActivityIndicator size="large" />
            <Text style={global.maintext}>
              Subiendo registros.....
            </Text>
            <Text style={global.maintext}>{`${indice}%`}</Text>
          </View>
        ) : (
          municipio !== null ?
            (
              <>
                <View style={global.contenidoSI}>
                  <TextInput
                    style={global.textoInput}
                    keyboardType='numeric'
                    placeholder='Colocar número de tarjeta'
                    onChangeText={(text) => setTarjeta(text)}
                    value={tarjeta}
                  />

                </View>
                <View style={{ flex: 4 }}>
                  <View style={{ alignSelf: 'center' }}><Text style={{ color: 'black', fontSize: 20, margin: 5 }}>{'Revise los datos del usuario'}</Text></View>
                  <ScrollView style={global.parentScrollViewStyle}>
                    <ScrollView horizontal={true} contentContainerStyle={styles.childScrollViewStyle}>
                      <DataTable>
                        <DataTable.Row style={{ backgroundColor: '#7E7E7E' }}>
                          <DataTable.Cell style={{ backgroundColor: '#7E7E7E' }}>
                            <TouchableOpacity disabled={flag}
                              style={global.button} onPress={() => { navigation.navigate('Imagenes') }}>
                              <Text style={global.buttonText}>Mostrar Fotos</Text>
                            </TouchableOpacity>
                          </DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Header style={{ backgroundColor: '#242424' }}>
                          <DataTable.Title style={{ backgroundColor: '#242424' }}><Text style={styles.title}>Beneficiario</Text></DataTable.Title>
                        </DataTable.Header>
                        {showUser.map(i => (
                          <DataTable.Row key={i[0]} style={{ backgroundColor: '#7E7E7E' }}>
                            <DataTable.Cell style={{ backgroundColor: '#7E7E7E' }}>
                              <Text style={styles.cell}>{i[1]}</Text>
                            </DataTable.Cell>
                          </DataTable.Row>
                        ))}
                        <DataTable.Header style={{ backgroundColor: '#242424' }}>
                          <DataTable.Title style={{ backgroundColor: '#242424' }}><Text style={styles.title}>Programa</Text></DataTable.Title>
                        </DataTable.Header>
                        {showProgram.map(i => (
                          <DataTable.Row key={i[0]} style={{ backgroundColor: '#7E7E7E' }}>
                            <DataTable.Cell style={{ backgroundColor: '#7E7E7E' }}>
                              <Text style={styles.cell}>
                                <><Text style={styles.cell1}>{i[1]}</Text><Text>{i[2]}</Text></>
                              </Text>
                            </DataTable.Cell>
                          </DataTable.Row>
                        ))}
                      </DataTable>
                    </ScrollView>
                  </ScrollView>
                </View>
                <View style={global.butt}>
                  <TouchableOpacity disabled={flag}
                    style={global.button} onPress={() => saveData()}>
                    <Text style={global.buttonText}>{'Guardar'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity disabled={flag}
                    style={global.button} onPress={() => regresar()}>
                    <Text style={global.buttonText}>{'Menú'}</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View>
              </View>
            ))}
    </>
  );
}
const styles = StyleSheet.create({
  childScrollViewStyle: {
    borderWidth: 1,
    borderColor: '#D3D3D3'
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

export default SubirDatos;

