-- CreateTable
CREATE TABLE "agtAgentTypes" (
    "agentTypeID" INTEGER NOT NULL,
    "agentType" VARCHAR(50),

    CONSTRAINT "agtAgentTypes_pkey" PRIMARY KEY ("agentTypeID")
);

-- CreateTable
CREATE TABLE "agtAgents" (
    "agentID" INTEGER NOT NULL,
    "divisionID" INTEGER,
    "corporationID" INTEGER,
    "locationID" INTEGER,
    "level" INTEGER,
    "quality" INTEGER,
    "agentTypeID" INTEGER,
    "isLocator" BOOLEAN,

    CONSTRAINT "agtAgents_pkey" PRIMARY KEY ("agentID")
);

-- CreateTable
CREATE TABLE "agtAgentsInSpace" (
    "agentID" INTEGER NOT NULL,
    "dungeonID" INTEGER,
    "solarSystemID" INTEGER,
    "spawnPointID" INTEGER,
    "typeID" INTEGER,

    CONSTRAINT "agtAgentsInSpace_pkey" PRIMARY KEY ("agentID")
);

-- CreateTable
CREATE TABLE "agtResearchAgents" (
    "agentID" INTEGER NOT NULL,
    "typeID" INTEGER NOT NULL,

    CONSTRAINT "agtResearchAgents_pkey" PRIMARY KEY ("agentID","typeID")
);

-- CreateTable
CREATE TABLE "certCerts" (
    "certID" INTEGER NOT NULL,
    "description" TEXT,
    "groupID" INTEGER,
    "name" VARCHAR(255),

    CONSTRAINT "certCerts_pkey" PRIMARY KEY ("certID")
);

-- CreateTable
CREATE TABLE "certMasteries" (
    "typeID" INTEGER,
    "masteryLevel" INTEGER,
    "certID" INTEGER
);

-- CreateTable
CREATE TABLE "certSkills" (
    "certID" INTEGER,
    "skillID" INTEGER,
    "certLevelInt" INTEGER,
    "skillLevel" INTEGER,
    "certLevelText" VARCHAR(8)
);

-- CreateTable
CREATE TABLE "chrAncestries" (
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
    "shortDescription" VARCHAR(500),

    CONSTRAINT "chrAncestries_pkey" PRIMARY KEY ("ancestryID")
);

-- CreateTable
CREATE TABLE "chrAttributes" (
    "attributeID" INTEGER NOT NULL,
    "attributeName" VARCHAR(100),
    "description" VARCHAR(1000),
    "iconID" INTEGER,
    "shortDescription" VARCHAR(500),
    "notes" VARCHAR(500),

    CONSTRAINT "chrAttributes_pkey" PRIMARY KEY ("attributeID")
);

-- CreateTable
CREATE TABLE "chrBloodlines" (
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
    "shortFemaleDescription" VARCHAR(500),

    CONSTRAINT "chrBloodlines_pkey" PRIMARY KEY ("bloodlineID")
);

-- CreateTable
CREATE TABLE "chrFactions" (
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
    "iconID" INTEGER,

    CONSTRAINT "chrFactions_pkey" PRIMARY KEY ("factionID")
);

-- CreateTable
CREATE TABLE "chrRaces" (
    "raceID" INTEGER NOT NULL,
    "raceName" VARCHAR(100),
    "description" VARCHAR(1000),
    "iconID" INTEGER,
    "shortDescription" VARCHAR(500),

    CONSTRAINT "chrRaces_pkey" PRIMARY KEY ("raceID")
);

-- CreateTable
CREATE TABLE "crpActivities" (
    "activityID" INTEGER NOT NULL,
    "activityName" VARCHAR(100),
    "description" VARCHAR(1000),

    CONSTRAINT "crpActivities_pkey" PRIMARY KEY ("activityID")
);

-- CreateTable
CREATE TABLE "crpNPCCorporationDivisions" (
    "corporationID" INTEGER NOT NULL,
    "divisionID" INTEGER NOT NULL,
    "size" INTEGER,

    CONSTRAINT "crpNPCCorporationDivisions_pkey" PRIMARY KEY ("corporationID","divisionID")
);

-- CreateTable
CREATE TABLE "crpNPCCorporationResearchFields" (
    "skillID" INTEGER NOT NULL,
    "corporationID" INTEGER NOT NULL,

    CONSTRAINT "crpNPCCorporationResearchFields_pkey" PRIMARY KEY ("skillID","corporationID")
);

