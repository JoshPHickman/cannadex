import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native";
import { signInWithEmailAndPassword  } from "firebase/auth"; 
import { auth } from "./firebase/config";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state={
            email: "",
            password: "",
        }
    }

    render() {
        return (
            
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                
                <Image style={styles.image} source={require("./assets/adaptive-icon.png")} /> 
                <Text style={{ textAlign: 'center', marginBottom: 25, fontSize: 25,}}>Login</Text>
                
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Email"
                        onChangeText={this.handleEmailChange}
                    /> 
                </View> 

                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Password"
                        secureTextEntry={true}
                        onChangeText={this.handlePasswordChange}
                    /> 
                </View> 

                <TouchableOpacity onPress={() => {this.props.navigation.navigate('Signup');}}>
                    <Text style={styles.forgot_button}>Don't have an account?</Text> 
                </TouchableOpacity> 

                <TouchableOpacity style={styles.loginBtn} onPress={this.handleEmailSignIn}>
                    <Text style={styles.loginText}>LOGIN</Text> 
                </TouchableOpacity> 
            </View> 
            </TouchableWithoutFeedback>
        );
    }

    handlePasswordChange = (password) => {
        // Use destructuring assignment to set state
        this.setState({ password });
        console.log(this.state.password);
    };

    handleEmailChange = (email) => {
        // Use destructuring assignment to set state
        this.setState({ email });
        console.log(this.state.email);
    };

    handleEmailSignIn = () => {
        signInWithEmailAndPassword(auth, this.state.email, this.state.password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log('Authentication succeeded!', user.email); 

            Keyboard.dismiss();
            this.props.navigation.navigate('Scanner');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('FAILED!', '| Err Code:', errorCode, '| Err Message:', errorMessage);
        });

    }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 40,
  },
  inputView: {
    backgroundColor: "#f4f4f4",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  loginBtn: {
    width: "70%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    backgroundColor: "#0275d8",
  },
  loginText: {
    color: "white",
  },
});