export type ImageViewer = {
  onClose?: () => void;
  index?: number;
  urls?: string[];
};

export type ImageItem = {
  src: string;
  site: number;
  index: number;
};
