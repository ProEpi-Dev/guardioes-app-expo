import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { styles } from './styles';
import { scale } from '../../../utils/scalling';

export function Quizzes() {
    const isDisabled = false
  return (
    <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
            <TouchableOpacity
                activeOpacity={0.5}
                disabled={isDisabled}
                style={[
                    styles.button,
                    isDisabled && styles.buttonDisabled
                ]}
                onPress={() => console.log('Botão pressionado!')}
            >
                <View style={styles.box}>
                    <View style={styles.iconWrapper}>
                        <Feather 
                            name="lock" 
                            size={scale(26)} 
                            color='#348eac'
                        />
                    </View>
                    <View style={styles.infoWrapper}>
                        <Text style={styles.title}>Ferramentas digitais para tomada de decisao</Text>
                        <Text style={styles.title}>0/100</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.5}
                disabled={isDisabled}
                style={[
                    styles.button,
                    isDisabled && styles.buttonDisabled
                ]}
                onPress={() => console.log('Botão pressionado!')}
            >
                <View style={styles.box}>
                    <View style={styles.iconWrapper}>
                        <Feather 
                            name="lock" 
                            size={scale(26)} 
                            color='#348eac'
                        />
                    </View>
                    <View style={styles.infoWrapper}>
                        <Text style={styles.title}>Ferramentas digitais para tomada de decisao</Text>
                        <Text style={styles.title}>0/100</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.5}
                disabled={isDisabled}
                style={[
                    styles.button,
                    isDisabled && styles.buttonDisabled
                ]}
                onPress={() => console.log('Botão pressionado!')}
            >
                <View style={styles.box}>
                    <View style={styles.iconWrapper}>
                        <Feather 
                            name="lock" 
                            size={scale(26)} 
                            color='#348eac'
                        />
                    </View>
                    <View style={styles.infoWrapper}>
                        <Text style={styles.title}>Participacao social</Text>
                        <Text style={styles.title}>0/100</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </ScrollView>
    </View>
  );
}