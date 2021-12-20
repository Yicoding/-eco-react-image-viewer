export declare type ImageViewer = {
  visible: boolean;
  urls: string[];
  onClose?: () => void;
  index?: number;
};
export declare type MoveInfo = {
  x: number;
  y: number;
};
export declare type ImageItem = {
  visible: boolean;
  src: string;
  site: number;
  index: number;
  transInfo: MoveInfo;
  scaleRate: number;
  innerInfo: Info;
  isTrans: boolean;
  rotateVal: number;
};
export declare type Info = {
  width: number;
  height: number;
};
