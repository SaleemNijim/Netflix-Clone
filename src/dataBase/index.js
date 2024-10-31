import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://saleemtg0203:FU550Onaa5lAN49G@cluster0.skcwhmz.mongodb.net/"
    );


    console.log("mongodb is connected");
  } catch (e) {
    console.log(e);
  }
};

export default connectToDB;



// FU550Onaa5lAN49G

// saleemtg0203