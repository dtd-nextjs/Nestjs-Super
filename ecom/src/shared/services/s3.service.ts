import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { Injectable } from '@nestjs/common'
import { readFileSync } from 'fs'
import envConfig from 'src/shared/config'

@Injectable()
export class S3Service {
  private s3: S3
  constructor() {
    this.s3 = new S3({
      region: envConfig.S3_REGION,
      credentials: {
        secretAccessKey: envConfig.S3_SECRET_KEY,
        accessKeyId: envConfig.S3_ACCESS_KEY,
      },
    })
  }

  uploadedFile({ filename, filepath, contentType }: { filename: string; filepath: string; contentType: string }) {
    const parallelUploads3 = new Upload({
      client: this.s3,
      params: {
        Bucket: envConfig.S3_BUCKET_NAME,
        Key: filename,
        Body: readFileSync(filepath),
        ContentType: contentType,
      },
      tags: [],
      queueSize: 4,
      partSize: 1024 * 1024 * 5,
      leavePartsOnError: false,
    })
    return parallelUploads3.done()
  }
}