-- CreateTable
CREATE TABLE "crpNPCCorporationTrades" (
    "corporationID" INTEGER NOT NULL,
    "typeID" INTEGER NOT NULL,

    CONSTRAINT "crpNPCCorporationTrades_pkey" PRIMARY KEY ("corporationID","typeID")
);

-- CreateTable
CREATE TABLE "crpNPCCorporations" (
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
    "iconID" INTEGER,

    CONSTRAINT "crpNPCCorporations_pkey" PRIMARY KEY ("corporationID")
);

-- CreateTable
CREATE TABLE "crpNPCDivisions" (
    "divisionID" INTEGER NOT NULL,
    "divisionName" VARCHAR(100),
    "description" VARCHAR(1000),
    "leaderType" VARCHAR(100),

    CONSTRAINT "crpNPCDivisions_pkey" PRIMARY KEY ("divisionID")
);

-- CreateTable
CREATE TABLE "dgmAttributeCategories" (
    "categoryID" INTEGER NOT NULL,
    "categoryName" VARCHAR(50),
    "categoryDescription" VARCHAR(200),

    CONSTRAINT "dgmAttributeCategories_pkey" PRIMARY KEY ("categoryID")
);

-- CreateTable
CREATE TABLE "dgmAttributeTypes" (
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
    "categoryID" INTEGER,

    CONSTRAINT "dgmAttributeTypes_pkey" PRIMARY KEY ("attributeID")
);

-- CreateTable
CREATE TABLE "dgmEffects" (
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
    "modifierInfo" TEXT,

    CONSTRAINT "dgmEffects_pkey" PRIMARY KEY ("effectID")
);

-- CreateTable
CREATE TABLE "dgmExpressions" (
    "expressionID" INTEGER NOT NULL,
    "operandID" INTEGER,
    "arg1" INTEGER,
    "arg2" INTEGER,
    "expressionValue" VARCHAR(100),
    "description" VARCHAR(1000),
    "expressionName" VARCHAR(500),
    "expressionTypeID" INTEGER,
    "expressionGroupID" INTEGER,
    "expressionAttributeID" INTEGER,

    CONSTRAINT "dgmExpressions_pkey" PRIMARY KEY ("expressionID")
);

-- CreateTable
CREATE TABLE "dgmTypeAttributes" (
    "typeID" INTEGER NOT NULL,
    "attributeID" INTEGER NOT NULL,
    "valueInt" INTEGER,
    "valueFloat" DOUBLE PRECISION,

    CONSTRAINT "dgmTypeAttributes_pkey" PRIMARY KEY ("typeID","attributeID")
);

-- CreateTable
CREATE TABLE "dgmTypeEffects" (
    "typeID" INTEGER NOT NULL,
    "effectID" INTEGER NOT NULL,
    "isDefault" BOOLEAN,

    CONSTRAINT "dgmTypeEffects_pkey" PRIMARY KEY ("typeID","effectID")
);

-- CreateTable
CREATE TABLE "eveGraphics" (
    "graphicID" INTEGER NOT NULL,
    "sofFactionName" VARCHAR(100),
    "graphicFile" VARCHAR(256),
    "sofHullName" VARCHAR(100),
    "sofRaceName" VARCHAR(100),
    "description" TEXT,

    CONSTRAINT "eveGraphics_pkey" PRIMARY KEY ("graphicID")
);

-- CreateTable
CREATE TABLE "eveIcons" (
    "iconID" INTEGER NOT NULL,
    "iconFile" VARCHAR(500),
    "description" TEXT,

    CONSTRAINT "eveIcons_pkey" PRIMARY KEY ("iconID")
);

-- CreateTable
CREATE TABLE "eveUnits" (
    "unitID" INTEGER NOT NULL,
    "unitName" VARCHAR(100),
    "displayName" VARCHAR(50),
    "description" VARCHAR(1000),

    CONSTRAINT "eveUnits_pkey" PRIMARY KEY ("unitID")
);

-- CreateTable
CREATE TABLE "industryActivity" (
    "typeID" INTEGER NOT NULL,
    "activityID" INTEGER NOT NULL,
    "time" INTEGER,

    CONSTRAINT "industryActivity_pkey" PRIMARY KEY ("typeID","activityID")
);

