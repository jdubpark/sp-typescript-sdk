import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import * as dotenv from "dotenv";

dotenv.config();
chai.use(chaiAsPromised);
chai.should();
chai.config.truncateThreshold = 0;
