import React, { ReactNode } from 'react'
import {
  Animated,
  Easing,
} from 'react-native'

interface IProps {
  children: ReactNode,
  anim: Animated.Value
  currentRoute: string,
  animating: boolean,
}
interface IState {
  previousChildren: ReactNode | null
}
export default class AnimatedChild extends React.Component<IProps,IState> {
  public state: IState = {
    // we're going to save the old children so we can render
    // it when it doesn't actually match the location anymore
    previousChildren: null,
  };

  // tslint:disable-next-line: function-name
  public UNSAFE_componentWillReceiveProps(nextProps: IProps) {
    // figure out what to do with the children
    const routeChanging = nextProps.currentRoute !== this.props.currentRoute && !this.props.animating
    const animationEnded = this.props.animating && !nextProps.animating;

    if (routeChanging) {
      // we were rendering, but now we're heading back up to the parent,
      // so we need to save the children (har har) so we can render them
      // while the animation is playing
      this.setState({
        previousChildren: this.props.children,
      });
    } else if (animationEnded) {
      // When we're done animating, we can get rid of the old children.
      this.setState({
        previousChildren: null,
      });
    }
  }

  public render() {
    const { anim, children } = this.props;
    const { previousChildren } = this.state;
    return (
      <Animated.View
        style={{
          opacity: anim,
          flex: 1,
          flexGrow: 1,
        }}
      >
        {/* render the old ones if we have them */}
        {previousChildren || children}
      </Animated.View>
    );
  }
}