-- CreateTable
CREATE TABLE "industryActivityMaterials" (
    "typeID" INTEGER,
    "activityID" INTEGER,
    "materialTypeID" INTEGER,
    "quantity" INTEGER
);

-- CreateTable
CREATE TABLE "industryActivityProbabilities" (
    "typeID" INTEGER,
    "activityID" INTEGER,
    "productTypeID" INTEGER,
    "probability" DECIMAL(3,2)
);

-- CreateTable
CREATE TABLE "industryActivityProducts" (
    "typeID" INTEGER,
    "activityID" INTEGER,
    "productTypeID" INTEGER,
    "quantity" INTEGER
);

-- CreateTable
CREATE TABLE "industryActivityRaces" (
    "typeID" INTEGER,
    "activityID" INTEGER,
    "productTypeID" INTEGER,
    "raceID" INTEGER
);

-- CreateTable
CREATE TABLE "industryActivitySkills" (
    "typeID" INTEGER,
    "activityID" INTEGER,
    "skillID" INTEGER,
    "level" INTEGER
);

-- CreateTable
CREATE TABLE "industryBlueprints" (
    "typeID" INTEGER NOT NULL,
    "maxProductionLimit" INTEGER,

    CONSTRAINT "industryBlueprints_pkey" PRIMARY KEY ("typeID")
);

-- CreateTable
CREATE TABLE "invCategories" (
    "categoryID" INTEGER NOT NULL,
    "categoryName" VARCHAR(100),
    "iconID" INTEGER,
    "published" BOOLEAN,

    CONSTRAINT "invCategories_pkey" PRIMARY KEY ("categoryID")
);

-- CreateTable
CREATE TABLE "invContrabandTypes" (
    "factionID" INTEGER NOT NULL,
    "typeID" INTEGER NOT NULL,
    "standingLoss" DOUBLE PRECISION,
    "confiscateMinSec" DOUBLE PRECISION,
    "fineByValue" DOUBLE PRECISION,
    "attackMinSec" DOUBLE PRECISION,

    CONSTRAINT "invContrabandTypes_pkey" PRIMARY KEY ("factionID","typeID")
);

-- CreateTable
CREATE TABLE "invControlTowerResourcePurposes" (
    "purpose" INTEGER NOT NULL,
    "purposeText" VARCHAR(100),

    CONSTRAINT "invControlTowerResourcePurposes_pkey" PRIMARY KEY ("purpose")
);

-- CreateTable
CREATE TABLE "invControlTowerResources" (
    "controlTowerTypeID" INTEGER NOT NULL,
    "resourceTypeID" INTEGER NOT NULL,
    "purpose" INTEGER,
    "quantity" INTEGER,
    "minSecurityLevel" DOUBLE PRECISION,
    "factionID" INTEGER,

    CONSTRAINT "invControlTowerResources_pkey" PRIMARY KEY ("controlTowerTypeID","resourceTypeID")
);

-- CreateTable
CREATE TABLE "invFlags" (
    "flagID" INTEGER NOT NULL,
    "flagName" VARCHAR(200),
    "flagText" VARCHAR(100),
    "orderID" INTEGER,

    CONSTRAINT "invFlags_pkey" PRIMARY KEY ("flagID")
);

-- CreateTable
CREATE TABLE "invGroups" (
    "groupID" INTEGER NOT NULL,
    "categoryID" INTEGER,
    "groupName" VARCHAR(100),
    "iconID" INTEGER,
    "useBasePrice" BOOLEAN,
    "anchored" BOOLEAN,
    "anchorable" BOOLEAN,
    "fittableNonSingleton" BOOLEAN,
    "published" BOOLEAN,

    CONSTRAINT "invGroups_pkey" PRIMARY KEY ("groupID")
);

-- CreateTable
CREATE TABLE "invItems" (
    "itemID" INTEGER NOT NULL,
    "typeID" INTEGER NOT NULL,
    "ownerID" INTEGER NOT NULL,
    "locationID" INTEGER NOT NULL,
    "flagID" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "invItems_pkey" PRIMARY KEY ("itemID")
);

-- CreateTable
CREATE TABLE "invMarketGroups" (
    "marketGroupID" INTEGER NOT NULL,
    "parentGroupID" INTEGER,
    "marketGroupName" VARCHAR(100),
    "description" VARCHAR(3000),
    "iconID" INTEGER,
    "hasTypes" BOOLEAN,

    CONSTRAINT "invMarketGroups_pkey" PRIMARY KEY ("marketGroupID")
);

