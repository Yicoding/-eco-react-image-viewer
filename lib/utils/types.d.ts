export declare type ImagePreview = {
  onClose?: () => void;
  index?: number;
  urls?: string[];
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
  isChange: boolean;
  innerInfo: Info;
};
export declare type Info = {
  width: number;
  height: number;
};
