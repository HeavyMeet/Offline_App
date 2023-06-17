import { StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
export const Styles = () => {
      const [loaded] = useFonts({
        UbuntuMedium: require('../assets/fonts/Ubuntu-Medium.ttf'),
      });
      
      if (!loaded) {
        return null;  
      }
   return (
     <Text style={{fontFamily:'Lato'}}>
     </Text>
   );
    }
export const global = StyleSheet.create({
    contenido: {
        marginHorizontal: '2.5%',
        flex: 1,
    },
    titulo: {
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 20,
        fontSize: 30
    },
    input: {
        backgroundColor: '#FFF',
        marginBottom: 20
    }, 
    contenidoMP: {  
        flex: 4,
        flexDirection:'row',
        justifyContent: 'center',
      },
      texto: {
      width: '100%',  
      borderColor: 'gray',
      fontSize: 20},

      tituloScroll: {
        color: 'black',
        fontSize: 20, 
        margin: 3
      },
       textoScroll: {
        color: '#404040',
        fontSize: 18, 
        margin: 1
      },
      maintext: {
        fontSize: 20,
        margin: 20,
      },
      contenidoCU: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center'
      
      },
      contenidoCU2: { 
        flex: 0.5 ,
        justifyContent:'center',
        alignItems: 'center'
      },
    contenido: {
        flex: 2,
        justifyContent: 'space-evenly',
        alignItems:'center'
    },
    contenido2: {
        flex: 1,
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center',
        alignContent:'space-around',
    },
      contenidoSI: {
        flex:1,
        justifyContent:'center',
        alignSelf:'center',
    },
    butt: {
        flex: 1,
        width: '100%',
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems:'center'
      },
    button: {
		marginVertical: 20,
		height: 40,
		marginHorizontal: 10,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
        borderWidth: 4,
        borderRadius: 8
	 },
	buttonText: { 
		textTransform: 'uppercase',    
		color: 'black', 
		fontSize: 16,
        margin: 5
	},
  botones: {
    flex:0.7, 
    justifyContent:'space-around', 
    alignItems:'center'
  },
    textoInput:{
        width: '100%',
        borderColor: 'gray',
        padding: 7,
        fontSize: 20
    },
    barcodebox: {
        alignItems: 'center',
        height: 300,
        width: 300,
        overflow: 'hidden',
        borderRadius: 30,
        backgroundColor: 'white'
      },
      parentScrollViewStyle: {
        // height: height-300,
        borderWidth: 1,
        borderColor: '#D3D3D3'
      }
}) 
