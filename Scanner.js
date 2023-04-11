import { Component } from 'react';
import { StyleSheet, Dimensions, View, } from 'react-native';
import { Camera } from 'expo-camera';
import { doc, getDoc } from 'firebase/firestore';
import { db } from "./firebase/config";

export default class Scanner extends Component {
    constructor(props) {
      super(props);
  
      //State Variables
      this.state = {
        hasPermission: null,
      }
      
    }

    //TODO disable camera when you navigate away to save battery and stop scans on other screens
    render() {
        return(
            <View style={styles.container}>
                {/* Using Camera instead of barCodeScanner because of styling trouble with bcode scanner */}
                <Camera
                    onBarCodeScanned={this.handleBarCodeScanned}
                    style={styles.absoluteFillObject}
                    //upc_a & ean13 works for non stacked cannabis product bar codes, stacked codes (gs1 composite codes) present inconsistent data. Scandit has this ability.
                    //barCodeTypes={[BarCodeScanner.Constants.BarCodeType.upc_a]} 
                >
                    <View style={styles.scannerArea}></View>
                </Camera>
            </View>
        );
    }
  
    //Lifecycle
    componentDidMount() {
        //Get device permissions
        this.getBarCodeScannerPermissions();
    }
  
    getBarCodeScannerPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
      
        //if BarcodeScanner perm status is granted set hasPerms to true
        this.setState({
            hasPermission: (status === 'granted'),
        });
  
    }
  
    handleBarCodeScanned = async ({type, data}) => {

        //TODO Consider doing this on mount and setting in state
        productRef = doc(db, "cannabis_product", data);
        //productRef = collection(db, 'cannabis_product');
        //queryRef = query(productRef, where('pin', '==', data));
        const docSnap = await getDoc(productRef);

        if (docSnap.exists()) {
            console.log('record exists', docSnap.data().producer);

            this.props.navigation.navigate('JournalForm', {
                producer: docSnap.data().producer, 
                strain: docSnap.data().strain, 
                type: docSnap.data().type, 
            });
        } else {
            console.log('no record');
            this.props.navigation.navigate('ProductForm', {
                data: data,
            });
        }
        //For testing & displaying bar code information
        //alert(`Bar code with type ${type} and data ${data} has been scanned!`)
    }

}

//TODO clean these up 
const { width, height } = Dimensions.get('screen');
const aspectRatio = width / height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#292A2D',
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },

    absoluteFillObject: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('screen').width,
        aspectRatio: 9/16,
    },
    scannerArea: {
        width: "50%",
        height: "40%",
        marginBottom: "10%",
        borderRadius: 15,
        backgroundColor: 'grey',
        opacity: 0.35,
    },
});