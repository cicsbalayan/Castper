declare module "pptxjs" {
  interface PptxSlide {
    getSlideNumber(): number;
    getelement(): HTMLElement;
  }

  interface PptxPresentation {
    slides(): PptxSlide[];
    getSlide(num: number): PptxSlide;
  }

  interface PptxOptions {
    container?: string | HTMLElement;
    slideRatio?: { w: number; h: number };
    slideChangeSpeed?: number;
  }

  function pptx(content: ArrayBuffer | Blob | string): Promise<PptxPresentation>;

  export default pptx;
  export { PptxPresentation, PptxSlide, PptxOptions };
}

