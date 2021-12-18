export type ImageViewer = {
  onClose?: () => void;
  index?: number;
  urls?: string[];
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
};
