import React, {useState} from "react";
import {List} from "react-native-paper";

type CustomDropdownProps = {
    title: string,
    content: []
}

const CustomDropDown = ({title, content}: CustomDropdownProps) =>{
    const [expanded, setExpanded] = useState(false);

    const handleExpanded = () => setExpanded(!expanded);
    return(
        <List.Accordion title={title} onPress={handleExpanded} expanded={false}
                        >
            {content.map((item, index) =>(
                <List.Item title={content.title} description={content.description} key={index}
                            />
            ))}
        </List.Accordion>
    )
}

export default CustomDropDown;