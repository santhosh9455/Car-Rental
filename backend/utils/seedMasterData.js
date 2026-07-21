import MasterData from "../models/masterDataModel.js";

export const seedMockMasterData = async () => {
  const mockMasterData = [
    // Locations
    {
      id: "LOC_001",
      type: "location",
      district: "Thiruvananthapuram",
      location: "Trivandrum Central",
    },
    {
      id: "LOC_002",
      type: "location",
      district: "Ernakulam",
      location: "Kochi Airport",
    },
    {
      id: "LOC_003",
      type: "location",
      district: "Kozhikode",
      location: "Kozhikode Railway Station",
    },
    {
      id: "LOC_004",
      type: "location",
      district: "Thrissur",
      location: "Thrissur Town",
    },

    // Cars
    {
      id: "CAR_001",
      type: "car",
      brand: "Maruti Suzuki",
      model: "Swift",
      variant: "LXI",
      photoUrl: "/src/Assets/booking swift lxi.jpeg",
    },
    {
      id: "CAR_002",
      type: "car",
      brand: "Maruti Suzuki",
      model: "WagonR",
      variant: "VXI",
      photoUrl: "/src/Assets/booking waganor blue.png",
    },
    {
      id: "CAR_003",
      type: "car",
      brand: "Hyundai",
      model: "Creta",
      variant: "SX",
      photoUrl: "/src/Assets/vehicleModel3.png",
    },
    {
      id: "CAR_004",
      type: "car",
      brand: "Honda",
      model: "City",
      variant: "ZX",
      photoUrl: "/src/Assets/vehicleModel1.png",
    },
    {
      id: "CAR_005",
      type: "car",
      brand: "Tata",
      model: "Nexon",
      variant: "XZA+",
      photoUrl: "/src/Assets/vehicleModel4.png",
    },
    {
      id: "CAR_006",
      type: "car",
      brand: "Kia",
      model: "Seltos",
      variant: "GTX+",
      photoUrl: "/src/Assets/vehicleModel6.png",
    }
  ];

  try {
    const existingData = await MasterData.findOne({ id: "LOC_001" });
    if (!existingData) {
      await MasterData.insertMany(mockMasterData);
      console.log(`\n✅ Successfully seeded ${mockMasterData.length} master data records!\n`);
    } else {
      console.log(`\nMaster data already exists in DB. Skipping master data seeding.\n`);
    }
  } catch (error) {
    console.error("Error seeding master data:", error);
  }
};
