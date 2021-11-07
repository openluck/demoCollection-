declare module 'cos-js-sdk-v5' {
  const COS: COS;
  export default COS;
}

interface ICosConfig {
  FileParallelLimit?: number; // 控制文件上传并发数
  ChunkParallelLimit?: number; // 控制单个文件下分片上传并发数
  ProgressInterval?: number;
  SecretId?: string;
  SecretKey?: string;
  ChunkSize?: number;
  SliceSize?: number;
  CopyChunkParallelLimit?: number;
  CopyChunkSize?: number;
  CopySliceSize?: number;
  Protocol?: string;
  Domain?: string;
  UploadQueueSize?: number;
  ForcePathStyle?: boolean;
  UploadCheckContentMd5?: boolean;
  Timeout?: number;
  getAuthorization?(args1: any, callback: (config: any) => void): void;
}

interface ICOSUploadConfig {
  Bucket: string,
  Region: string,
  Key: string,
  Body: Blob,
  onTaskReady?(taskId: number): void
}

interface COSInstance {
  sliceUploadFile(config: ICOSUploadConfig, callback: (error: any, data: { Location: string }) => void): void
}

type COS = new (config: ICosConfig) => COSInstance;
