import Realm from "realm";
import UserModel from "./userModel";

type userDataType = {
  id: string;
  number: string | string[];
  country: string | string[];
};

const realm = new Realm({ schema: [UserModel] });

const RealmService = {
  getAllUsers: () => realm.objects("user"),

  //Addition of user
  addUser: (user: userDataType) => {
    realm.write(() => {
      realm.create("user", user);
    });
  },

  //Update of user
  updateUser: (id: userDataType, updatedUser) => {
    const user = realm.objectForPrimaryKey("user", id);
    if (user) {
      realm.write(() => {
        Object.keys(updatedUser).forEach((key) => {
          user[key] = updatedUser[key];
        });
      });
    }
  },

  //Delete user
  deleteUser: (id: userDataType) => {
    const user = realm.objectForPrimaryKey("user", id);
    if (user) {
      realm.write(() => {
        realm.delete(user);
      });
    }
  },
};

export default RealmService;
