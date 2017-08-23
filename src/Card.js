import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  flipCard: {
    flex: 1,
    borderWidth: 1
  },

  face: {
    flex: 1
  },

  back: {
    flex: 1
  }
});

export default class Card extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isFlipped: props.flip,
      isFlipping: false,
      rotate: new Animated.Value(Number(props.flip)),
      height: 0,
      width: 0,
      face: {
        width: 0,
        height: 0
      },
      back: {
        width: 0,
        height: 0
      }
    };
  }

  flip() {
    this.setState({ isFlipping: true });
    this.props.onFlipStart(this.state.isFlipped);
    this.animate(!this.state.isFlipped);
  }

  animate(isFlipped) {
    this.setState({isFlipped: !this.state.isFlipped});

    Animated.spring(this.state.rotate, {
      toValue: Number(isFlipped),
      friction: this.props.friction,
      useNativeDriver: true
    })
    .start(() => {
      this.setState({ isFlipping: false });
      this.props.onFlipEnd(this.state.isFlipped);
    });
  }

  render() {
    const children = this.props.children;
    const transform = [];
    var render_side = false

    if (this.props.perspective) {
      transform.push({
        perspective: this.props.perspective
      });
    }

    transform.push({
      rotateY: this.state.rotate.interpolate({
        inputRange: [0, 1],
        outputRange: [ '0deg', '180deg' ]
      })
    });

    if (this.state.isFlipped) {
      render_side = (
        <Back
          style={[ this.state.height > 0 && {height: this.state.height}, this.state.width > 0 && {width: this.state.width}]}
          onLayout={(event) => {
            var {x, y, width, height} = event.nativeEvent.layout
            var _update = Object.assign(this.state.back, {width: width, height: height})
            this.setState({back: _update})
          }}
        >
          { children[1] }
        </Back>
      )
    } else {
      render_side = (
        <Face
          style={[ this.state.height > 0 && { height: this.state.height }, this.state.width > 0 && { width: this.state.width }]}
          onLayout={(event) => {
            var {x, y, width, height} = event.nativeEvent.layout;
            var _update = Object.assign(this.state.face, {width: width, height: height})
            this.setState({face: _update})
          }}
        >
          { children[0] }
        </Face>
      )
    }
      
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={ () => this.flip() }
      >
        <Animated.View
          { ...this.props }
          style={[
            styles.flipCard,
            {
              transform,
              opacity: 1,
            },
            this.props.style
          ]}
        >
          {render_side}
        </Animated.View>
      </TouchableOpacity>
    );
  }

}

export class Face extends Component {
  render() {
    return (
      <View
        style={[
          styles.face,
          this.props.style
        ]}
        onLayout={this.props.onLayout}
      >
        {this.props.children}
      </View>
    );
  }
}

export class Back extends Component {
  render() {
    return (
      <View
        style={[
          styles.back,
          this.props.style,
        ]}
        onLayout={ this.props.onLayout }>
        { this.props.children }
      </View>
    );
  }
}

// The `defaultProps` property is special. It will automagically assign
// component props that are not explicitly passed in, it seems.
Card.defaultProps = {
  flip: false,
  friction: 6,
  perspective: 0,
  onFlipEnd: () => {},
  onFlipStart: () => {},
};
