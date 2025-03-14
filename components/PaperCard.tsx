import {Card, Avatar, Text, Button} from 'react-native-paper'
import {ImageURISource} from "react-native";

const LeftContent = props => <Avatar.Icon {...props} icon="cog" />

type contentProp = {
    title: string,
    subTitle: string,
    body: string,
    img: ImageURISource
}


function PaperCard(content: contentProp)
{
    return(
    <Card mode={'elevated'} elevation={5}>
        <Card.Title title={content.title} subtitle={content.subTitle} left={LeftContent}/>
        <Card.Content>
            <Text variant="titleLarge">{content.title}</Text>
            <Text variant="bodyMedium">{content.body}</Text>
        </Card.Content>
        <Card.Cover source={content.img}/>
        <Card.Actions >
            <Button>Cancel</Button>
            <Button>Ok</Button>
        </Card.Actions>
    </Card>
    )
}

export default PaperCard
