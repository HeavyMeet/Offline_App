import React, { useState, useRef, useEffect, useContext } from "react";
import {StyleSheet,Dimensions,View,Text,TouchableOpacity,SafeAreaView, ToastAndroid} from "react-native";
import { Camera } from "expo-camera";
import { useNavigation } from '@react-navigation/native';
import DropDownContext from '../context/DropDownContext';
const WINDOW_HEIGHT = Dimensions.get("window").height;
const closeButtonSize = Math.floor(WINDOW_HEIGHT * 0.032);
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);
import {global} from '../styles/globalStyles';
import { Icon } from 'react-native-elements';
export default function Cameras() {
  const datacontext = useContext(DropDownContext);
  const {fotos, setFotos} = datacontext;
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [sourcess, setSourcess] = useState(null);
  const [alert, setAlert] = useState(0);
  const cameraRef = useRef();
  
  let i = 0;
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const onCameraReady = () => {
    setIsCameraReady(true);
  };
 let source="";
  const takePicture = async () => {

    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const data = await cameraRef.current.takePictureAsync(options);
      source= data.uri;
      
      if (source) {
        await cameraRef.current.pausePreview();
        setIsPreview(true);  
        setSourcess(source); 
     }
    }
  };

  const takeAgain = async () =>{
    if(fotos.length === 1){
     setAlert(alert => alert+1);
     await cameraRef.current.resumePreview();
     if(fotos[0][0]=== 0) i++;
     setFotos([...fotos, [i,sourcess]]);
    }else{
     await cameraRef.current.resumePreview();
      setFotos([[i,sourcess]]);
      setIsPreview(false);  
   
  }}

  const cancelPreview = async () => {
    await cameraRef.current.resumePreview();
    setIsPreview(false);
  };
  const alerta = () => {
    if(alert==0){
    <>{ToastAndroid.show('¡Se necesita eliminar una foto para agregar otra!', ToastAndroid.SHORT)}</>
    }
  }

  const renderCancelPreviewButton = () => {
    return <>
      {fotos.length<2 ? (
        <>
           <View style={{  width: '100%',flexDirection:'row'}}>
        <TouchableOpacity onPress={cancelPreview} style={styles.closeButton}>
        <Icon name="x-circle" size={40} type='feather' color="white" /> 
      </TouchableOpacity>
        {/* <View style={styles.closeButton1}></View> */}
      </View>
      <View style={[styles.control,{justifyContent:'space-evenly'}]}>
      <TouchableOpacity  style={global.button} disabled={!isCameraReady} onPress={()=>navigation.navigate("Menu")}>
        <Text style={global.buttonText}>{"Menú"}</Text>
      </TouchableOpacity>
    <TouchableOpacity style={global.button} onPress={() => takeAgain()}>
    <Text style={global.buttonText}>{"GUARDAR"}</Text></TouchableOpacity></View>
    </>
      ):(
      <View style={[styles.control,{justifyContent:'space-evenly'}]}>
      <TouchableOpacity  style={global.button} disabled={!isCameraReady} onPress={()=>navigation.navigate("Menu")}>
        <Text style={[global.buttonText]}>{"Menú"}</Text>
      </TouchableOpacity>
       <TouchableOpacity style={global.button} onPress={()=>{navigation.navigate('SubirDatos'); setIsPreview(false)}}>
      <Text style={[global.buttonText]}>{"SIGUIENTE"}</Text>
      </TouchableOpacity>
        {alerta()}
      </View>
      )}
     </>
  };

  const renderCaptureControl = () => (
      <>
      <View style={[styles.control, {bottom: 38,right: 105}]}>
       <TouchableOpacity  style={global.button} disabled={!isCameraReady} onPress={()=>navigation.navigate("Menu")}>
        <Text style={[global.buttonText]}>{"Menú"}</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.control}> 
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={!isCameraReady}
        onPress={() => takePicture()}
        style={styles.capture}
      />
      </View>
      </>
  );

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text style={styles.text}>No tienes acceso a la camara</Text>;
  }
  return (
    <SafeAreaView style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.container}
        type={Camera.Constants.Type.back}
        flashMode={Camera.Constants.FlashMode.off}
        onCameraReady={onCameraReady}
        onMountError={(error) => {
          ToastAndroid.show(error, ToastAndroid.SHORT)
        }}
      />
      <View style={styles.container}>
        {isPreview && renderCancelPreviewButton()}
        {!isPreview && renderCaptureControl()}
       
      </View>
    </SafeAreaView> 

  );
}


const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  containerc: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    top: 25,left: 12, borderRadius:30, backgroundColor:'red'  },

  closeButton1: {
    top: 24,left: 2, borderRadius:30,
    backgroundColor:'red'  },

  media: {
    ...StyleSheet.absoluteFillObject,
  },
  closeCross: {
    width: "78%",
    height: 2.5,
    backgroundColor: "white",
  },
  control: {
    position: "absolute",
    flexDirection: "row",
    justifyContent:'center',
    alignItems:'center',
    bottom: 48,
    width: "100%",
    
  },
  capture: {
    backgroundColor: "#f5f6f5",
    borderRadius: 5,
    height: captureSize,
    width: captureSize,
    borderRadius: Math.floor(captureSize / 2),
    marginHorizontal: 31,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'white'
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  text: {
    color: "#fff",
  }
});