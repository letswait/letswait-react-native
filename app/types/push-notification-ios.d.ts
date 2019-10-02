declare module '@react-native-community/push-notification-ios' {

  export type ContentAvailable = 1 | null | void

  // tslint:disable-next-line: interface-name
  export interface FetchResult {
    NewData: string,
    NoData: string,
    ResultFailed: string,
  }

  export interface PushNotificationPermissions {
    alert?: boolean,
    badge?: boolean,
    sound?: boolean,
  }

  export type Permissions = {
    alert: boolean,
    badge: boolean,
    sound: boolean,
  }

  export interface INotificationContent {
    identifier: string
    date: Date
    title: string | null
    // subtitle: string | null
    body: string | null
    // badge?: number
    // sound?: UNNotificationSound
    // launchImageName: string
    // attachments?: Array<UNNotificationAttachment>
    // summaryArgument?: string
    // summaryArgumentCount?: number
    category: string | null
    'thread-id': string | null
    userInfo: NotificationDataIOS
    // targetContentIdentifier?: string
  }

  

  export type NotificationDataIOS = {
    [extradata: string]: any
  }

  export type ScheduleLocalNotificationDetails = {
    alertAction?: string;
    alertBody?: string;
    alertTitle?: string;
    applicationIconBadgeNumber?: number;
    category?: string;
    fireDate?: number | string;
    isSilent?: boolean;
    repeatInterval?: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute';
    soundName?: string;
    userInfo?: Object;
  };

  export interface ILocalNotificationDetails {

  }
  type PresentLocalNotificationDetails = {
    alertBody: string;
    alertAction: string;
    alertTitle?: string;
    soundName?: string;
    category?: string;
    userInfo?: Object;
    applicationIconBadgeNumber?: number;
  };

  /**
   * An event emitted by PushNotificationIOS.
   */
  export type PushNotificationEventName = 'notification' | 'localNotification' | 'register' | 'registrationError'
  // export type PushNotificationEventName = {
  //   /**
  //    * Fired when a remote notification is received. The handler will be invoked
  //    * with an instance of `PushNotificationIOS`.
  //    */
  //   notification: string,
  //   /**
  //    * Fired when a local notification is received. The handler will be invoked
  //    * with an instance of `PushNotificationIOS`.
  //    */
  //   localNotification: string,
  //   /**
  //    * Fired when the user registers for remote notifications. The handler will be
  //    * invoked with a hex string representing the deviceToken.
  //    */
  //   register: string,
  //   /**
  //    * Fired when the user fails to register for remote notifications. Typically
  //    * occurs when APNS is having issues, or the device is a simulator. The
  //    * handler will be invoked with {message: string, code: number, details: any}.
  //    */
  //   registrationError: string,
  // }

   /**
  *
  * Handle push notifications for your app, including permission handling and
  * icon badge number.
  *
  * See https://facebook.github.io/react-native/docs/pushnotificationios.html
  */
// class PushNotificationIOS {
//   _data: {}
//   _alert: string | {}
//   _sound: string;
//   _category: string;
//   _contentAvailable: ContentAvailable;
//   _badgeCount: number;
//   _notificationId: string;
//   _isRemote: boolean;
//   _remoteNotificationCompleteCallbackCalled: boolean;
//   _threadID: string;
//   static FetchResult: FetchResult
//   /**
//    * Schedules the localNotification for immediate presentation.
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#presentlocalnotification
//    */
//   static presentLocalNotification(details: ILocalNotificationDetails): void
//   /**
//    * Schedules the localNotification for future presentation.
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#schedulelocalnotification
//    */
//   static scheduleLocalNotification(details: IScheduleLocalNotificationDetails): void
//   /**
//    * Cancels all scheduled localNotifications.
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#cancelalllocalnotifications
//    */
//   static cancelAllLocalNotifications(): void
//   /**
//    * Remove all delivered notifications from Notification Center.
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#removealldeliverednotifications
//    */
//   static removeAllDeliveredNotifications(): void
//   /**
//    * Provides you with a list of the app’s notifications that are still displayed in Notification Center.
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#getdeliverednotifications
//    */
//   static getDeliveredNotifications(
//     callback: (notifications: Array<INotificationContent>) => void,
//   ): void
//   /**
//    * Removes the specified notifications from Notification Center
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#removedeliverednotifications
//    */
//   static removeDeliveredNotifications(identifiers: Array<string>): void
//   /**
//    * Sets the badge number for the app icon on the home screen.
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#setapplicationiconbadgenumber
//    */
//   static setApplicationIconBadgeNumber(number: number): void
//   /**
//    * Gets the current badge number for the app icon on the home screen.
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#getapplicationiconbadgenumber
//    */
//   static getApplicationIconBadgeNumber(callback: Function): void
//   /**
//    * Cancel local notifications.
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#cancellocalnotification
//    */
//   static cancelLocalNotifications(userInfo: PermissionDataIOS): void
//   /**
//    * Gets the local notifications that are currently scheduled.
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#getscheduledlocalnotifications
//    */
//   static getScheduledLocalNotifications(callback: Function): void
//   /**
//    * Attaches a listener to remote or local notification events while the app
//    * is running in the foreground or the background.
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#addeventlistener
//    */
//   static addEventListener(type: PushNotificationEventName, handler: Function): void
//   /**
//    * Removes the event listener. Do this in `componentWillUnmount` to prevent
//    * memory leaks.
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#removeeventlistener
//    */
//   static removeEventListener(
//     type: PushNotificationEventName,
//     handler: Function,
//   ): void
//   /**
//    * Requests notification permissions from iOS, prompting the user's
//    * dialog box. By default, it will request all notification permissions, but
//    * a subset of these can be requested by passing a map of requested
//    * permissions.
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#requestpermissions
//    */
//   static requestPermissions(permissions?: IPermissions): Promise<Permissions>
//   /**
//    * Unregister for all remote notifications received via Apple Push Notification service.
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#abandonpermissions
//    */
//   static abandonPermissions(): void
//   /**
//    * See what push permissions are currently enabled. `callback` will be
//    * invoked with a `permissions` object.
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#checkpermissions
//    */
//   static checkPermissions(callback: Function): void
//   /**
//    * This method returns a promise that resolves to either the notification
//    * object if the app was launched by a push notification, or `null` otherwise.
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#getinitialnotification
//    */
//   static getInitialNotification(): Promise<PushNotificationIOS>
//   /**
//    * You will never need to instantiate `PushNotificationIOS` yourself.
//    * Listening to the `notification` event and invoking
//    * `getInitialNotification` is sufficient
//    *
//    */
//   constructor(nativeNotif: Oobject)
//   /**
//    * This method is available for remote notifications that have been received via:
//    * `application:didReceiveRemoteNotification:fetchCompletionHandler:`
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#finish
//    */
//   finish(fetchResult: string): void
//   /**
//    * An alias for `getAlert` to get the notification's main message string
//    */
//   getMessage(): string | Oobject | null
//   /**
//    * Gets the sound string from the `aps` object
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#getsound
//    */
//   getSound(): string | null
//   /**
//    * Gets the category string from the `aps` object
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#getcategory
//    */
//   getCategory(): string | null
//   /**
//    * Gets the notification's main message from the `aps` object
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#getalert
//    */
//   getAlert(): string | Oobject | null
//   /**
//    * Gets the content-available number from the `aps` object
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#getcontentavailable
//    */
//   getContentAvailable(): ContentAvailable
//   /**
//    * Gets the badge count number from the `aps` object
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#getbadgecount
//    */
//   getBadgeCount(): number | null
//   /**
//    * Gets the data object on the notif
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#getdata
//    */
//   getData(): Oobject | null
//   /**
//    * Gets the thread ID on the notif
//    *
//    * See https://facebook.github.io/react-native/docs/pushnotificationios.html#getthreadid
//    */
//   getThreadID(): string | null
//   }
  export interface PushNotification {
    /**
     * An alias for `getAlert` to get the notification's main message string
     */
    getMessage(): string | Object;

    /**
     * Gets the sound string from the `aps` object
     */
    getSound(): string;

    /**
     * Gets the category string from the `aps` object
     */
    getCategory(): string;

    /**
     * Gets the notification's main message from the `aps` object
     */
    getAlert(): string | Object;

    /**
     * Gets the content-available number from the `aps` object
     */
    getContentAvailable(): number;

    /**
     * Gets the badge count number from the `aps` object
     */
    getBadgeCount(): number;

    /**
     * Gets the data object on the notif
     */
    getData(): Object;

    /**
     * iOS Only
     * Signifies remote notification handling is complete
     */
    finish(result: string): void;
  }
  export interface PushNotificationIOSStatic {
    /**
     * Schedules the localNotification for immediate presentation.
     * details is an object containing:
     * alertBody : The message displayed in the notification alert.
     * alertAction : The "action" displayed beneath an actionable notification. Defaults to "view";
     * soundName : The sound played when the notification is fired (optional).
     * category : The category of this notification, required for actionable notifications (optional).
     * userInfo : An optional object containing additional notification data.
     * applicationIconBadgeNumber (optional) : The number to display as the app's icon badge. The default value of this property is 0, which means that no badge is displayed.
     */
    presentLocalNotification(details: PresentLocalNotificationDetails): void;

    /**
     * Schedules the localNotification for future presentation.
     * details is an object containing:
     * fireDate : The date and time when the system should deliver the notification.
     * alertBody : The message displayed in the notification alert.
     * alertAction : The "action" displayed beneath an actionable notification. Defaults to "view";
     * soundName : The sound played when the notification is fired (optional).
     * category : The category of this notification, required for actionable notifications (optional).
     * userInfo : An optional object containing additional notification data.
     * applicationIconBadgeNumber (optional) : The number to display as the app's icon badge. Setting the number to 0 removes the icon badge.
     */
    scheduleLocalNotification(details: ScheduleLocalNotificationDetails): void;

    /**
     * Cancels all scheduled localNotifications
     */
    cancelAllLocalNotifications(): void;

    /**
     * Cancel local notifications.
     * Optionally restricts the set of canceled notifications to those notifications whose userInfo fields match the corresponding fields in the userInfo argument.
     */
    cancelLocalNotifications(userInfo: Object): void;

    /**
     * Sets the badge number for the app icon on the home screen
     */
    setApplicationIconBadgeNumber(number: number): void;

    /**
     * Gets the current badge number for the app icon on the home screen
     */
    getApplicationIconBadgeNumber(callback: (badge: number) => void): void;

    /**
     * Gets the local notifications that are currently scheduled.
     */
    getScheduledLocalNotifications(callback: (notifications: ScheduleLocalNotificationDetails[]) => void): void;

    /**
     * Attaches a listener to remote notifications while the app is running in the
     * foreground or the background.
     *
     * The handler will get be invoked with an instance of `PushNotificationIOS`
     *
     * The type MUST be 'notification'
     */
    addEventListener(
        type: 'notification' | 'localNotification',
        handler: (notification: PushNotification) => void,
    ): void;

    /**
     * Fired when the user registers for remote notifications.
     *
     * The handler will be invoked with a hex string representing the deviceToken.
     *
     * The type MUST be 'register'
     */
    addEventListener(type: 'register', handler: (deviceToken: string) => void): void;

    /**
     * Fired when the user fails to register for remote notifications.
     * Typically occurs when APNS is having issues, or the device is a simulator.
     *
     * The handler will be invoked with {message: string, code: number, details: any}.
     *
     * The type MUST be 'registrationError'
     */
    addEventListener(
        type: 'registrationError',
        handler: (error: { message: string; code: number; details: any }) => void,
    ): void;

    /**
     * Removes the event listener. Do this in `componentWillUnmount` to prevent
     * memory leaks
     */
    removeEventListener(
        type: PushNotificationEventName,
        handler:
            | ((notification: PushNotification) => void)
            | ((deviceToken: string) => void)
            | ((error: { message: string; code: number; details: any }) => void),
    ): void;

    /**
     * Requests all notification permissions from iOS, prompting the user's
     * dialog box.
     */
    requestPermissions(permissions?: PushNotificationPermissions[]): void;

    /**
     * Requests all notification permissions from iOS, prompting the user's
     * dialog box.
     */
    requestPermissions(permissions?: PushNotificationPermissions): Promise<PushNotificationPermissions>;

    /**
     * Unregister for all remote notifications received via Apple Push
     * Notification service.
     * You should call this method in rare circumstances only, such as when
     * a new version of the app removes support for all types of remote
     * notifications. Users can temporarily prevent apps from receiving
     * remote notifications through the Notifications section of the
     * Settings app. Apps unregistered through this method can always
     * re-register.
     */
    abandonPermissions(): void;

    /**
     * See what push permissions are currently enabled. `callback` will be
     * invoked with a `permissions` object:
     *
     *  - `alert` :boolean
     *  - `badge` :boolean
     *  - `sound` :boolean
     */
    checkPermissions(callback: (permissions: PushNotificationPermissions) => void): void;

    /**
     * This method returns a promise that resolves to either the notification
     * object if the app was launched by a push notification, or `null` otherwise.
     */
    getInitialNotification(): Promise<PushNotification | null>;

    /**
     * iOS fetch results that best describe the result of a finished remote notification handler.
     * For a list of possible values, see `PushNotificationIOS.FetchResult`.
     */
    FetchResult: FetchResult;
  }
  export const PushNotificationIOS: PushNotificationIOSStatic
  export type PushNotificationIOS = PushNotificationIOSStatic
  export default PushNotificationIOS
}