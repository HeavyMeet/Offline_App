import { useState, useEffect} from 'react';
import { Text,TextInput, View, TouchableOpacity, ToastAndroid } from 'react-native';
import { gql, useQuery } from '@apollo/client';
import {Picker} from '@react-native-picker/picker';
import DropDownContext from './DropDownContext.js';
import {global} from '../styles/globalStyles';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from "@react-native-community/netinfo";

const OBTENER_PROGRAMA = gql`
  query ObtenerPrograma {
  obtenerPrograma {
    beneficio {
      ide
      val
    }
    municipio {
      ide
      val
    }
    periodicidad {
      ide
      val
    }
    periodo {
      ide
      val
    }
    programa {
      ide
      val
    }
  }
}
`;

const MenuProvider = props => {
    const navigation = useNavigation();
    
    const {data, networkStatus, startPolling, stopPolling} = useQuery(OBTENER_PROGRAMA); 
    const [periodos, setPeriodos] = useState(null);
    const [programas, setProgramas] = useState(null);
    const [periodicidads, setPeriodicidads] = useState(null);
    const [beneficios, setBeneficios] = useState(null);
    const [municipios, setMunicipios] = useState(null);
    const [periodo, setPeriodo] = useState(null); 
    const [programa, setPrograma] = useState(null);
    const [periodicidad, setPeriodicidad] = useState(null);
    const [beneficio, setBeneficio] = useState(null);
    const [municipio, setMunicipio] = useState(null);
    const [cantidad, setCantidad] = useState('1');
    const [curpData, setCurpData] = useState([]);   
    const [fotos, setFotos] = useState([]);
    const [tarjeta, setTarjeta] = useState('');
    const { isConnected } = useNetInfo();  
    const getDataDropdown = async () => {
      const datos = await data.obtenerPrograma;   
      setPeriodos(datos.periodo)
      setProgramas(datos.programa)
      setPeriodicidads(datos.periodicidad)
      setMunicipios(datos.municipio)
      setBeneficios(datos.beneficio)
      setPeriodo(datos.periodo[0])
      setPrograma(datos.programa[0])
      setPeriodicidad(datos.periodicidad[0])
      setMunicipio(datos.municipio[0])
      setBeneficio(datos.beneficio[0])
      await AsyncStorage.setItem('periodos',JSON.stringify(datos.periodo));
      await AsyncStorage.setItem('programas',JSON.stringify(datos.programa));
      await AsyncStorage.setItem('periodicidads',JSON.stringify(datos.periodicidad));
      await AsyncStorage.setItem('municipios',JSON.stringify(datos.municipio));
      await AsyncStorage.setItem('beneficios',JSON.stringify(datos.beneficio));
      await AsyncStorage.setItem('periodo',JSON.stringify(datos.periodo[0]));
      await AsyncStorage.setItem('programa',JSON.stringify(datos.programa[0]));
      await AsyncStorage.setItem('periodicidad',JSON.stringify(datos.periodicidad[0]));
      await AsyncStorage.setItem('municipio',JSON.stringify(datos.municipio[0]));
      await AsyncStorage.setItem('beneficio',JSON.stringify(datos.beneficio[0]));  
  }
  useEffect(() => {
    
    if (networkStatus != 7) {
      startPolling(1000);   
    }
    try{
    if (data) {
      stopPolling();
      getDataDropdown();
    } 
  } catch (error) {
    ToastAndroid.show(error.message.replace('GraphQL error: ', ''), ToastAndroid.SHORT);
  }
  }, [networkStatus]);    

    useEffect(() => {
    const getMenuOffline = async () => { 
      if(isConnected === false){
      setPeriodos(JSON.parse(await AsyncStorage.getItem('periodos')));    
      setProgramas(JSON.parse(await AsyncStorage.getItem('programas')));
      setPeriodicidads(JSON.parse(await AsyncStorage.getItem('periodicidads')));
      setMunicipios(JSON.parse(await AsyncStorage.getItem('municipios')));
      setBeneficios(JSON.parse(await AsyncStorage.getItem('beneficios')));
      setPeriodo(JSON.parse(await AsyncStorage.getItem('periodo')));    
      setPrograma(JSON.parse(await AsyncStorage.getItem('programa')));
      setPeriodicidad(JSON.parse(await AsyncStorage.getItem('periodicidad')));
      setMunicipio(JSON.parse(await AsyncStorage.getItem('municipio')));
      setBeneficio(JSON.parse(await AsyncStorage.getItem('beneficio')));
    }}
    getMenuOffline();
  }, [isConnected]);
     
  const accesoBoton = () => {
    if(fotos.length === 2){
    return <>{ToastAndroid.show('¡Se necesita eliminar una foto para agregar otra!', ToastAndroid.SHORT)}</>
    }else{
    navigation.navigate("Camera");
    }
  }
 
   const picker = () => {
    return (
      <> 
       <View style={global.contenidoMP}>       
     { periodos !== null &&
     <>  
         <View style={{justifyContent:'space-around'}}>
         <Text   style={global.texto}>Periodo: </Text>
         <Text   style={global.texto}>Programa: </Text>
         <Text   style={global.texto}>Periodicidad: </Text>
         <Text   style={global.texto}>Beneficio: </Text>
         <Text   style={global.texto}>Cantidad: </Text>
         </View>
         <View style={{justifyContent:'space-around'}}>
             <Picker
       selectedValue={periodo}
       style={{ height: 50, width: 220}}
       onValueChange={(itemValue) => setPeriodo(itemValue)}
         > 
         {periodos.map(i => {return <Picker.Item key={i.ide} value={i} label={i.val} />})}
         </Picker>
         <Picker
       selectedValue={programa}
       style={{ height: 50, width: 220 }}
       onValueChange={(itemValue) => setPrograma(itemValue)}
         >   
       {programas.map(i => {
        return <Picker.Item key={i.ide} value={i} label={i.val} />})}
         </Picker>
             <Picker
       selectedValue={periodicidad}
       style={{ height: 50, width: 220 }}
       onValueChange={(itemValue) => setPeriodicidad(itemValue)}
         > 
         {periodicidads.map(i => {return <Picker.Item key={i.ide} value={i} label={i.val} />})}
         </Picker>
         <Picker
       selectedValue={beneficio}
       style={{ height: 50, width: 220 }}
       onValueChange={(itemValue) => setBeneficio(itemValue)}
         >   
         {beneficios.map(i => {return <Picker.Item key={i.ide} value={i} label={i.val} />})}
         </Picker>
       <TextInput  
           style={{ 
               padding: 7,
               fontSize: 20
               }}
               keyboardType = 'numeric'
               placeholder= '1'
               onChangeText={(text)=> setCantidad(text)}
               value={cantidad}
           />
         </View>
       </> 
      }   
        </View>
        <View style={global.butt}>
        {municipios !== null &&
           <>
          <View style={{ justifyContent: 'center' }}>
            <Text style={global.texto}>Municipio:  </Text>
          </View>
          <Picker
            selectedValue={municipio}
            style={{ height: 50, width: 210 }}
            onValueChange={(itemValue) => setMunicipio(itemValue)}
          >
            {municipios.map(i => { return <Picker.Item key={i.ide} value={i} label={i.val} /> })}
          </Picker>
          </>
            }
        </View>
          
        <View style={global.butt}>  
       <> 
       <TouchableOpacity 
        style={global.button}
        onPress={()=> {
          setFotos([]);
          navigation.dispatch(CommonActions.reset({
          index: 1,
          routes: [{ name: 'Curp'}]
        }))}}>  
            <Text style={global.buttonText}>{'CURP'}</Text>
        </TouchableOpacity>      
        <TouchableOpacity 
        style={global.button}
        onPress={()=> {navigation.navigate("SubirDatos")}}>  
            <Text style={global.buttonText}>{'Datos'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        style={global.button}
        onPress={()=> accesoBoton()}>
           <Text style={global.buttonText}>{'Cámara'}</Text> 
       </TouchableOpacity>  
       </>  
    </View>       
 </>
 )
       
   };
  
   const values = {periodo, periodos, programa, programas, periodicidad, periodicidads, beneficio, beneficios, municipio, municipios, cantidad, setMunicipio, setPrograma, setBeneficio, setPeriodo, setPeriodicidad, setCantidad, curpData, setCurpData, picker, fotos, setFotos, tarjeta, setTarjeta};
  
    return (
           <DropDownContext.Provider value={values}>
                {props.children}
           </DropDownContext.Provider>
    )

}

export default MenuProvider;

