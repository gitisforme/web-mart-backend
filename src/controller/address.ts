import { getRepository } from "typeorm";
import { Request, Response } from "express";

import { Address } from "../model/Address";


export const getUserAddresses = () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      user: { id }
    } = req;

    let userAddresses = await getRepository(Address).find({
      where: { user: { id: id } },
    });
    console.log('==============================================', userAddresses)
    res.json(userAddresses);
  };


export const addUserAddress = () => async (req: Request, res: Response): Promise<void> => {
  const {
    user: { id },
    body: {/** data */ }
  } = req;

  let userAddresses = await getRepository(Address).create({
    /** data */
    // where: { user: { id: id } },
  });
  res.json(userAddresses);
};