-- CreateTable
CREATE TABLE "invMetaGroups" (
    "metaGroupID" INTEGER NOT NULL,
    "metaGroupName" VARCHAR(100),
    "description" VARCHAR(1000),
    "iconID" INTEGER,

    CONSTRAINT "invMetaGroups_pkey" PRIMARY KEY ("metaGroupID")
);

-- CreateTable
CREATE TABLE "invMetaTypes" (
    "typeID" INTEGER NOT NULL,
    "parentTypeID" INTEGER,
    "metaGroupID" INTEGER,

    CONSTRAINT "invMetaTypes_pkey" PRIMARY KEY ("typeID")
);

-- CreateTable
CREATE TABLE "invNames" (
    "itemID" INTEGER NOT NULL,
    "itemName" VARCHAR(200) NOT NULL,

    CONSTRAINT "invNames_pkey" PRIMARY KEY ("itemID")
);

-- CreateTable
CREATE TABLE "invPositions" (
    "itemID" INTEGER NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "z" DOUBLE PRECISION NOT NULL,
    "yaw" REAL,
    "pitch" REAL,
    "roll" REAL,

    CONSTRAINT "invPositions_pkey" PRIMARY KEY ("itemID")
);

-- CreateTable
CREATE TABLE "invTraits" (
    "traitID" SERIAL NOT NULL,
    "typeID" INTEGER,
    "skillID" INTEGER,
    "bonus" DOUBLE PRECISION,
    "bonusText" TEXT,
    "unitID" INTEGER,

    CONSTRAINT "invTraits_pkey" PRIMARY KEY ("traitID")
);

-- CreateTable
CREATE TABLE "invTypeMaterials" (
    "typeID" INTEGER NOT NULL,
    "materialTypeID" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "invTypeMaterials_pkey" PRIMARY KEY ("typeID","materialTypeID")
);

-- CreateTable
CREATE TABLE "invTypeReactions" (
    "reactionTypeID" INTEGER NOT NULL,
    "input" BOOLEAN NOT NULL,
    "typeID" INTEGER NOT NULL,
    "quantity" INTEGER,

    CONSTRAINT "invTypeReactions_pkey" PRIMARY KEY ("reactionTypeID","input","typeID")
);

-- CreateTable
CREATE TABLE "invTypes" (
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
    "graphicID" INTEGER,

    CONSTRAINT "invTypes_pkey" PRIMARY KEY ("typeID")
);

-- CreateTable
CREATE TABLE "invUniqueNames" (
    "itemID" INTEGER NOT NULL,
    "itemName" VARCHAR(200) NOT NULL,
    "groupID" INTEGER,

    CONSTRAINT "invUniqueNames_pkey" PRIMARY KEY ("itemID")
);

-- CreateTable
CREATE TABLE "invVolumes" (
    "typeID" INTEGER NOT NULL,
    "volume" INTEGER,

    CONSTRAINT "invVolumes_pkey" PRIMARY KEY ("typeID")
);

-- CreateTable
CREATE TABLE "mapCelestialGraphics" (
    "celestialID" INTEGER NOT NULL,
    "heightMap1" INTEGER,
    "heightMap2" INTEGER,
    "shaderPreset" INTEGER,
    "population" BOOLEAN,

    CONSTRAINT "mapCelestialGraphics_pkey" PRIMARY KEY ("celestialID")
);

-- CreateTable
CREATE TABLE "mapCelestialStatistics" (
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
    "mass" INTEGER,

    CONSTRAINT "mapCelestialStatistics_pkey" PRIMARY KEY ("celestialID")
);

-- CreateTable
CREATE TABLE "mapConstellationJumps" (
    "fromRegionID" INTEGER,
    "fromConstellationID" INTEGER NOT NULL,
    "toConstellationID" INTEGER NOT NULL,
    "toRegionID" INTEGER,

    CONSTRAINT "mapConstellationJumps_pkey" PRIMARY KEY ("fromConstellationID","toConstellationID")
);

-- CreateTable
CREATE TABLE "mapConstellations" (
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
    "radius" DOUBLE PRECISION,

    CONSTRAINT "mapConstellations_pkey" PRIMARY KEY ("constellationID")
);

-- CreateTable
CREATE TABLE "mapDenormalize" (
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
    "orbitIndex" INTEGER,

    CONSTRAINT "mapDenormalize_pkey" PRIMARY KEY ("itemID")
);

