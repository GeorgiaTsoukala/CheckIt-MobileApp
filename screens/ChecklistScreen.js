import { StyleSheet, Text, Dimensions, TouchableOpacity, View, TouchableWithoutFeedback, FlatList, Modal, Image } from 'react-native'
import React, { useEffect, useState} from 'react'
import { Timestamp, addDoc, collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { auth, datab } from '../firebase';
import moment from 'moment';
import globalStyles from '../globalStyles';
import Card from './CardComponent';

const { width } = Dimensions.get('window');

const ChecklistScreen = () => {
  const [value, setValue] = useState(new Date()); //keeps today's date

  const mydays = React.useMemo(() => {
    const days = [];

    for (let i = 6; i > -1; i--) {
      const date = moment(new Date()).subtract(i, 'day');
      days.push({
        weekday: date.format('ddd'),
        date: date.toDate(),
      });
    }

    return days;
  }, []);

  // Get the selected categories from the database

  const [catGoals, setCatGoals] = useState({});

  useEffect(() => {
    const fetchCatGoals = async () => {
      try {
        const querySnapshot = await getDocs(collection(datab, "users", auth.currentUser.uid, "categories"));
        const categoryGoals = {};

        querySnapshot.forEach(async (categoryDoc) => {
          const goals = categoryDoc.data().goals;
          categoryGoals[categoryDoc.id] = goals;
        });

        console.log('catGoals', categoryGoals)  

        setCatGoals(categoryGoals);
        setCheckboxStates(new Array(categoryGoals['Health'].length).fill(false))
      } catch (error) {
        console.error('Error fetching selected categories and goals:', error);
      }
    }

    fetchCatGoals();  

  }, []);



  // handle calendar date selection
  const [savedData, setSavedData] = useState(false);
  // const [fetchedData, setFetchedData] = useState([])

  const handleCalendarTap = async (selectedDate) => {
    setValue(selectedDate);
    setCheckboxStates(Array(catGoals['Health'].length).fill(false));

    // Fetch date's data
    try {
      const dailyDataRef = collection(datab, "users", auth.currentUser.uid, "dailydata");

      // Set selectedDate to midnight (start of the day)
      selectedDate.setHours(0, 0, 0, 0);

      // Calculate the start and end timestamps for the selected date
      const startTimestamp = Timestamp.fromDate(selectedDate);
      const endTimestamp = Timestamp.fromMillis(selectedDate.getTime() + 86400000); // Add 24 hours to selectedDate

      // Create a Firestore query to retrieve documents for the selected date
      const q = query(
        dailyDataRef,
        where('timestamp', '>=', startTimestamp), // Greater than or equal to start of selectedDate
        where('timestamp', '<', endTimestamp) // Less than end of selectedDate (start of next day)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setSavedData(true);
        console.log('yes data')
        
        querySnapshot.forEach((doc) => {
          console.log('Document data:', doc.data());

          let fetchedGoals = doc.data().goals;
          console.log('fetched data: ', fetchedGoals)

          // Initialize checkboxStates with all false values
          let checkboxStatesSaved = Array(catGoals['Health'].length).fill(false);          

          // Iterate over fetchedGoals and set corresponding checkboxStates to true
          fetchedGoals.forEach((goal) => {
            const index = catGoals['Health'].indexOf(goal);
            if (index !== -1) {
              checkboxStatesSaved[index] = true;
            }
          });

          setCheckboxStates(checkboxStatesSaved);

          // setFetchedData(doc.data().goals)
        });
      } else {
        setSavedData(false);
      }

    } catch (error) {
      console.error('Error fetching selected categories:', error);
    }
    
  }

  // State to track the checkbox states
  const [checkboxStates, setCheckboxStates] = useState([]);

  // Function to update checkbox states
  const handleCheckboxToggle = (index) => {
    const newCheckboxStates = [...checkboxStates];
    newCheckboxStates[index] = !newCheckboxStates[index]
    setCheckboxStates(newCheckboxStates);
  };

  // call the handleNext when you are done with the checklist

  const handleSave = async () => {
    // console.log(catGoals['Health'])
    // const now = new Date();
    // console.log(now.toString()); // Fri Mar 29 2024 20:17:06 GMT+0100
    // console.log(now.toDateString()); // Fri Mar 29 2024
    // console.log(now.toLocaleDateString()); // 3/29/2024

    // const checkboxStates = [true, true, true, false, false];
    // const catGoalsHealth = ["Meditate", "Exercise", "Drink enough water", "Get enough sleep", "Eat healthy"];
    const dailyGoals = catGoals['Health'].filter((_, index) => checkboxStates[index]);
    console.log(dailyGoals);

    try {

      //save selected daily goals in a dailydata document with auto generated doc id
      
      // TODO add current time to value 
      await addDoc(collection(datab, "users", auth.currentUser.uid, "dailydata"), {timestamp: value, goals: dailyGoals});

      // TODO show mood popup 
      // navigation.navigate("MoodPage")

    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <View style={globalStyles.body}>

      {/* popup */}
      <Modal transparent visible={true} animationType="slide">
        <View style={styles.modalBody}>

          <Text style={globalStyles.title}>Let's wrap up your day!</Text>
          <Text style={globalStyles.subtitle}>How did you feel overall today?</Text>

          <View style={styles.emotionList}>
            <Image style={styles.emotionItem} source={require('../assets/emotions/very_sad.png')}></Image>
            <Image style={styles.emotionItem} source={require('../assets/emotions/sad.png')}></Image>
            <Image style={styles.emotionItem} source={require('../assets/emotions/neutral.png')}></Image>
            <Image style={styles.emotionItem} source={require('../assets/emotions/happy.png')}></Image>
            <Image style={styles.emotionItem} source={require('../assets/emotions/very_happy.png')}></Image>
          </View>


        </View>
      </Modal>

      {/* calendar */}
      <View style={styles.picker}>
            <View
              style={[styles.itemRow, { paddingHorizontal: 8 }]}
            >
              {mydays.map((item, dateIndex) => {
                const isActive = value.toDateString() === item.date.toDateString();
                return (
                  <TouchableWithoutFeedback
                    key={dateIndex}
                    onPress={() => handleCalendarTap(item.date)}>
                    <View
                      style={[
                        styles.item,
                        isActive && {
                          backgroundColor: '#D7B4EC',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.itemWeekday,
                        ]}>
                        {item.weekday}
                      </Text>
                      <Text
                        style={[
                          styles.itemDate,
                        ]}>
                        {item.date.getDate()}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                );
              })}
            </View>
      </View>

      {/* header */}
      {/* {value.toDateString() === (new Date()).toDateString() && */}
      { savedData ?
        <View style={globalStyles.center}>  
          <Text style={globalStyles.title}>Your day</Text>
          <Text style={globalStyles.subtitle}>The goals you accomplished on {value.toDateString()}</Text>
        </View>
        :
        <View style={globalStyles.center}>
          <Text style={globalStyles.title}>How was your day?</Text>
          <Text style={globalStyles.subtitle}>What goals are you satisfied with for today?</Text>
        </View>
       }



      {/* category cards */}      
      <FlatList
        style = {{flex: 1, marginBottom: '25%'}}
        data={Object.entries(catGoals)}
        horizontal= {false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Card category={item[0]} goals={item[1]} checkboxStates={checkboxStates || []} onToggle={(index) => handleCheckboxToggle(index)} savedData={savedData}/>}

        numColumns={2}
      />

      {/* button */}

      { !savedData && 
        <View style={[globalStyles.center, globalStyles.btnContainer]}>
          <TouchableOpacity
            onPress={handleSave}
            style={globalStyles.button}
          >
            <Text style={globalStyles.btnText}>Save</Text>
          </TouchableOpacity>
        </View>
      }

    </View>
  )
}

export default ChecklistScreen

const styles = StyleSheet.create({
  // popup
  modalBody: {
    backgroundColor: 'white',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingTop: 30,
    borderRadius: 20,
    elevation: 20,
    marginTop: '50%'
  },
  emotionList: {
    flexDirection: 'row',
    marginBottom: 30
  },
  emotionItem: {
    width: 46, 
    height: 46,
    marginHorizontal: 5
  },

  // date picker
  picker: {
    flex: 1,
    maxHeight: 74,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50
  },
  /** Item */
  item: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'column',
    alignItems: 'center',
  },
  itemRow: {
    width: width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  itemWeekday: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 16,
    fontWeight: '500',
  },

  // checkbox
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  goalTxt: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
    flexWrap: 'wrap',
  },
  containerCheckBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: '#d0b8e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBoxInactive: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: '#a9a9a9',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
