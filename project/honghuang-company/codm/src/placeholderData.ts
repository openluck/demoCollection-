import { IMossConfigData } from '@components/GuideImgVideoPanel';

// note: 描述了不同尺寸的图片占位图
type PlacehoderImageType = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * note: 在 GuideImgVideoPanel 组件中的上部分的 banner 的占位数据
 */
export const createMossConfigData = (count: number, imgType: PlacehoderImageType) => {
  const list: IMossConfigData[] = [];
  for (let i = 0; i < count; i++) {
    const item: IMossConfigData = {
      id: i,
      img: getPlacehoderImageUrl(imgType),
      title: '',
      url: '',
    };
    list.push(item);
  }
  return list;
};

/**
 * note: 在 GuideImgVideoPanel 组件中的下部分的 v4 内容数据列表的占位数据
 */
export const createV4ListData = (count: number, imgType: PlacehoderImageType) => {
  const list: Partial<IV4ListItemData>[] = [];
  for (let i = 0; i < count; i++) {
    const item: Partial<IV4ListItemData> = {
      iId: i,
      sIMG: getPlacehoderImageUrl(imgType),
      sTitle: '',
      iTotalPlay: 0,
    };
    list.push(item);
  }
  return list;
};

function getPlacehoderImageUrl(type: PlacehoderImageType) {
  switch (type) {
    case 0:
      return 'https://gzhcos.qq.com/codm/placeholder/159-90.jpg';
    case 1:
      // return 'https://tiem-cdn.qq.com/sy/ingame_assets/images/placeholder/252-252.jpg';
      return 'https://gzhcos.qq.com/codm/placeholder/252-252.jpg';
    case 2:
      return 'https://gzhcos.qq.com/codm/placeholder/253-155.jpg';
    case 3:
      return 'https://gzhcos.qq.com/codm/placeholder/257-117.png';
    case 4:
      return 'https://gzhcos.qq.com/codm/placeholder/307-173.jpg';
    case 5:
      return 'https://gzhcos.qq.com/codm/placeholder/375-187.jpg';
    default:
      return 'https://gzhcos.qq.com/codm/placeholder/253-155.jpg';
  }
}
