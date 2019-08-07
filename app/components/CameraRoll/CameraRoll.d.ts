import CameraRollModalIos from './CameraRoll.ios';
import * as ios from './CameraRoll.ios';
// import DefaultAndroid from './index.android';
// import * as android from './index.android';

declare var _test: typeof ios;
// declare var _test: typeof android;

declare var _testDefault: typeof CameraRollModalIos;
// declare var _testDefault: typeof DefaultAndroid;

export * from './CameraRoll.ios';
export default CameraRollModalIos;