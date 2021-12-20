export type ImageViewer = {
  visible: boolean;
  urls: string[];
  onClose?: () => void;
  index?: number;
};

export type MoveInfo = {
  x: number;
  y: number;
};

export type ImageItem = {
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

export type Info = {
  width: number;
  height: number;
};
