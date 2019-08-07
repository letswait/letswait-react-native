
declare enum PhotoType {
  'photo',
  'video'
}
declare enum  PhotoExtension {
  jpg = 'image/jpeg', // iOS Camera Photo
  png = 'image/png', // iOS Screenshot
}

export interface IPhotoReference {
  uri: string;
  type: PhotoExtension | PhotoType;
  name: string;
}

export interface IPhotoNode {
  type: string;
  group_name: string;
  image: {
    uri: string;
    height: number;
    width: number;
    isStored?: boolean;
  };
  timestamp: number;
  location: {
    latitude: number;
    longitude: number;
    altitude: number;
    heading: number;
    speed: number;
  }
}
export interface IPhoto {
  node: IPhotoNode
}
export type CameraRollRow = IPhoto[]

export interface IMediaReference {
  uri: string;
  type?: string;
}