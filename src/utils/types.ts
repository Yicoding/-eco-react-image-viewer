export type ImageViewer = {
  urls?: string[];
  onClose?: () => void;
  index?: number;
};

export type MoveInfo = {
  x: number;
  y: number;
};

export type ImageItem = {
  src: string;
  site: number;
  index: number;
  transInfo: MoveInfo;
  scaleRate: number;
  innerInfo: Info;
  isTrans: boolean;
};

export type Info = {
  width: number;
  height: number;
};