-- CreateTable
CREATE TABLE "mapJumps" (
    "stargateID" INTEGER NOT NULL,
    "destinationID" INTEGER,

    CONSTRAINT "mapJumps_pkey" PRIMARY KEY ("stargateID")
);

-- CreateTable
CREATE TABLE "mapLandmarks" (
    "landmarkID" INTEGER NOT NULL,
    "landmarkName" VARCHAR(100),
    "description" TEXT,
    "locationID" INTEGER,
    "x" DOUBLE PRECISION,
    "y" DOUBLE PRECISION,
    "z" DOUBLE PRECISION,
    "iconID" INTEGER,

    CONSTRAINT "mapLandmarks_pkey" PRIMARY KEY ("landmarkID")
);

-- CreateTable
CREATE TABLE "mapLocationScenes" (
    "locationID" INTEGER NOT NULL,
    "graphicID" INTEGER,

    CONSTRAINT "mapLocationScenes_pkey" PRIMARY KEY ("locationID")
);

-- CreateTable
CREATE TABLE "mapLocationWormholeClasses" (
    "locationID" INTEGER NOT NULL,
    "wormholeClassID" INTEGER,

    CONSTRAINT "mapLocationWormholeClasses_pkey" PRIMARY KEY ("locationID")
);

-- CreateTable
CREATE TABLE "mapRegionJumps" (
    "fromRegionID" INTEGER NOT NULL,
    "toRegionID" INTEGER NOT NULL,

    CONSTRAINT "mapRegionJumps_pkey" PRIMARY KEY ("fromRegionID","toRegionID")
);

-- CreateTable
CREATE TABLE "mapRegions" (
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
    "radius" DOUBLE PRECISION,

    CONSTRAINT "mapRegions_pkey" PRIMARY KEY ("regionID")
);

-- CreateTable
CREATE TABLE "mapSolarSystemJumps" (
    "fromRegionID" INTEGER,
    "fromConstellationID" INTEGER,
    "fromSolarSystemID" INTEGER NOT NULL,
    "toSolarSystemID" INTEGER NOT NULL,
    "toConstellationID" INTEGER,
    "toRegionID" INTEGER,

    CONSTRAINT "mapSolarSystemJumps_pkey" PRIMARY KEY ("fromSolarSystemID","toSolarSystemID")
);

-- CreateTable
CREATE TABLE "mapSolarSystems" (
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
    "securityClass" VARCHAR(2),

    CONSTRAINT "mapSolarSystems_pkey" PRIMARY KEY ("solarSystemID")
);

-- CreateTable
CREATE TABLE "mapUniverse" (
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
    "radius" DOUBLE PRECISION,

    CONSTRAINT "mapUniverse_pkey" PRIMARY KEY ("universeID")
);

-- CreateTable
CREATE TABLE "planetSchematics" (
    "schematicID" INTEGER NOT NULL,
    "schematicName" VARCHAR(255),
    "cycleTime" INTEGER,

    CONSTRAINT "planetSchematics_pkey" PRIMARY KEY ("schematicID")
);

-- CreateTable
CREATE TABLE "planetSchematicsPinMap" (
    "schematicID" INTEGER NOT NULL,
    "pinTypeID" INTEGER NOT NULL,

    CONSTRAINT "planetSchematicsPinMap_pkey" PRIMARY KEY ("schematicID","pinTypeID")
);

-- CreateTable
CREATE TABLE "planetSchematicsTypeMap" (
    "schematicID" INTEGER NOT NULL,
    "typeID" INTEGER NOT NULL,
    "quantity" INTEGER,
    "isInput" BOOLEAN,

    CONSTRAINT "planetSchematicsTypeMap_pkey" PRIMARY KEY ("schematicID","typeID")
);

-- CreateTable
CREATE TABLE "ramActivities" (
    "activityID" INTEGER NOT NULL,
    "activityName" VARCHAR(100),
    "iconNo" VARCHAR(5),
    "description" VARCHAR(1000),
    "published" BOOLEAN,

    CONSTRAINT "ramActivities_pkey" PRIMARY KEY ("activityID")
);

-- CreateTable
CREATE TABLE "ramAssemblyLineStations" (
    "stationID" INTEGER NOT NULL,
    "assemblyLineTypeID" INTEGER NOT NULL,
    "quantity" INTEGER,
    "stationTypeID" INTEGER,
    "ownerID" INTEGER,
    "solarSystemID" INTEGER,
    "regionID" INTEGER,

    CONSTRAINT "ramAssemblyLineStations_pkey" PRIMARY KEY ("stationID","assemblyLineTypeID")
);

