// note: 通用投票
interface IVoteWorkData {
  type1: number;
  type2: number;
}

interface ITestListUrlData {
  confUrlInfo: {
    type: string;
    urlList: {
      name: string;
      url: string;
    }[];
  }[];
}

interface IThumbsData {
  thumbsList: IVoteWorkData;
  thumbsType: number; // 作品类型
  thumbsNums: number;
}
