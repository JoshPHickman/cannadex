import { Component } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, TextInput, TouchableOpacity } from 'react-native';
import { doc, setDoc, } from 'firebase/firestore';
import { db, auth } from "./firebase/config";
import SelectDropdown from 'react-native-select-dropdown';

const productTypes = ["Flower", "Pre-roll", "Infused Pre-roll", "Shatter", "Hash", "Live Resin", "Distillate", "Rosin"]

export default class ProductForm extends Component {
    constructor(props) {
        super(props);
        this.state={
            producer: null,
            strain: null,
            weight: null,
            pin: this.props.route.params.data,
            type: null,
        }
    }

    render() {
        return(
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={-160}>
                    <Text style={{ textAlign: 'center', marginBottom: 30, fontSize: 25,}}>New Product</Text>
                    
                    <View style={{ marginTop: 10, width: '100%', alignItems: 'center', }}>
                        <Text style={styles.inputLabel}>Producer:</Text>
                        <TextInput
                            style={styles.smallInput}
                            placeholder="Cali, TGOD, Bazam"
                            value={this.state.producer}
                            onChangeText={(producer) => this.setState({producer: producer})}
                        />
                    </View>
                    <View style={{ marginTop: 10, width: '100%', alignItems: 'center', }}>
                        <Text style={styles.inputLabel}>Strain:</Text>
                        <TextInput
                            style={styles.smallInput}
                            placeholder="Maple Kush, RNTZ, Sour Diesel"
                            value={this.state.strain}
                            onChangeText={(strain) => this.setState({strain: strain})}
                        />
                    </View>
                    <View style={{ marginTop: 10, width: '80%',  }}>
                        <Text style={styles.inputLabel}>Weight:</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center',}}>
                            <TextInput
                                style={[styles.smallInput, {width: 50}]}
                                keyboardType="numeric"
                                value={this.state.weight}
                                onChangeText={(weight) => this.handleWeightChange(weight)}
                            />
                            <Text style={{ marginLeft: 5, }}>g</Text>

                            <SelectDropdown
                                style={styles.selectDropCustom}
                                defaultButtonText='Product Type'
                                buttonStyle={styles.dropdown}
                                dropdownStyle={{ borderRadius: 10, marginTop: 200,}}
                                rowTextStyle={{ fontSize: 15 }}
                                buttonTextStyle={{ fontSize: 15 }}
                                data={productTypes}
                                onSelect={(selectedItem, index) => {
                                    this.setState({
                                        type: selectedItem,
                                    })
                                    console.log(selectedItem, index);
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    // text represented after item is selected
                                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                                    return selectedItem
                                }}
                                rowTextForSelection={(item, index) => {
                                    // text represented for each item in dropdown
                                    // if data array is an array of objects then return item.property to represent item in dropdown
                                    return item
                                }}
                            />
                        </View>
                    </View>

                    {auth.currentUser && <TouchableOpacity style={ styles.newEntryButton } onPress={this.createNewProductRecord}><Text style={ styles.buttonText }>Create Product</Text></TouchableOpacity>}
                    {!auth.currentUser && <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}><Text style={styles.signInText}>Sign in to submit a product entry</Text></TouchableOpacity>}
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        );
    }

    handleWeightChange = (newWeight) => {
        //TODO Set to max when over max
        if (newWeight >= 0 && newWeight <= 28) {
            this.setState({
                weight: newWeight,
            });
        }
    }
    
    createNewProductRecord = async () => {
        console.log(this.state.pin)
        try {
            //cannabisProductRef = collection(db, 'cannabis_product');
            docRef = doc(db, 'cannabis_product', this.state.pin);

            await setDoc(docRef, {
                producer: this.state.producer,
                strain: this.state.strain,
                type: this.state.type,
                weight: this.state.weight,
                uid: auth.currentUser.uid,
            });
        } catch(err) {
            console.log(err);
        }
        
        Keyboard.dismiss();
        this.props.navigation.navigate('JournalForm', {
            producer: this.state.producer, 
            strain: this.state.strain, 
            type: this.state.type, 
        });
    
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    smallInput: {
        height: 35,
        backgroundColor: '#f4f4f4',
        paddingHorizontal: 15,
        borderRadius: 5,
        width: '80%',
        marginTop: 3,
    },
    inputLabel: {
        textAlign: 'left', 
        width: '80%',
    },
    dropdown: {
        marginLeft: 'auto',
        borderRadius: 10,
    },
    selectDropCustom: {
        fontSize: 10,
    },
    newEntryButton: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 70,
        backgroundColor: "#00CC99",
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
    },
    signInText: {
        marginTop: 50,
        textDecorationLine: 'underline',
        color: "#0275d8",
    },
});