-- CreateTable
CREATE TABLE "ramAssemblyLineTypeDetailPerCategory" (
    "assemblyLineTypeID" INTEGER NOT NULL,
    "categoryID" INTEGER NOT NULL,
    "timeMultiplier" DOUBLE PRECISION,
    "materialMultiplier" DOUBLE PRECISION,
    "costMultiplier" DOUBLE PRECISION,

    CONSTRAINT "ramAssemblyLineTypeDetailPerCategory_pkey" PRIMARY KEY ("assemblyLineTypeID","categoryID")
);

-- CreateTable
CREATE TABLE "ramAssemblyLineTypeDetailPerGroup" (
    "assemblyLineTypeID" INTEGER NOT NULL,
    "groupID" INTEGER NOT NULL,
    "timeMultiplier" DOUBLE PRECISION,
    "materialMultiplier" DOUBLE PRECISION,
    "costMultiplier" DOUBLE PRECISION,

    CONSTRAINT "ramAssemblyLineTypeDetailPerGroup_pkey" PRIMARY KEY ("assemblyLineTypeID","groupID")
);

-- CreateTable
CREATE TABLE "ramAssemblyLineTypes" (
    "assemblyLineTypeID" INTEGER NOT NULL,
    "assemblyLineTypeName" VARCHAR(100),
    "description" VARCHAR(1000),
    "baseTimeMultiplier" DOUBLE PRECISION,
    "baseMaterialMultiplier" DOUBLE PRECISION,
    "baseCostMultiplier" DOUBLE PRECISION,
    "volume" DOUBLE PRECISION,
    "activityID" INTEGER,
    "minCostPerHour" DOUBLE PRECISION,

    CONSTRAINT "ramAssemblyLineTypes_pkey" PRIMARY KEY ("assemblyLineTypeID")
);

-- CreateTable
CREATE TABLE "ramInstallationTypeContents" (
    "installationTypeID" INTEGER NOT NULL,
    "assemblyLineTypeID" INTEGER NOT NULL,
    "quantity" INTEGER,

    CONSTRAINT "ramInstallationTypeContents_pkey" PRIMARY KEY ("installationTypeID","assemblyLineTypeID")
);

-- CreateTable
CREATE TABLE "skinLicense" (
    "licenseTypeID" INTEGER NOT NULL,
    "duration" INTEGER,
    "skinID" INTEGER,

    CONSTRAINT "skinLicense_pkey" PRIMARY KEY ("licenseTypeID")
);

-- CreateTable
CREATE TABLE "skinMaterials" (
    "skinMaterialID" INTEGER NOT NULL,
    "displayNameID" INTEGER,
    "materialSetID" INTEGER,

    CONSTRAINT "skinMaterials_pkey" PRIMARY KEY ("skinMaterialID")
);

-- CreateTable
CREATE TABLE "skinShip" (
    "skinID" INTEGER,
    "typeID" INTEGER
);

-- CreateTable
CREATE TABLE "skins" (
    "skinID" INTEGER NOT NULL,
    "internalName" VARCHAR(70),
    "skinMaterialID" INTEGER,

    CONSTRAINT "skins_pkey" PRIMARY KEY ("skinID")
);

-- CreateTable
CREATE TABLE "staOperationServices" (
    "operationID" INTEGER NOT NULL,
    "serviceID" INTEGER NOT NULL,

    CONSTRAINT "staOperationServices_pkey" PRIMARY KEY ("operationID","serviceID")
);

-- CreateTable
CREATE TABLE "staOperations" (
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
    "joveStationTypeID" INTEGER,

    CONSTRAINT "staOperations_pkey" PRIMARY KEY ("operationID")
);

-- CreateTable
CREATE TABLE "staServices" (
    "serviceID" INTEGER NOT NULL,
    "serviceName" VARCHAR(100),
    "description" VARCHAR(1000),

    CONSTRAINT "staServices_pkey" PRIMARY KEY ("serviceID")
);

-- CreateTable
CREATE TABLE "staStationTypes" (
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
    "conquerable" BOOLEAN,

    CONSTRAINT "staStationTypes_pkey" PRIMARY KEY ("stationTypeID")
);

