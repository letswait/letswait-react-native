import CameraModalIos from './Camera.ios';
import * as ios from './Camera.ios';
// import DefaultAndroid from './index.android';
// import * as android from './index.android';

declare var _test: typeof ios;
// declare var _test: typeof android;

declare var _testDefault: typeof CameraModalIos;
// declare var _testDefault: typeof DefaultAndroid;

export * from './Camera.ios';
export default CameraModalIos;