import React, {useState} from "react";
import {List} from "react-native-paper";

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

    const handleExpanded = () => setExpanded(!expanded);
    return(
        <List.Accordion title={title} onPress={handleExpanded} expanded={expanded}
                        >
            {content.map((item, index) =>(
                <List.Item title={item.id} description={item.description} key={index}
                            />
            ))}
        </List.Accordion>
    )
}

export default CustomDropDown