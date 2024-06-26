import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

// Define the color palette
export const colors = {
    grey50: '#F3F3F3',
    grey100: '#EBEBEB',
    grey200: '#C6C6C6',
    grey400: '#9B9B9B',
    grey600: '#727272',
    grey800: '#4B4B4B',
    health: '#ACF9AF',
    productivity: '#FFEB7F',
    intellect: '#D7A5EF',
    finance: '#90E9FC',
    creativity: '#FDA5C5'
  };

export const catIcons = {
    'Productivity': 'lightbulb-on-outline', 
    'Health': 'heart-plus-outline', 
    'Finance': 'hand-coin-outline', 
    'Intellect': 'drama-masks', 
    'Creativity': 'lightbulb-on-outline'
  };

export const MyCheckbox = ({myBgColor, myColor}) => {
    return (
        <View style={{backgroundColor: myBgColor, borderRadius: 50, padding: 6}}>
            <MaterialCommunityIcons name="check" size={18} color={myColor} />
        </View>
    )
}

const globalStyles = StyleSheet.create({
    // body
    body: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: colors.grey50,
    },

    // header
    center: {
        alignItems: 'center',
    },
    title: {
        color: 'black',
        fontSize: 32,
        fontWeight: 'bold',
    },
    subtitle: {
        width: '70%',
        marginTop: 12,
        marginBottom: 40,
        fontSize: 18,
        color: colors.grey600,
        textAlign: 'center', 
    },

    // button    
    btnContainer: {
        position: 'absolute', 
        alignItems: 'center',
        bottom: 70, 
        width: '100%',
    },
    button: {
        borderRadius: 50,
        width: 150
    },
    btnText: {
        fontSize: 18,
        color: colors.grey50,
        paddingHorizontal: 30, 
        lineHeight: 30
    },

    // input
    inputContainer: {
        width: "80%",
    },
    input: {
        backgroundColor: "white",
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 50,
        marginTop: 15,
      },
});

export default globalStyles;
