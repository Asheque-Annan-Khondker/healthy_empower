import * as tf from '@tensorflow/tfjs'

import * as FileSystem from 'expo-file-system'
import {bundleResourceIO, decodeJpeg} from '@tensorflow/tfjs-react-native'
// use an on-board model file to roughly classify food groups.
// create a table where certain food groups have certain calorie values

async function loadModel(){
    await tf.ready()
    const modelJson = null
    const modelWeight = null

    return await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeight))

}

async function classifyFood(imageUri: string) {
    const imgB64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 })
}