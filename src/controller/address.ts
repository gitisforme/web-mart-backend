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
    res.json(userAddresses);
  };


export const addUserAddress = () => async (req: Request, res: Response): Promise<void> => {
  const {
    user: { id },
    body: { full_name, phone_number, address1, address2, city, county, country, pincode, houseNumber, isDefault, user, userId }
  } = req;
  let userAddresses = await getRepository(Address).insert({
    full_name, phone_number, address1, address2, city, county, pincode, isDefault, user: { id: id }
  });

  res.json(userAddresses);
};

export const updateUserAddress = () => async (req: Request, res: Response): Promise<void> => {
  const {
    user: { id: user_id },
    body: { id: address_id, full_name, phone_number, address1, address2, city, county, country, pincode, houseNumber, isDefault, userId }
  } = req;

  let userAddresses = await getRepository(Address).update({ id: address_id }, {
    full_name, phone_number, address1, address2, city, county, pincode, isDefault, user: { id: user_id }
  });
  res.json(userAddresses);
};

export const deleteUserAddress = () => async (req: Request, res: Response): Promise<void> => {
  const {
    // user: { id },
    body: { address_id }
  } = req;
  console.log("----------------------------------------------------------", req);
  console.log("aaaaaaaaaabbbbbbbbbbbbbaaaaaaaaaaabbbbbb", address_id)

  let result = await getRepository(Address).delete({
    id: address_id
  })
  res.json(result);
};