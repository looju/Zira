import Realm from "realm";

class UserModel extends Realm.Object {}
UserModel.schema = {
  name: "user",
  properties: {
    id: "string",
    number: "string",
    country: "string",
  },
};

export default UserModel;
