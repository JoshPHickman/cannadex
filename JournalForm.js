import { Component } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, TextInput, TouchableOpacity } from 'react-native';
import { collection, addDoc, } from 'firebase/firestore';
import { db, auth } from "./firebase/config";

export default class JournalForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            producer: this.props.route.params.producer,
            type: this.props.route.params.type,
            strain: this.props.route.params.strain,
            timestamp: null,
            mood: null,
            experience: null,
            rating: null,
        }
    }
    //TODO disable button if no user and if not all fields filled
    
    render() {
        return(
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={-160}>
                    
                    <Text style={{ textAlign: 'center', marginBottom: 20, fontSize: 25,}}>New Journal Record</Text>
                    
                    <View style={styles.prefilledData}>
                        <View style={styles.productHeadings}>
                            <Text style={{ textAlign: 'left', }}>Producer: </Text>
                            <View style={styles.line} />
                            <Text style={{ textAlign: 'left', }}>Strain: </Text>
                            <View style={styles.line} />
                            <Text style={{ textAlign: 'left', }}>Type: </Text>
                            <View style={styles.line} />
                            <Text style={{ textAlign: 'left', }}>Date: </Text>
                            <View style={styles.line} />
                        </View>
                        <View style={styles.productDetails}>
                            <Text style={{ textAlign: 'right', }}> {this.state.producer}</Text>
                            <View style={styles.line} />
                            <Text style={{ textAlign: 'right', }}> {this.state.strain}</Text>
                            <View style={styles.line} />
                            <Text style={{ textAlign: 'right', }}> {this.state.type}</Text>
                            <View style={styles.line} />
                            <Text style={{ textAlign: 'right', }}> {this.state.timestamp ? this.state.timestamp.toLocaleString() : ''}</Text>
                            <View style={styles.line} />
                        </View>
                    </View>
                    
                    
                    <View style={{ marginTop: 10, width: '100%', alignItems: 'center', }}>
                        <Text style={styles.inputLabel}>Mood:</Text>
                        <TextInput
                            style={styles.smallInput}
                            placeholder="relaxed, creative, energetic"
                            value={this.state.mood}
                            onChangeText={(moodDesc) => this.setState({mood: moodDesc})}
                        />
                    </View>
                    <View style={{ marginTop: 10, width: '100%', alignItems: 'center', }}>
                        <Text style={styles.inputLabel}>Experience:</Text>
                        <TextInput
                            textAlignVertical="top"
                            style={[styles.smallInput, {height: 150, paddingTop: 5,}]}
                            placeholder="visual appeal, taste and nose, high decription"
                            multiline
                            numberOfLines={4}
                            maxLength={280}
                            value={this.state.experience}
                            onChangeText={(experienceDesc) => this.setState({experience: experienceDesc})}
                        />
                    </View>

                    {/* TODO turn this into 10 stars that can be selected to increment the rating  */}
                    <View style={{ marginTop: 10, width: '80%',  }}>
                        <Text style={styles.inputLabel}>Rating:</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center',}}>
                            <TextInput
                                style={[styles.smallInput, {width: 50}]}
                                keyboardType="numeric"
                                value={this.state.rating}
                                onChangeText={(rating) => this.handleRatingChange(rating)}
                            />
                            <Text style={{ marginLeft: 5, }}>/10</Text>
                        </View>
                    </View>
                    
                    {auth.currentUser && <TouchableOpacity style={ styles.newEntryButton } onPress={this.createNewJournalRecord}><Text style={ styles.buttonText }>CREATE</Text></TouchableOpacity>}
                    {!auth.currentUser && <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}><Text style={styles.signInText}>Sign in to start journaling</Text></TouchableOpacity>}

                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        );
    }

    componentDidMount() {
        const date = new Date();

        this.setState({
            timestamp: date,
        });

    }

    componentDidUpdate(prevProps) {
        const date = new Date();

        //Condition required to prevent infinite update loop
        if (prevProps.route.params.producer !== this.props.route.params.producer || prevProps.route.params.strain !== this.props.route.params.strain || prevProps.route.params.type !== this.props.route.params.type) {
          this.setState({
            producer: this.props.route.params.producer,
            type: this.props.route.params.type,
            strain: this.props.route.params.strain,
            timestamp: date,
          });
        }
    }

    handleRatingChange = (newRating) => {
        if (newRating >= 0 && newRating <= 10) {
            this.setState({
                rating: newRating,
            });
        }
    }
    
    createNewJournalRecord = async () => {
        //Retrieve Journal Entry Collection
        journalEntryRef = collection(db, 'journal_entry');
        const uid = auth.currentUser.uid;

        await addDoc(journalEntryRef, {
            date: this.state.timestamp,
            experience: this.state.experience,
            mood: this.state.mood,
            producer: this.state.producer,
            rating: this.state.rating,
            strain: this.state.strain,
            type: this.state.type,
            uid: uid,
        });

        Keyboard.dismiss()
        this.props.navigation.navigate('Journal');
    
    }

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    line: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginTop: 3,
        marginBottom: 10,
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
    prefilledData: {
        flexDirection: 'row',
    },
    productHeadings: {
        textAlign: 'right',
        width: '30%',
    }, 
    productDetails: {
        textAlign: 'right',
        width: '50%',
    },
    newEntryButton: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#00CC99",
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
    },
    signInText: {
        marginTop: 40,
        textDecorationLine: 'underline',
        color: "#0275d8",
    }
});