-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "evesde";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "warehouse";

-- CreateEnum
CREATE TYPE "warehouse"."UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "warehouse"."Character" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "tokenExpiresAt" INTEGER NOT NULL,
    "allianceId" INTEGER,
    "ancestryId" INTEGER NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "bloodlineId" INTEGER NOT NULL,
    "corporationId" INTEGER NOT NULL,
    "description" TEXT,
    "factionId" INTEGER,
    "gender" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "raceId" INTEGER NOT NULL,
    "scopes" TEXT NOT NULL,
    "securityStatus" INTEGER,
    "title" TEXT,
    "totalSp" INTEGER,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse"."User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "warehouse"."UserStatus" NOT NULL DEFAULT 'INACTIVE',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evesde"."agtAgentTypes" (
    "agentTypeID" INTEGER NOT NULL,
    "agentType" VARCHAR(50)
);

-- CreateTable
CREATE TABLE "evesde"."agtAgents" (
    "agentID" INTEGER NOT NULL,
    "divisionID" INTEGER,
    "corporationID" INTEGER,
    "locationID" INTEGER,
    "level" INTEGER,
    "quality" INTEGER,
    "agentTypeID" INTEGER,
    "isLocator" BOOLEAN
);

-- CreateTable
CREATE TABLE "evesde"."agtAgentsInSpace" (
    "agentID" INTEGER NOT NULL,
    "dungeonID" INTEGER,
    "solarSystemID" INTEGER,
    "spawnPointID" INTEGER,
    "typeID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."agtResearchAgents" (
    "agentID" INTEGER NOT NULL,
    "typeID" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "evesde"."certCerts" (
    "certID" INTEGER NOT NULL,
    "description" TEXT,
    "groupID" INTEGER,
    "name" VARCHAR(255)
);

-- CreateTable
CREATE TABLE "evesde"."certMasteries" (
    "typeID" INTEGER,
    "masteryLevel" INTEGER,
    "certID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."certSkills" (
    "certID" INTEGER,
    "skillID" INTEGER,
    "certLevelInt" INTEGER,
    "skillLevel" INTEGER,
    "certLevelText" VARCHAR(8)
);

-- CreateTable
CREATE TABLE "evesde"."chrAncestries" (
    "ancestryID" INTEGER NOT NULL,
    "ancestryName" VARCHAR(100),
    "bloodlineID" INTEGER,
    "description" VARCHAR(1000),
    "perception" INTEGER,
    "willpower" INTEGER,
    "charisma" INTEGER,
    "memory" INTEGER,
    "intelligence" INTEGER,
    "iconID" INTEGER,
    "shortDescription" VARCHAR(500)
);

-- CreateTable
CREATE TABLE "evesde"."chrAttributes" (
    "attributeID" INTEGER NOT NULL,
    "attributeName" VARCHAR(100),
    "description" VARCHAR(1000),
    "iconID" INTEGER,
    "shortDescription" VARCHAR(500),
    "notes" VARCHAR(500)
);

-- CreateTable
CREATE TABLE "evesde"."chrBloodlines" (
    "bloodlineID" INTEGER NOT NULL,
    "bloodlineName" VARCHAR(100),
    "raceID" INTEGER,
    "description" VARCHAR(1000),
    "maleDescription" VARCHAR(1000),
    "femaleDescription" VARCHAR(1000),
    "shipTypeID" INTEGER,
    "corporationID" INTEGER,
    "perception" INTEGER,
    "willpower" INTEGER,
    "charisma" INTEGER,
    "memory" INTEGER,
    "intelligence" INTEGER,
    "iconID" INTEGER,
    "shortDescription" VARCHAR(500),
    "shortMaleDescription" VARCHAR(500),
    "shortFemaleDescription" VARCHAR(500)
);

-- CreateTable
CREATE TABLE "evesde"."chrFactions" (
    "factionID" INTEGER NOT NULL,
    "factionName" VARCHAR(100),
    "description" VARCHAR(1000),
    "raceIDs" INTEGER,
    "solarSystemID" INTEGER,
    "corporationID" INTEGER,
    "sizeFactor" DOUBLE PRECISION,
    "stationCount" INTEGER,
    "stationSystemCount" INTEGER,
    "militiaCorporationID" INTEGER,
    "iconID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."chrRaces" (
    "raceID" INTEGER NOT NULL,
    "raceName" VARCHAR(100),
    "description" VARCHAR(1000),
    "iconID" INTEGER,
    "shortDescription" VARCHAR(500)
);

-- CreateTable
CREATE TABLE "evesde"."crpActivities" (
    "activityID" INTEGER NOT NULL,
    "activityName" VARCHAR(100),
    "description" VARCHAR(1000)
);

-- CreateTable
CREATE TABLE "evesde"."crpNPCCorporationDivisions" (
    "corporationID" INTEGER NOT NULL,
    "divisionID" INTEGER NOT NULL,
    "size" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."crpNPCCorporationResearchFields" (
    "skillID" INTEGER NOT NULL,
    "corporationID" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "evesde"."crpNPCCorporationTrades" (
    "corporationID" INTEGER NOT NULL,
    "typeID" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "evesde"."crpNPCCorporations" (
    "corporationID" INTEGER NOT NULL,
    "size" CHAR(1),
    "extent" CHAR(1),
    "solarSystemID" INTEGER,
    "investorID1" INTEGER,
    "investorShares1" INTEGER,
    "investorID2" INTEGER,
    "investorShares2" INTEGER,
    "investorID3" INTEGER,
    "investorShares3" INTEGER,
    "investorID4" INTEGER,
    "investorShares4" INTEGER,
    "friendID" INTEGER,
    "enemyID" INTEGER,
    "publicShares" INTEGER,
    "initialPrice" INTEGER,
    "minSecurity" DOUBLE PRECISION,
    "scattered" BOOLEAN,
    "fringe" INTEGER,
    "corridor" INTEGER,
    "hub" INTEGER,
    "border" INTEGER,
    "factionID" INTEGER,
    "sizeFactor" DOUBLE PRECISION,
    "stationCount" INTEGER,
    "stationSystemCount" INTEGER,
    "description" VARCHAR(4000),
    "iconID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."crpNPCDivisions" (
    "divisionID" INTEGER NOT NULL,
    "divisionName" VARCHAR(100),
    "description" VARCHAR(1000),
    "leaderType" VARCHAR(100)
);

-- CreateTable
CREATE TABLE "evesde"."dgmAttributeCategories" (
    "categoryID" INTEGER NOT NULL,
    "categoryName" VARCHAR(50),
    "categoryDescription" VARCHAR(200)
);

-- CreateTable
CREATE TABLE "evesde"."dgmAttributeTypes" (
    "attributeID" INTEGER NOT NULL,
    "attributeName" VARCHAR(100),
    "description" VARCHAR(1000),
    "iconID" INTEGER,
    "defaultValue" DOUBLE PRECISION,
    "published" BOOLEAN,
    "displayName" VARCHAR(150),
    "unitID" INTEGER,
    "stackable" BOOLEAN,
    "highIsGood" BOOLEAN,
    "categoryID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."dgmEffects" (
    "effectID" INTEGER NOT NULL,
    "effectName" VARCHAR(400),
    "effectCategory" INTEGER,
    "preExpression" INTEGER,
    "postExpression" INTEGER,
    "description" VARCHAR(1000),
    "guid" VARCHAR(60),
    "iconID" INTEGER,
    "isOffensive" BOOLEAN,
    "isAssistance" BOOLEAN,
    "durationAttributeID" INTEGER,
    "trackingSpeedAttributeID" INTEGER,
    "dischargeAttributeID" INTEGER,
    "rangeAttributeID" INTEGER,
    "falloffAttributeID" INTEGER,
    "disallowAutoRepeat" BOOLEAN,
    "published" BOOLEAN,
    "displayName" VARCHAR(100),
    "isWarpSafe" BOOLEAN,
    "rangeChance" BOOLEAN,
    "electronicChance" BOOLEAN,
    "propulsionChance" BOOLEAN,
    "distribution" INTEGER,
    "sfxName" VARCHAR(20),
    "npcUsageChanceAttributeID" INTEGER,
    "npcActivationChanceAttributeID" INTEGER,
    "fittingUsageChanceAttributeID" INTEGER,
    "modifierInfo" TEXT
);

-- CreateTable
CREATE TABLE "evesde"."dgmExpressions" (
    "expressionID" INTEGER NOT NULL,
    "operandID" INTEGER,
    "arg1" INTEGER,
    "arg2" INTEGER,
    "expressionValue" VARCHAR(100),
    "description" VARCHAR(1000),
    "expressionName" VARCHAR(500),
    "expressionTypeID" INTEGER,
    "expressionGroupID" INTEGER,
    "expressionAttributeID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."dgmTypeAttributes" (
    "typeID" INTEGER NOT NULL,
    "attributeID" INTEGER NOT NULL,
    "valueInt" INTEGER,
    "valueFloat" DOUBLE PRECISION
);

-- CreateTable
CREATE TABLE "evesde"."dgmTypeEffects" (
    "typeID" INTEGER NOT NULL,
    "effectID" INTEGER NOT NULL,
    "isDefault" BOOLEAN
);

-- CreateTable
CREATE TABLE "evesde"."eveGraphics" (
    "graphicID" INTEGER NOT NULL,
    "sofFactionName" VARCHAR(100),
    "graphicFile" VARCHAR(256),
    "sofHullName" VARCHAR(100),
    "sofRaceName" VARCHAR(100),
    "description" TEXT
);

-- CreateTable
CREATE TABLE "evesde"."eveIcons" (
    "iconID" INTEGER NOT NULL,
    "iconFile" VARCHAR(500),
    "description" TEXT
);

-- CreateTable
CREATE TABLE "evesde"."eveUnits" (
    "unitID" INTEGER NOT NULL,
    "unitName" VARCHAR(100),
    "displayName" VARCHAR(50),
    "description" VARCHAR(1000)
);

-- CreateTable
CREATE TABLE "evesde"."industryActivity" (
    "typeID" INTEGER NOT NULL,
    "activityID" INTEGER NOT NULL,
    "time" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."industryActivityMaterials" (
    "typeID" INTEGER,
    "activityID" INTEGER,
    "materialTypeID" INTEGER,
    "quantity" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."industryActivityProbabilities" (
    "typeID" INTEGER,
    "activityID" INTEGER,
    "productTypeID" INTEGER,
    "probability" DECIMAL(3,2)
);

-- CreateTable
CREATE TABLE "evesde"."industryActivityProducts" (
    "typeID" INTEGER,
    "activityID" INTEGER,
    "productTypeID" INTEGER,
    "quantity" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."industryActivityRaces" (
    "typeID" INTEGER,
    "activityID" INTEGER,
    "productTypeID" INTEGER,
    "raceID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."industryActivitySkills" (
    "typeID" INTEGER,
    "activityID" INTEGER,
    "skillID" INTEGER,
    "level" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."industryBlueprints" (
    "typeID" INTEGER NOT NULL,
    "maxProductionLimit" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."invCategories" (
    "categoryID" INTEGER NOT NULL,
    "categoryName" VARCHAR(100),
    "iconID" INTEGER,
    "published" BOOLEAN
);

-- CreateTable
CREATE TABLE "evesde"."invContrabandTypes" (
    "factionID" INTEGER NOT NULL,
    "typeID" INTEGER NOT NULL,
    "standingLoss" DOUBLE PRECISION,
    "confiscateMinSec" DOUBLE PRECISION,
    "fineByValue" DOUBLE PRECISION,
    "attackMinSec" DOUBLE PRECISION
);

-- CreateTable
CREATE TABLE "evesde"."invControlTowerResourcePurposes" (
    "purpose" INTEGER NOT NULL,
    "purposeText" VARCHAR(100)
);

-- CreateTable
CREATE TABLE "evesde"."invControlTowerResources" (
    "controlTowerTypeID" INTEGER NOT NULL,
    "resourceTypeID" INTEGER NOT NULL,
    "purpose" INTEGER,
    "quantity" INTEGER,
    "minSecurityLevel" DOUBLE PRECISION,
    "factionID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."invFlags" (
    "flagID" INTEGER NOT NULL,
    "flagName" VARCHAR(200),
    "flagText" VARCHAR(100),
    "orderID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."invGroups" (
    "groupID" INTEGER NOT NULL,
    "categoryID" INTEGER,
    "groupName" VARCHAR(100),
    "iconID" INTEGER,
    "useBasePrice" BOOLEAN,
    "anchored" BOOLEAN,
    "anchorable" BOOLEAN,
    "fittableNonSingleton" BOOLEAN,
    "published" BOOLEAN
);

-- CreateTable
CREATE TABLE "evesde"."invItems" (
    "itemID" INTEGER NOT NULL,
    "typeID" INTEGER NOT NULL,
    "ownerID" INTEGER NOT NULL,
    "locationID" INTEGER NOT NULL,
    "flagID" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "evesde"."invMarketGroups" (
    "marketGroupID" INTEGER NOT NULL,
    "parentGroupID" INTEGER,
    "marketGroupName" VARCHAR(100),
    "description" VARCHAR(3000),
    "iconID" INTEGER,
    "hasTypes" BOOLEAN
);

-- CreateTable
CREATE TABLE "evesde"."invMetaGroups" (
    "metaGroupID" INTEGER NOT NULL,
    "metaGroupName" VARCHAR(100),
    "description" VARCHAR(1000),
    "iconID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."invMetaTypes" (
    "typeID" INTEGER NOT NULL,
    "parentTypeID" INTEGER,
    "metaGroupID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."invNames" (
    "itemID" INTEGER NOT NULL,
    "itemName" VARCHAR(200) NOT NULL
);

-- CreateTable
CREATE TABLE "evesde"."invPositions" (
    "itemID" INTEGER NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "z" DOUBLE PRECISION NOT NULL,
    "yaw" REAL,
    "pitch" REAL,
    "roll" REAL
);

-- CreateTable
CREATE TABLE "evesde"."invTraits" (
    "traitID" SERIAL NOT NULL,
    "typeID" INTEGER,
    "skillID" INTEGER,
    "bonus" DOUBLE PRECISION,
    "bonusText" TEXT,
    "unitID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."invTypeMaterials" (
    "typeID" INTEGER NOT NULL,
    "materialTypeID" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "evesde"."invTypeReactions" (
    "reactionTypeID" INTEGER NOT NULL,
    "input" BOOLEAN NOT NULL,
    "typeID" INTEGER NOT NULL,
    "quantity" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."invTypes" (
    "typeID" INTEGER NOT NULL,
    "groupID" INTEGER,
    "typeName" VARCHAR(100),
    "description" TEXT,
    "mass" DOUBLE PRECISION,
    "volume" DOUBLE PRECISION,
    "capacity" DOUBLE PRECISION,
    "portionSize" INTEGER,
    "raceID" INTEGER,
    "basePrice" DECIMAL(19,4),
    "published" BOOLEAN,
    "marketGroupID" INTEGER,
    "iconID" INTEGER,
    "soundID" INTEGER,
    "graphicID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."invUniqueNames" (
    "itemID" INTEGER NOT NULL,
    "itemName" VARCHAR(200) NOT NULL,
    "groupID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."invVolumes" (
    "typeID" INTEGER NOT NULL,
    "volume" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."mapCelestialGraphics" (
    "celestialID" INTEGER NOT NULL,
    "heightMap1" INTEGER,
    "heightMap2" INTEGER,
    "shaderPreset" INTEGER,
    "population" BOOLEAN
);

-- CreateTable
CREATE TABLE "evesde"."mapCelestialStatistics" (
    "celestialID" INTEGER NOT NULL,
    "temperature" DOUBLE PRECISION,
    "spectralClass" VARCHAR(10),
    "luminosity" DOUBLE PRECISION,
    "age" DOUBLE PRECISION,
    "life" DOUBLE PRECISION,
    "orbitRadius" DOUBLE PRECISION,
    "eccentricity" DOUBLE PRECISION,
    "massDust" DOUBLE PRECISION,
    "massGas" DOUBLE PRECISION,
    "fragmented" BOOLEAN,
    "density" DOUBLE PRECISION,
    "surfaceGravity" DOUBLE PRECISION,
    "escapeVelocity" DOUBLE PRECISION,
    "orbitPeriod" DOUBLE PRECISION,
    "rotationRate" DOUBLE PRECISION,
    "locked" BOOLEAN,
    "pressure" DOUBLE PRECISION,
    "radius" DOUBLE PRECISION,
    "mass" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."mapConstellationJumps" (
    "fromRegionID" INTEGER,
    "fromConstellationID" INTEGER NOT NULL,
    "toConstellationID" INTEGER NOT NULL,
    "toRegionID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."mapConstellations" (
    "regionID" INTEGER,
    "constellationID" INTEGER NOT NULL,
    "constellationName" VARCHAR(100),
    "x" DOUBLE PRECISION,
    "y" DOUBLE PRECISION,
    "z" DOUBLE PRECISION,
    "xMin" DOUBLE PRECISION,
    "xMax" DOUBLE PRECISION,
    "yMin" DOUBLE PRECISION,
    "yMax" DOUBLE PRECISION,
    "zMin" DOUBLE PRECISION,
    "zMax" DOUBLE PRECISION,
    "factionID" INTEGER,
    "radius" DOUBLE PRECISION
);

-- CreateTable
CREATE TABLE "evesde"."mapDenormalize" (
    "itemID" INTEGER NOT NULL,
    "typeID" INTEGER,
    "groupID" INTEGER,
    "solarSystemID" INTEGER,
    "constellationID" INTEGER,
    "regionID" INTEGER,
    "orbitID" INTEGER,
    "x" DOUBLE PRECISION,
    "y" DOUBLE PRECISION,
    "z" DOUBLE PRECISION,
    "radius" DOUBLE PRECISION,
    "itemName" VARCHAR(100),
    "security" DOUBLE PRECISION,
    "celestialIndex" INTEGER,
    "orbitIndex" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."mapJumps" (
    "stargateID" INTEGER NOT NULL,
    "destinationID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."mapLandmarks" (
    "landmarkID" INTEGER NOT NULL,
    "landmarkName" VARCHAR(100),
    "description" TEXT,
    "locationID" INTEGER,
    "x" DOUBLE PRECISION,
    "y" DOUBLE PRECISION,
    "z" DOUBLE PRECISION,
    "iconID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."mapLocationScenes" (
    "locationID" INTEGER NOT NULL,
    "graphicID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."mapLocationWormholeClasses" (
    "locationID" INTEGER NOT NULL,
    "wormholeClassID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."mapRegionJumps" (
    "fromRegionID" INTEGER NOT NULL,
    "toRegionID" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "evesde"."mapRegions" (
    "regionID" INTEGER NOT NULL,
    "regionName" VARCHAR(100),
    "x" DOUBLE PRECISION,
    "y" DOUBLE PRECISION,
    "z" DOUBLE PRECISION,
    "xMin" DOUBLE PRECISION,
    "xMax" DOUBLE PRECISION,
    "yMin" DOUBLE PRECISION,
    "yMax" DOUBLE PRECISION,
    "zMin" DOUBLE PRECISION,
    "zMax" DOUBLE PRECISION,
    "factionID" INTEGER,
    "nebula" INTEGER,
    "radius" DOUBLE PRECISION
);

-- CreateTable
CREATE TABLE "evesde"."mapSolarSystemJumps" (
    "fromRegionID" INTEGER,
    "fromConstellationID" INTEGER,
    "fromSolarSystemID" INTEGER NOT NULL,
    "toSolarSystemID" INTEGER NOT NULL,
    "toConstellationID" INTEGER,
    "toRegionID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."mapSolarSystems" (
    "regionID" INTEGER,
    "constellationID" INTEGER,
    "solarSystemID" INTEGER NOT NULL,
    "solarSystemName" VARCHAR(100),
    "x" DOUBLE PRECISION,
    "y" DOUBLE PRECISION,
    "z" DOUBLE PRECISION,
    "xMin" DOUBLE PRECISION,
    "xMax" DOUBLE PRECISION,
    "yMin" DOUBLE PRECISION,
    "yMax" DOUBLE PRECISION,
    "zMin" DOUBLE PRECISION,
    "zMax" DOUBLE PRECISION,
    "luminosity" DOUBLE PRECISION,
    "border" BOOLEAN,
    "fringe" BOOLEAN,
    "corridor" BOOLEAN,
    "hub" BOOLEAN,
    "international" BOOLEAN,
    "regional" BOOLEAN,
    "constellation" BOOLEAN,
    "security" DOUBLE PRECISION,
    "factionID" INTEGER,
    "radius" DOUBLE PRECISION,
    "sunTypeID" INTEGER,
    "securityClass" VARCHAR(2)
);

-- CreateTable
CREATE TABLE "evesde"."mapUniverse" (
    "universeID" INTEGER NOT NULL,
    "universeName" VARCHAR(100),
    "x" DOUBLE PRECISION,
    "y" DOUBLE PRECISION,
    "z" DOUBLE PRECISION,
    "xMin" DOUBLE PRECISION,
    "xMax" DOUBLE PRECISION,
    "yMin" DOUBLE PRECISION,
    "yMax" DOUBLE PRECISION,
    "zMin" DOUBLE PRECISION,
    "zMax" DOUBLE PRECISION,
    "radius" DOUBLE PRECISION
);

-- CreateTable
CREATE TABLE "evesde"."planetSchematics" (
    "schematicID" INTEGER NOT NULL,
    "schematicName" VARCHAR(255),
    "cycleTime" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."planetSchematicsPinMap" (
    "schematicID" INTEGER NOT NULL,
    "pinTypeID" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "evesde"."planetSchematicsTypeMap" (
    "schematicID" INTEGER NOT NULL,
    "typeID" INTEGER NOT NULL,
    "quantity" INTEGER,
    "isInput" BOOLEAN
);

-- CreateTable
CREATE TABLE "evesde"."ramActivities" (
    "activityID" INTEGER NOT NULL,
    "activityName" VARCHAR(100),
    "iconNo" VARCHAR(5),
    "description" VARCHAR(1000),
    "published" BOOLEAN
);

-- CreateTable
CREATE TABLE "evesde"."ramAssemblyLineStations" (
    "stationID" INTEGER NOT NULL,
    "assemblyLineTypeID" INTEGER NOT NULL,
    "quantity" INTEGER,
    "stationTypeID" INTEGER,
    "ownerID" INTEGER,
    "solarSystemID" INTEGER,
    "regionID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."ramAssemblyLineTypeDetailPerCategory" (
    "assemblyLineTypeID" INTEGER NOT NULL,
    "categoryID" INTEGER NOT NULL,
    "timeMultiplier" DOUBLE PRECISION,
    "materialMultiplier" DOUBLE PRECISION,
    "costMultiplier" DOUBLE PRECISION
);

-- CreateTable
CREATE TABLE "evesde"."ramAssemblyLineTypeDetailPerGroup" (
    "assemblyLineTypeID" INTEGER NOT NULL,
    "groupID" INTEGER NOT NULL,
    "timeMultiplier" DOUBLE PRECISION,
    "materialMultiplier" DOUBLE PRECISION,
    "costMultiplier" DOUBLE PRECISION
);

-- CreateTable
CREATE TABLE "evesde"."ramAssemblyLineTypes" (
    "assemblyLineTypeID" INTEGER NOT NULL,
    "assemblyLineTypeName" VARCHAR(100),
    "description" VARCHAR(1000),
    "baseTimeMultiplier" DOUBLE PRECISION,
    "baseMaterialMultiplier" DOUBLE PRECISION,
    "baseCostMultiplier" DOUBLE PRECISION,
    "volume" DOUBLE PRECISION,
    "activityID" INTEGER,
    "minCostPerHour" DOUBLE PRECISION
);

-- CreateTable
CREATE TABLE "evesde"."ramInstallationTypeContents" (
    "installationTypeID" INTEGER NOT NULL,
    "assemblyLineTypeID" INTEGER NOT NULL,
    "quantity" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."skinLicense" (
    "licenseTypeID" INTEGER NOT NULL,
    "duration" INTEGER,
    "skinID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."skinMaterials" (
    "skinMaterialID" INTEGER NOT NULL,
    "displayNameID" INTEGER,
    "materialSetID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."skinShip" (
    "skinID" INTEGER,
    "typeID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."skins" (
    "skinID" INTEGER NOT NULL,
    "internalName" VARCHAR(70),
    "skinMaterialID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."staOperationServices" (
    "operationID" INTEGER NOT NULL,
    "serviceID" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "evesde"."staOperations" (
    "activityID" INTEGER,
    "operationID" INTEGER NOT NULL,
    "operationName" VARCHAR(100),
    "description" VARCHAR(1000),
    "fringe" INTEGER,
    "corridor" INTEGER,
    "hub" INTEGER,
    "border" INTEGER,
    "ratio" INTEGER,
    "caldariStationTypeID" INTEGER,
    "minmatarStationTypeID" INTEGER,
    "amarrStationTypeID" INTEGER,
    "gallenteStationTypeID" INTEGER,
    "joveStationTypeID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."staServices" (
    "serviceID" INTEGER NOT NULL,
    "serviceName" VARCHAR(100),
    "description" VARCHAR(1000)
);

-- CreateTable
CREATE TABLE "evesde"."staStationTypes" (
    "stationTypeID" INTEGER NOT NULL,
    "dockEntryX" DOUBLE PRECISION,
    "dockEntryY" DOUBLE PRECISION,
    "dockEntryZ" DOUBLE PRECISION,
    "dockOrientationX" DOUBLE PRECISION,
    "dockOrientationY" DOUBLE PRECISION,
    "dockOrientationZ" DOUBLE PRECISION,
    "operationID" INTEGER,
    "officeSlots" INTEGER,
    "reprocessingEfficiency" DOUBLE PRECISION,
    "conquerable" BOOLEAN
);

-- CreateTable
CREATE TABLE "evesde"."staStations" (
    "stationID" BIGINT NOT NULL,
    "security" DOUBLE PRECISION,
    "dockingCostPerVolume" DOUBLE PRECISION,
    "maxShipVolumeDockable" DOUBLE PRECISION,
    "officeRentalCost" INTEGER,
    "operationID" INTEGER,
    "stationTypeID" INTEGER,
    "corporationID" INTEGER,
    "solarSystemID" INTEGER,
    "constellationID" INTEGER,
    "regionID" INTEGER,
    "stationName" VARCHAR(100),
    "x" DOUBLE PRECISION,
    "y" DOUBLE PRECISION,
    "z" DOUBLE PRECISION,
    "reprocessingEfficiency" DOUBLE PRECISION,
    "reprocessingStationsTake" DOUBLE PRECISION,
    "reprocessingHangarFlag" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."translationTables" (
    "sourceTable" VARCHAR(200) NOT NULL,
    "destinationTable" VARCHAR(200),
    "translatedKey" VARCHAR(200) NOT NULL,
    "tcGroupID" INTEGER,
    "tcID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."trnTranslationColumns" (
    "tcGroupID" INTEGER,
    "tcID" INTEGER NOT NULL,
    "tableName" VARCHAR(256) NOT NULL,
    "columnName" VARCHAR(128) NOT NULL,
    "masterID" VARCHAR(128)
);

-- CreateTable
CREATE TABLE "evesde"."trnTranslationLanguages" (
    "numericLanguageID" INTEGER NOT NULL,
    "languageID" VARCHAR(50),
    "languageName" VARCHAR(200)
);

-- CreateTable
CREATE TABLE "evesde"."trnTranslations" (
    "tcID" INTEGER NOT NULL,
    "keyID" INTEGER NOT NULL,
    "languageID" VARCHAR(50) NOT NULL,
    "text" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "evesde"."warCombatZoneSystems" (
    "solarSystemID" INTEGER NOT NULL,
    "combatZoneID" INTEGER
);

-- CreateTable
CREATE TABLE "evesde"."warCombatZones" (
    "combatZoneID" INTEGER NOT NULL,
    "combatZoneName" VARCHAR(100),
    "factionID" INTEGER,
    "centerSystemID" INTEGER,
    "description" VARCHAR(500)
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "warehouse"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "warehouse"."User"("email");

-- AddForeignKey
ALTER TABLE "warehouse"."Character" ADD CONSTRAINT "Character_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "warehouse"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
