import {useState} from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { DataTable } from 'react-native-paper';
import {global} from '../styles/globalStyles';

const Info = ({route}) => {
  const [flag, setFlag] = useState(true);
  const navigation = useNavigation();
  const {params} = route;
  const selectScreen = () => {
   
    if(params === undefined || params === 1){
       navigation.goBack();
    }else{
      navigation.dispatch(CommonActions.reset({
        index: 1,
        routes: [{ name: 'Curp' }]
      }))
    }
  }
  
  return (
    <>
       <View style={global.butt}>
                  <TouchableOpacity
                    style={global.button} onPress={() => {setFlag(true)}}>
                    <Text style={global.buttonText}>{'Instrucciones'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={global.button} onPress={() => {setFlag(false)}}>
                    <Text style={global.buttonText}>{'App sin conexión'}</Text>
                  </TouchableOpacity>
                </View>
      <View style={{ flex: 7 }}>
        <ScrollView style={global.parentScrollViewStyle}>
        {flag ? (
        <>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{' Instrucciones de la aplicación'}</Text>
          <DataTable>
              <DataTable.Title>
              <Text style={global.tituloScroll}>{' 1.- Registrar cuenta'}</Text>
                </DataTable.Title>
            <DataTable.Row>
              <Text style={global.textoScroll}>{'Si bien su cuenta ya debe de existir en el sistema, es necesario registrar su cuenta por seguridad de su contraseña. Este proceso solo se hace una vez. Una vez registrado solo inicie sesión las proximas veces que entre a la aplicación.'}</Text>
            </DataTable.Row>
              <DataTable.Title>
              <Text style={global.tituloScroll}>{' 2.- Iniciar sesión'}</Text>
                </DataTable.Title>
              { params !== 1 && 
                <DataTable>
              <DataTable.Title>
              <Text style={global.tituloScroll}>{' 3.- Capturar código QR del CURP'}</Text>
                </DataTable.Title>
            <DataTable.Row>
              <Text style={global.textoScroll}>{'Posicionar la cámara y capturar código QR del CURP de un beneficiario.'}</Text>
            </DataTable.Row>
            <DataTable.Title>
              <Text style={global.tituloScroll}>{' 4.- Seleccionar los valores del menú'}</Text>
                </DataTable.Title>
            <DataTable.Row>
              <Text style={global.textoScroll}>{'Selecciona en las distintas listas desplegables los valores que corrrespondan al beneficiario.'}</Text>
            </DataTable.Row>
            <DataTable.Title>
              <Text style={global.tituloScroll}>{' 5.- Capturar fotografías'}</Text>
                </DataTable.Title>
            <DataTable.Row>
              <Text style={global.textoScroll}>{'Capturar 2 fotografías que corresponderán al rostro del beneficiario y la tarjeta que recibe.'}</Text>
            </DataTable.Row>
            <DataTable.Title>
              <Text style={global.tituloScroll}>{' 6.- Datos: Revisar y guardar'}</Text>
                </DataTable.Title>
            <DataTable.Row>
              <Text style={global.textoScroll}>{'Después de haber capturado las fotografías, puede revisar los valores del beneficiario y las imagenes tomadas. Si los valores o las fotografías no son correctos puede regresar a modificarlos. Para modificar los valores regresa al menú de listas desplegables. Para capturar de nuevo las fotografías, necesita eliminar las actuales. Finalmente, viendo que todo es correcto podrá guardar los valores del beneficiario.'}</Text>
            </DataTable.Row>
            <DataTable.Title>
              <Text style={global.tituloScroll}>{' 7.- Mostrar fotos'}</Text>
                </DataTable.Title>
            <DataTable.Row>
              <Text style={global.textoScroll}>{'En este apartado puede revisar las fotos capturadas y en el caso de que no sean correctas, elimine la que necesite con el icono que aparece del lado superior izquierdo y vuélvala a capturar.'}</Text>
            </DataTable.Row>
          </DataTable>
           }
            { params === 1 && 
              <Text style={{ fontSize: 20, fontWeight: "bold", margin:3 }}>{'...Para ver las instrucciones completas inicie sesión.'}</Text>
            }
          </DataTable>
          </>
           ):(
            <>
            <Text style={{ fontSize: 20, fontWeight: "bold", margin:3 }}>{' Funcionamiento de la aplicación sin conexión a Internet.'}</Text>
            <DataTable>
          <DataTable.Row>
            <Text style={global.textoScroll}>{'\n'}{'IMPORTANTE: Para que su aplicación funcione mientras no exista conexión o la señal sea muy debil es necesario prevenir con las siguientes acciones cuando aún cuente con conexión a Internet:  '}{'\n'}</Text>
          </DataTable.Row>
          <DataTable.Row>
              <Text style={global.textoScroll}>{'◍Iniciar sesión.'}{'\n'}{'◍Capturar el QR de un CURP (Puede ser el suyo).'}{'\n'}{'◍Ingresar al menú de listas desplegables.'}{'\n'}
              {'◍Ingresar al menú de Datos (No es necesario guardar).'}</Text>
            </DataTable.Row>
            <DataTable.Row>
              <Text style={global.textoScroll}>{'\n'}{'Realizando las siguientes acciones la aplicación será capaz de guardar los valores necesarios en el cache del dispositivo. Incluso funcionará si cierra la aplicación.'}</Text>
            </DataTable.Row>
            <Text style={[global.tituloScroll, {fontWeight: "bold"}]}>{' Guardar los registros hechos mientras su dispositivo esta sin conexión.'}</Text>
            <DataTable.Row>
              <Text style={global.textoScroll}>{'Los registros de los beneficiarios se hacen de la misma manera que como si tuviera conexión.'}{'\n'}{'\n'}{'IMPORTANTE: En el caso de que haya terminado de realizar todos los registros de los beneficiarios y nunca haya recuperado la conexión de Internet, es necesario que realice un último registro cuando ya cuente con conexión. De esta manera'
              +' se guardarán todos los registros incluyendo las fotografías en la base de datos del sistema.'}{'\n'}{'\n'}{'Mientras no haga esto, los registros se mantendrán almacenados en la base de datos local de su dispositivo.'}</Text>
            </DataTable.Row>
            <DataTable.Row>
              <Text style={global.textoScroll}>{'\n'}{'Se dará cuenta que cuando realice el registro de un beneficiario cuando ya cuente con conexión, se tardará un poco en guardar este registro debido a que subirá a su vez, todos los registros que haya hecho mientras no tenía conexión.'}{'\n'}{'\n'}{'En el caso de que se interrumpa su conexión de nuevo, al momento de subirlos,'
              +' no se preocupe, los registros incluido el último, estarán guardados en la base de datos de su dispositivo hasta que vuelva a realizar un registro con conexión.'}</Text>
            </DataTable.Row>
            <Text style={{ fontSize: 18, fontWeight: "bold", margin:3 }}>{'Puede continuar usando la aplicación sin conexión.'}</Text> 
        </DataTable>
        </> 
           )}
        </ScrollView>
        </View>
      <View style={global.butt}>
        <TouchableOpacity
          onPress={() => selectScreen()}
          style={global.button}>
          <Text style={global.buttonText}>{'Regresar'}</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default Info