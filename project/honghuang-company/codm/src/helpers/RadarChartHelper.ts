export interface IDrawData {
  label: string;
  value: number;
  max: number;
}

export interface IRadarChartOptions {
  mData: IDrawData[];
  mColorPolygon?: string;
  mColorLines?: string;
  mColorText?: string;
  mRegionColor?: string;
  mPointColor?: string;
  hasPoint?: boolean;
  fontSize?: number;
}

export default class RadarChartHelper {
  private w = 0;
  private h = 0;

  private el!: HTMLElement;

  private mCtx!: CanvasRenderingContext2D;

  // 边数
  private mCount = 0;
  // 中心点
  private mCenter = 0;
  // 半径(减去的值用于给绘制的文本留空间)
  private mRadius = 0;

  // 角度
  private mAngle = 0;

  // 多边形颜色
  private mColorPolygon = '#B8B8B8';

  // 顶点连线颜色
  private mColorLines = '#B8B8B8';

  // label 的颜色
  private mColorText = '#fff';

  private mRegionColor = 'rgba(255, 0, 0, 0.5)';

  private mPointColor = 'rgba(255, 0, 0, 0.8)';

  // private mBgColor: string[] = [];

  private hasPoint = false;

  private mData: IDrawData[] = [];

  private fontSize = 12;

  constructor(el: HTMLElement, options: IRadarChartOptions) {
    const { mData, mColorText, mColorLines, mColorPolygon, mRegionColor, mPointColor, hasPoint, fontSize } = options;
    this.el = el;
    this.w = this.el.clientWidth;
    this.h = this.el.clientHeight + 20;
    this.mCount = mData.length;
    this.mData = mData;
    this.mCenter = this.w / 2 - 1;
    this.mRadius = this.mCenter - this.fontSize - 10;
    this.mAngle = (Math.PI * 2) / this.mCount;
    this.mColorLines = mColorLines ?? '#B8B8B8';
    this.mColorText = mColorText ?? '#fff';
    this.mColorPolygon = mColorPolygon ?? '#B8B8B8';
    this.mRegionColor = mRegionColor ?? 'rgba(255, 0, 0, 0.5)';
    this.mPointColor = mPointColor ?? 'rgba(255, 0, 0, 0.8)';
    this.hasPoint = hasPoint ?? false;
    this.fontSize = fontSize ?? 11;
    this.init();
  }

  public draw() {
    this.drawPolygon();
    this.drawLines();
    this.drawText();
    this.drawRegion();
    if (this.hasPoint) {
      this.drawCircle();
    }
  }

  private init() {
    const canvas = document.createElement('canvas');
    this.el.appendChild(canvas);
    canvas.height = this.h * 2;
    canvas.width = this.w * 2;
    this.mCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.mCtx.scale(2, 2);
    this.mCtx.lineWidth = 1;
  }

  private drawPolygon() {
    this.mCtx.save();

    this.mCtx.strokeStyle = this.mColorPolygon;
    const r = this.mRadius / this.mCount; // 单位半径
    // 画6个圈
    for (let i = 0; i < this.mCount; i++) {
      this.mCtx.beginPath();
      const currR = r * (i + 1); // 当前半径
      // 画6条边
      for (let j = 0; j < this.mCount; j++) {
        const x = this.mCenter + currR * Math.cos(this.mAngle * j);
        const y = this.mCenter + currR * Math.sin(this.mAngle * j);
        this.mCtx.lineTo(x, y);
      }
      this.mCtx.closePath();
      this.mCtx.stroke();
    }

    this.mCtx.restore();
  }

  private drawLines() {
    this.mCtx.save();

    this.mCtx.beginPath();
    this.mCtx.strokeStyle = this.mColorLines;

    for (let i = 0; i < this.mCount; i++) {
      const x = this.mCenter + this.mRadius * Math.cos(this.mAngle * i);
      const y = this.mCenter + this.mRadius * Math.sin(this.mAngle * i);

      this.mCtx.moveTo(this.mCenter, this.mCenter);
      this.mCtx.lineTo(x, y);
    }
    this.mCtx.stroke();
    this.mCtx.restore();
  }

  private drawText() {
    this.mCtx.save();

    // 优化字体的大小在移动端上
    const fontSize = this.fontSize - 2;
    this.mCtx.font = `${fontSize}px Microsoft Yahei`;
    this.mCtx.fillStyle = this.mColorText;

    for (let i = 0; i < this.mCount; i++) {
      const x = this.mCenter + this.mRadius * Math.cos(this.mAngle * i);
      const y = this.mCenter + this.mRadius * Math.sin(this.mAngle * i);

      if (this.mAngle * i >= 0 && this.mAngle * i <= Math.PI / 2) {
        this.mCtx.fillText(this.mData[i].label, x + 2, y + fontSize);
      } else if (this.mAngle * i > Math.PI / 2 && this.mAngle * i <= Math.PI) {
        this.mCtx.fillText(this.mData[i].label, x - this.mCtx.measureText(this.mData[i].label).width, y + fontSize);
      } else if (this.mAngle * i > Math.PI && this.mAngle * i <= (Math.PI * 3) / 2) {
        this.mCtx.fillText(this.mData[i].label, x - this.mCtx.measureText(this.mData[i].label).width - 2, y - 2);
      } else {
        this.mCtx.fillText(this.mData[i].label, x + 3, y - 2);
      }
    }

    this.mCtx.restore();
  }

  private drawRegion() {
    this.mCtx.save();

    this.mCtx.beginPath();
    for (let i = 0; i < this.mCount; i++) {
      const max = this.mData[i].max;
      const value = this.mData[i].value;
      const x = this.mCenter + (this.mRadius * Math.cos(this.mAngle * i) * value) / max;
      const y = this.mCenter + (this.mRadius * Math.sin(this.mAngle * i) * value) / max;

      this.mCtx.lineTo(x, y);
    }
    this.mCtx.closePath();
    this.mCtx.fillStyle = this.mRegionColor;
    this.mCtx.fill();

    this.mCtx.restore();
  }

  private drawCircle() {
    this.mCtx.save();

    const r = this.mCenter / 18;
    for (let i = 0; i < this.mCount; i++) {
      const max = this.mData[i].max;
      const value = this.mData[i].value;
      const x = this.mCenter + (this.mRadius * Math.cos(this.mAngle * i) * value) / max;
      const y = this.mCenter + (this.mRadius * Math.sin(this.mAngle * i) * value) / max;

      this.mCtx.beginPath();
      this.mCtx.arc(x, y, r, 0, Math.PI * 2);
      this.mCtx.fillStyle = this.mPointColor;
      this.mCtx.fill();
    }

    this.mCtx.restore();
  }
}
