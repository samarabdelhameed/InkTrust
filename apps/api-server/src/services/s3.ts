import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../config/env";

export class StorageService {
  private client: S3Client;
  private bucket: string;
  private maxRetries = 3;

  constructor() {
    this.client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
      endpoint: env.S3_ENDPOINT || undefined,
      forcePathStyle: true,
    });
    this.bucket = env.S3_BUCKET;
  }

  async uploadFile(key: string, body: Buffer | Uint8Array | string, contentType: string): Promise<string> {
    for (let i = 0; i < this.maxRetries; i++) {
      try {
        const command = new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
          ServerSideEncryption: "AES256",
        });
        await this.client.send(command);
        return `s3://${this.bucket}/${key}`;
      } catch (error) {
        if (i === this.maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
    throw new Error("Upload failed after retries");
  }

  async getSignedUrlForDownload(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.client, command, { expiresIn });
  }

  async getSignedUrlForUpload(key: string, contentType: string, expiresIn = 3600): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });
    return getSignedUrl(this.client, command, { expiresIn });
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({ Bucket: this.bucket, Key: key });
    await this.client.send(command);
  }

  async listFiles(prefix: string) {
    const command = new ListObjectsV2Command({ Bucket: this.bucket, Prefix: prefix });
    const response = await this.client.send(command);
    return (response.Contents ?? []).map(obj => ({
      key: obj.Key,
      size: obj.Size,
      lastModified: obj.LastModified,
    }));
  }

  async downloadFile(key: string) {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    const response = await this.client.send(command);
    const body = await response.Body?.transformToByteArray();
    return { body, contentType: response.ContentType, contentLength: response.ContentLength };
  }

  getKeyForFax(faxRequestId: string, fileName: string) {
    return `faxes/${faxRequestId}/${Date.now()}-${fileName}`;
  }

  getKeyForMedical(userId: string, fileName: string) {
    return `medical/${userId}/${Date.now()}-${fileName}`;
  }

  getKeyForReport(faxRequestId: string) {
    return `reports/${faxRequestId}/${Date.now()}-ai-report.json`;
  }
}

export const storageService = new StorageService();
