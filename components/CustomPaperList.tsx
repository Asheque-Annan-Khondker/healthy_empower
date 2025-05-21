import React, {useState} from "react";
import {List} from "react-native-paper";
import {ScrollView} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

type CustomDropdownProps = {
    title: string,
    content: any[]
}
// const normaliseItems = (item) =>{
//     return(
//         title: item.name || item.type ||
//     )
// }
const CustomDropDown = ({title, content}: CustomDropdownProps) =>{
    const [expanded, setExpanded] = useState(false);
    console.log('Passed into CustomDropDown: ', content);
    const handleExpanded = () => setExpanded(!expanded);
    return(
        <SafeAreaView>
        <List.Accordion title={title} onPress={handleExpanded} expanded={expanded}
                        >

            <ScrollView>
            {content.map((item, index) =>(
                <List.Item title={item.name} description={item.name} key={index}
                            />
            ))}
            </ScrollView>
        </List.Accordion>
        </SafeAreaView>
    )
}

export default CustomDropDown