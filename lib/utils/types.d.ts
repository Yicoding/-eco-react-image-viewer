export declare type ImageViewer = {
  urls?: string[];
  onClose?: () => void;
  index?: number;
};
export declare type MoveInfo = {
  x: number;
  y: number;
};
export declare type ImageItem = {
  src: string;
  site: number;
  index: number;
  transInfo: MoveInfo;
  scaleRate: number;
  innerInfo: Info;
  isTrans: boolean;
};
export declare type Info = {
  width: number;
  height: number;
};
