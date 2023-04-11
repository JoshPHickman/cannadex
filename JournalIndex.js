import { Component } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { collection, query, where, onSnapshot, } from 'firebase/firestore';
import { db, auth } from "./firebase/config";

export default class JournalIndex extends Component {
    constructor(props) {
        super(props);
        this.state={
            journalEntries: [],
        }
    }

    //TODO condition for no journal entry records

    render() {
        const { journalEntries } = this.state;
        
        return(
            <ScrollView style={styles.container}>
                <Text style={{ textAlign: 'center', marginBottom: 25, marginTop: 50, fontSize: 25,}}>Journal Entries</Text>
                {journalEntries.map((item, index) => (
                    <View style={styles.journalCard} key={index}>
                        <Text style={{ textAlign: 'center', marginBottom: 10, textDecorationLine: 'underline', fontSize: 20,}}>{item.date.toDate().toDateString()}</Text>

                        <View style={styles.productInfo}>
                            <View style={styles.listingHeadings}>
                                <Text style={{ textAlign: 'left', }}>Producer: </Text>
                                <View style={styles.line} />
                                <Text style={{ textAlign: 'left', }}>Strain: </Text>
                                <View style={styles.line} />
                                <Text style={{ textAlign: 'left', }}>Type: </Text>
                                <View style={styles.line} />
                                <Text style={{ textAlign: 'left', }}>Rating: </Text>
                                <View style={styles.line} />
                            </View>
                            <View style={styles.listingDetails}>
                                <Text style={{ textAlign: 'right', }}>{item.producer}</Text>
                                <View style={styles.line} />
                                <Text style={{ textAlign: 'right', }}>{item.strain}</Text>
                                <View style={styles.line} />
                                <Text style={{ textAlign: 'right', }}>{item.type}</Text>
                                <View style={styles.line} />
                                <Text style={{ textAlign: 'right', }}>{item.rating}/10</Text>
                                {/* <Text style={{ textAlign: 'right', }}>{item.date.toLocaleString()}</Text> */}
                                <View style={styles.line} />
                            </View>

                        </View>
                        

                        <View style={{ marginTop: 10, width: '100%', alignItems: 'center', }}>
                            <Text style={styles.inputLabel}>Experience:</Text>
                            <TextInput
                                textAlignVertical="top"
                                style={[styles.smallInput, {paddingTop: 5,}]}
                                multiline
                                editable={false}
                                value={item.experience}
                            />
                        </View>
                        <View style={{ marginTop: 10, width: '100%', alignItems: 'center', }}>
                            <Text style={styles.inputLabel}>Mood:</Text>
                            <TextInput
                                textAlignVertical="top"
                                style={[styles.smallInput, {paddingTop: 5,}]}
                                multiline
                                editable={false}
                                value={item.mood}
                                onChangeText={(experienceDesc) => this.setState({experience: experienceDesc})}
                            />
                        </View>
                    </View>
                ))}
            </ScrollView>
        );
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('focus', () => {
            if(auth.currentUser) {
                //TODO order by date
                itemQuery = query(collection(db, 'journal_entry'), where('uid', '==', auth.currentUser.uid));
                
                this.unsubscribe = onSnapshot(itemQuery, (querySnapshot) => {
                    
                    const journalEntries = querySnapshot.docs.map((doc) => {
                    return doc.data();
                    });
            
                    this.setState({ journalEntries });
                    console.log({journalEntries});
                });
            } else {
                this.props.navigation.navigate('Profile');
            }
        });
    }
    
    componentWillUnmount() {
        
        this.focusListener();
        this.unsubscribe();
    }
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    productInfo: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    journalCard: {
        marginHorizontal: 25,
        borderRadius: 10,
        backgroundColor: "#C2C9D6",
        flexDirection: 'column',
        marginBottom: 15,
        paddingVertical: 15,
    },
    line: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginTop: 3,
        marginBottom: 10,
    },
    listingHeadings: {
        textAlign: 'right',
        width: '30%',
    }, 
    listingDetails: {
        textAlign: 'right',
        width: '60%',
    },
    smallInput: {
        backgroundColor: '#f4f4f4',
        paddingHorizontal: 10,
        borderRadius: 5,
        width: '90%',
        marginTop: 5,
        color: "black",
    },
    inputLabel: {
        textAlign: 'left', 
        width: '90%',
    },
});