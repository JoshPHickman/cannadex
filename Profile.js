import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { signOut  } from "firebase/auth"; 
import { auth } from "./firebase/config";

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state={
            email: "",
            password: "",
        }
    }

    render() {
        return (
            <View style={styles.container}>
            <Image style={styles.image} source={require("./assets/adaptive-icon.png")} /> 

            <Text style={{ textAlign: 'center', marginBottom: 25, fontSize: 25,}}>Cannadex</Text>

                <Text >More coming soon!</Text> 

                <TouchableOpacity style={styles.loginBtn} onPress={this.logout}>
                    <Text style={styles.loginText}>LOGOUT</Text> 
                </TouchableOpacity> 

            </View> 
        );
    }

    logout = async () => {
        try {
            await signOut(auth);
        } catch (e) {
            //TODO handle error
            console.log("Error Logging Out: ", e)
        }
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
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#0275d8",
  },
  loginText: {
    color: "white",
  },
});