-- CreateTable
CREATE TABLE "staStations" (
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
    "reprocessingHangarFlag" INTEGER,

    CONSTRAINT "staStations_pkey" PRIMARY KEY ("stationID")
);

-- CreateTable
CREATE TABLE "translationTables" (
    "sourceTable" VARCHAR(200) NOT NULL,
    "destinationTable" VARCHAR(200),
    "translatedKey" VARCHAR(200) NOT NULL,
    "tcGroupID" INTEGER,
    "tcID" INTEGER,

    CONSTRAINT "translationTables_pkey" PRIMARY KEY ("sourceTable","translatedKey")
);

-- CreateTable
CREATE TABLE "trnTranslationColumns" (
    "tcGroupID" INTEGER,
    "tcID" INTEGER NOT NULL,
    "tableName" VARCHAR(256) NOT NULL,
    "columnName" VARCHAR(128) NOT NULL,
    "masterID" VARCHAR(128),

    CONSTRAINT "trnTranslationColumns_pkey" PRIMARY KEY ("tcID")
);

-- CreateTable
CREATE TABLE "trnTranslationLanguages" (
    "numericLanguageID" INTEGER NOT NULL,
    "languageID" VARCHAR(50),
    "languageName" VARCHAR(200),

    CONSTRAINT "trnTranslationLanguages_pkey" PRIMARY KEY ("numericLanguageID")
);

-- CreateTable
CREATE TABLE "trnTranslations" (
    "tcID" INTEGER NOT NULL,
    "keyID" INTEGER NOT NULL,
    "languageID" VARCHAR(50) NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "trnTranslations_pkey" PRIMARY KEY ("tcID","keyID","languageID")
);

-- CreateTable
CREATE TABLE "warCombatZoneSystems" (
    "solarSystemID" INTEGER NOT NULL,
    "combatZoneID" INTEGER,

    CONSTRAINT "warCombatZoneSystems_pkey" PRIMARY KEY ("solarSystemID")
);

-- CreateTable
CREATE TABLE "warCombatZones" (
    "combatZoneID" INTEGER NOT NULL,
    "combatZoneName" VARCHAR(100),
    "factionID" INTEGER,
    "centerSystemID" INTEGER,
    "description" VARCHAR(500),

    CONSTRAINT "warCombatZones_pkey" PRIMARY KEY ("combatZoneID")
);

-- CreateIndex
CREATE INDEX "ix_evesde_agtAgents_corporationID" ON "agtAgents"("corporationID");

-- CreateIndex
CREATE INDEX "ix_evesde_agtAgents_locationID" ON "agtAgents"("locationID");

-- CreateIndex
CREATE INDEX "ix_evesde_agtAgentsInSpace_solarSystemID" ON "agtAgentsInSpace"("solarSystemID");

-- CreateIndex
CREATE INDEX "ix_evesde_agtResearchAgents_typeID" ON "agtResearchAgents"("typeID");

-- CreateIndex
CREATE INDEX "ix_evesde_certSkills_skillID" ON "certSkills"("skillID");

-- CreateIndex
CREATE INDEX "ix_evesde_dgmTypeAttributes_attributeID" ON "dgmTypeAttributes"("attributeID");

-- CreateIndex
CREATE INDEX "ix_evesde_industryActivity_activityID" ON "industryActivity"("activityID");

-- CreateIndex
CREATE INDEX "industryActivityMaterials_idx1" ON "industryActivityMaterials"("typeID", "activityID");

-- CreateIndex
CREATE INDEX "ix_evesde_industryActivityMaterials_typeID" ON "industryActivityMaterials"("typeID");

-- CreateIndex
CREATE INDEX "ix_evesde_industryActivityProbabilities_productTypeID" ON "industryActivityProbabilities"("productTypeID");

-- CreateIndex
CREATE INDEX "ix_evesde_industryActivityProbabilities_typeID" ON "industryActivityProbabilities"("typeID");

-- CreateIndex
CREATE INDEX "ix_evesde_industryActivityProducts_productTypeID" ON "industryActivityProducts"("productTypeID");

-- CreateIndex
CREATE INDEX "ix_evesde_industryActivityProducts_typeID" ON "industryActivityProducts"("typeID");

-- CreateIndex
CREATE INDEX "ix_evesde_industryActivityRaces_productTypeID" ON "industryActivityRaces"("productTypeID");

-- CreateIndex
CREATE INDEX "ix_evesde_industryActivityRaces_typeID" ON "industryActivityRaces"("typeID");

