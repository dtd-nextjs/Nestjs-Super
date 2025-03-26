import { S3 } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
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
    this.s3.listBuckets({}).then((res) => {
      console.log(res)
    })
  }
}
