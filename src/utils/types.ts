export type ImageViewer = {
  urls: string[];
  visible: boolean;
  onClose: () => void;
  index: number;
  onIndexChange: React.Dispatch<React.SetStateAction<number>>;
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