-- CreateIndex
CREATE INDEX "industryActivitySkills_idx1" ON "industryActivitySkills"("typeID", "activityID");

-- CreateIndex
CREATE INDEX "ix_evesde_industryActivitySkills_skillID" ON "industryActivitySkills"("skillID");

-- CreateIndex
CREATE INDEX "ix_evesde_industryActivitySkills_typeID" ON "industryActivitySkills"("typeID");

-- CreateIndex
CREATE INDEX "ix_evesde_invContrabandTypes_typeID" ON "invContrabandTypes"("typeID");

-- CreateIndex
CREATE INDEX "ix_evesde_invGroups_categoryID" ON "invGroups"("categoryID");

-- CreateIndex
CREATE INDEX "items_IX_OwnerLocation" ON "invItems"("ownerID", "locationID");

-- CreateIndex
CREATE INDEX "ix_evesde_invItems_locationID" ON "invItems"("locationID");

-- CreateIndex
CREATE INDEX "ix_evesde_invTypes_groupID" ON "invTypes"("groupID");

-- CreateIndex
CREATE UNIQUE INDEX "ix_evesde_invUniqueNames_itemName" ON "invUniqueNames"("itemName");

-- CreateIndex
CREATE INDEX "invUniqueNames_IX_GroupName" ON "invUniqueNames"("groupID", "itemName");

-- CreateIndex
CREATE INDEX "ix_evesde_mapDenormalize_constellationID" ON "mapDenormalize"("constellationID");

-- CreateIndex
CREATE INDEX "ix_evesde_mapDenormalize_orbitID" ON "mapDenormalize"("orbitID");

-- CreateIndex
CREATE INDEX "ix_evesde_mapDenormalize_regionID" ON "mapDenormalize"("regionID");

-- CreateIndex
CREATE INDEX "ix_evesde_mapDenormalize_solarSystemID" ON "mapDenormalize"("solarSystemID");

-- CreateIndex
CREATE INDEX "ix_evesde_mapDenormalize_typeID" ON "mapDenormalize"("typeID");

-- CreateIndex
CREATE INDEX "mapDenormalize_IX_groupConstellation" ON "mapDenormalize"("groupID", "constellationID");

-- CreateIndex
CREATE INDEX "mapDenormalize_IX_groupRegion" ON "mapDenormalize"("groupID", "regionID");

-- CreateIndex
CREATE INDEX "mapDenormalize_IX_groupSystem" ON "mapDenormalize"("groupID", "solarSystemID");

-- CreateIndex
CREATE INDEX "ix_evesde_mapSolarSystems_constellationID" ON "mapSolarSystems"("constellationID");

-- CreateIndex
CREATE INDEX "ix_evesde_mapSolarSystems_regionID" ON "mapSolarSystems"("regionID");

-- CreateIndex
CREATE INDEX "ix_evesde_mapSolarSystems_security" ON "mapSolarSystems"("security");

-- CreateIndex
CREATE INDEX "ix_evesde_ramAssemblyLineStations_ownerID" ON "ramAssemblyLineStations"("ownerID");

-- CreateIndex
CREATE INDEX "ix_evesde_ramAssemblyLineStations_regionID" ON "ramAssemblyLineStations"("regionID");

-- CreateIndex
CREATE INDEX "ix_evesde_ramAssemblyLineStations_solarSystemID" ON "ramAssemblyLineStations"("solarSystemID");

-- CreateIndex
CREATE INDEX "ix_evesde_skinShip_skinID" ON "skinShip"("skinID");

-- CreateIndex
CREATE INDEX "ix_evesde_skinShip_typeID" ON "skinShip"("typeID");

-- CreateIndex
CREATE INDEX "ix_evesde_staStations_constellationID" ON "staStations"("constellationID");

-- CreateIndex
CREATE INDEX "ix_evesde_staStations_corporationID" ON "staStations"("corporationID");

-- CreateIndex
CREATE INDEX "ix_evesde_staStations_operationID" ON "staStations"("operationID");

-- CreateIndex
CREATE INDEX "ix_evesde_staStations_regionID" ON "staStations"("regionID");

-- CreateIndex
CREATE INDEX "ix_evesde_staStations_solarSystemID" ON "staStations"("solarSystemID");

-- CreateIndex
CREATE INDEX "ix_evesde_staStations_stationTypeID" ON "staStations"("stationTypeID");

