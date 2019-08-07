import StatusBarIos from './StatusBarComponent.ios';
import * as ios from './StatusBarComponent.ios';
// import DefaultAndroid from './index.android';
// import * as android from './index.android';

declare var _test: typeof ios;
// declare var _test: typeof android;

declare var _testDefault: typeof StatusBarIos;
// declare var _testDefault: typeof DefaultAndroid;

export * from './StatusBarComponent.ios';
export default StatusBarIos;