import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Component } from 'react';
import { onAuthStateChanged } from "firebase/auth"; 
import { auth } from "./firebase/config";
import * as SplashScreen from 'expo-splash-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Scanner from './Scanner';
import JournalForm from './JournalForm';
import ProductForm from './ProductForm';
import JournalIndex from './JournalIndex';
import Login from './Login';
import Profile from './Profile';
import Signup from './Signup';

const Tab = createBottomTabNavigator();

export default class App extends Component {
  constructor(props){
    super(props);
    this.state={
      user: null,
    }
  }

  //Displayed Views
  render() {
    
    profileComponent = this.state.user ? Profile : Login;

    return (
      <NavigationContainer>
        <Tab.Navigator screenOptions={({ route }) => ({

          tabBarIcon: ({ focused, color, size}) => {
            let iconName;

            if (route.name === 'Scanner') {
              iconName = focused ? 'barcode' : 'barcode-outline';
            } else if (route.name === 'Journal') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Login') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Signup') {
              iconName = focused ? 'people' : 'people-outline';
            } 

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarInactiveTintColor: "white",
          tabBarActiveTintColor: "#4D8CFF",

          tabBarStyle: {
            backgroundColor: '#222223',
            borderTopColor: '#292A2D',
            height: 65,
            borderTopWidth: 2
          },

          tabBarIconStyle: {
            marginTop: 5,
          },

          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 10,
          },
          //This prop stops the scanner from being unmounted for stack navigation, allowing you to keep scanning items upon return.
          //detachPreviousScreen: false,
        })}
        
        //This stops scanner being unmounted for tab navigation
        detachInactiveScreens={false}>
          <Tab.Screen
            name = "Profile"
            component={profileComponent}  
          /> 
          <Tab.Screen
            name = "Signup"
            component={Signup}
            options={{ tabBarButton: () => null }}  
          /> 
          <Tab.Screen
            name = "Scanner"
            component={Scanner} 
          /> 
          <Tab.Screen
            name = "ProductForm"
            component={ProductForm}
            options={{ tabBarButton: () => null }}
          />
          <Tab.Screen
            name = "JournalForm"
            component={JournalForm}
            options={{ tabBarButton: () => null }}
          />
          <Tab.Screen
            name = "Journal"
            component={JournalIndex}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
  
  //Lifecycle
  componentDidMount() {
    SplashScreen.preventAutoHideAsync();
    // Add an observer for changes to the user's sign-in state
    this.unsubscribe = onAuthStateChanged(auth, (user) => {
      this.setState({ user });
      console.log(user);
    });
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);
  }

  componentWillUnmount() {
    // Remove the observer when the component is unmounting
    this.unsubscribe();
  }

}

