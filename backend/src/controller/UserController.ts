import { NextFunction, Request, Response } from "express";
import { pickPublicFields } from "../utils/format";
import UserData, { IUserData } from "../models/UserData";
import { logger } from "../logger";
import { getStorageClient } from "../eos/storage";

const MAX_UPLOAD_BYTES_PER_USER = 1 * 1024 * 1024 * 1024; // 1gb

async function getUser(account: string) {
  let user = await UserData.findOne({ account });
  if (!user) {
    throw new Error(`User does not exist`);
  }
  return user;
}

export default class UserController {
  async login(request: Request, response: Response, next: NextFunction) {
    try {
      const account: string = (request as any).account;
      if(!account) throw new Error(`Account cannot be empty`)

      let user = await UserData.findOne({ account });
      if (!user) {
        user = await UserData.create({
          account: account,
          bytesPinned: 0,
          files: [],
        });
      }

      return {
        user: pickPublicFields(user),
      };
    } catch (err) {
      throw err;
    }
  }

  async uploadFile(request: Request, response: Response, next: NextFunction) {
    logger.info(`in uploadfile`)
    const account: string = (request as any).account;
    let user = await getUser(account);

    if (!request.files) {
      throw new Error("file not passed");
    }

    const myFile = request.files.file as {
      data: Buffer;
      name: string;
      size: number;
    };

    if (myFile.size > 10 * 1024 * 1024) {
      throw new Error(`File sizes > 10 MB currently not supported`);
    }

    if (user.bytesPinned + myFile.size > MAX_UPLOAD_BYTES_PER_USER) {
      throw new Error(
        `Max upload limit reached. Please upgrade to premium or unpin some files to free space.`
      );
    }

    logger.info(`trying to upload file`, myFile.name, myFile.size);

    const client = await getStorageClient();
    let ipfsHash = ``
    try {
      ipfsHash = await client.upload(myFile.data);
    } catch (error) {
      logger.error(`DSP upload failed`, error.message)
      if (/invalid json response/i.test(error.message)) {
        throw new Error(`Internal Error`);
      }
    }

    const fileDoc = user.files.find((f) => f.ipfsHash === ipfsHash);
    if (!fileDoc) {
      user.files.push({
        ipfsHash: ipfsHash,
        size: myFile.size,
        name: myFile.name,
        uploadedAt: new Date(),
      });
      user.bytesPinned += myFile.size;
      user = await user.save();
    }

    return {
      user: pickPublicFields(user),
    };
  }
}
