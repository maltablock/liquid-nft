import { NextFunction, Request, Response } from "express";
import { pickPublicFields } from "../utils/format";
import UserData, { IUserData } from "../models/UserData";
import { logger } from "../logger";
import { getStorageClient } from "../eos/storage";

export default class UserController {
  async login(request: Request, response: Response, next: NextFunction) {
    try {
      const account: string = (request as any).account;

      let user = await UserData.findOne({ account });
      if (!user) {
        user = await UserData.create({
          account: account,
          bytesPinned: 0,
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
    const account: string = (request as any).account;
    if (!request.files) {
      throw new Error("file is not found");
    }
    // accessing the file
    const myFile = request.files.file as { data: Buffer, name: string, size: number };
    logger.info(`Uploaded file`, myFile.name, myFile.size, myFile);

      const client = await getStorageClient();
      const ipfsUri = await client.upload(myFile.data);

    //  mv() method places the file inside public directory
    // myFile.mv(`uploads/${myFile.name}`, function (err) {
    //   if (err) {
    //     console.log(err);
    //     throw new Error("Error occured");
    //   }
    //   // returing the response with file path and name
    // });
    return { name: myFile.name, ipfsHash: ipfsUri };
  }
}
