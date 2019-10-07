package com.letswaitdating;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.sensors.RNSensorsPackage;
import com.apsl.versionnumber.RNVersionNumberPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.marianhello.bgloc.react.BackgroundGeolocationPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import org.reactnative.camera.RNCameraPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.mkuczera.RNReactNativeHapticFeedbackPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSensorsPackage(),
            new RNVersionNumberPackage(),
            new RNSoundPackage(),
            new CookieManagerPackage(),
            new BackgroundGeolocationPackage(),
            new AsyncStoragePackage(),
            new FBSDKPackage(),
            new ReactVideoPackage(),
            new ReactNativePushNotificationPackage(),
            new LottiePackage(),
            new RNCameraPackage(),
            new VectorIconsPackage(),
            new LinearGradientPackage(),
            new RNReactNativeHapticFeedbackPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
