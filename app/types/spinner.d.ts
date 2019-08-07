interface SpinnerDateLocation {
  name: string,
  deal: string,
  dealID: string,
  image: string
}

export type SpinnerDeals = {
  0: SpinnerDateLocation,
  1: SpinnerDateLocation,
  2: SpinnerDateLocation,
  3: SpinnerDateLocation,
  4: SpinnerDateLocation,
  5: SpinnerDateLocation,
  6: SpinnerDateLocation,
  7: SpinnerDateLocation,
} & Array<SpinnerDateLocation>

export type SpinnerSegmentType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface ISegmentInfo {
  image: string,
  title: string,
  subtitle?: string,
}

export type SpinnerInfo = {
  0: ISegmentInfo,
  1: ISegmentInfo,
  2: ISegmentInfo,
  3: ISegmentInfo,
  4: ISegmentInfo,
  5: ISegmentInfo,
  6: ISegmentInfo,
  7: ISegmentInfo,
} & Array<ISegmentInfo>