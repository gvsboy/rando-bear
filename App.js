import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';
import Card from './src/Card';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#aaa',
    paddingTop: 100
  },
  text: {
    fontSize: 36,
    paddingBottom: 36
  },
  card: {
    width: 100,
    height: 100,
    borderWidth: 0
  },
  face: {
    width: 100,
    height: 100,
    backgroundColor: '#ccc'
  }
});

class BearImage extends React.Component {
  render() {
    const width = this.props.width;
    const height = this.props.height;
    const picture = {
      uri: `https://placebear.com/g/${width}/${height}`
    };

    return (
      <Image source={picture} style={{ width, height }}/>
    );
  }
}

function randomNumber(min, max) {
  return Math.round(Math.random(max) * 100) + min;
}

export default class App extends React.Component {
  constructor() {
    super();
    this.onPressButton = this.onPressButton.bind(this);
    this.state = this.getRandomDimensions();
  }

  getRandomDimensions() {
    return {
      width: randomNumber(100, 200),
      height: randomNumber(100, 300)
    };
  }

  onPressButton() {
    this.setState(this.getRandomDimensions());
  }

  render() {
    const width = this.state.width;
    const height = this.state.height;

    return (
      <View style={styles.container}>
        <Text style={styles.text}>Rando Bear Time!</Text>

        <Card
          perspective={300}
          onFlipEnd={(isFlipEnd)=>{console.log('isFlipEnd', isFlipEnd)}}
          onFlipStart={this.onPressButton}
          style={styles.card}
        >
          {/* Face Side */}
          <View style={[styles.face, { width, height }]}>
            <BearImage width={width} height={height}/>
          </View>
          {/* Back Side */}
          <View style={[styles.face, { width, height }]}>
            <BearImage width={width} height={height}/>
          </View>
        </Card>

      </View>
    );
  }
}
