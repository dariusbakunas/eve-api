-- CreateTable
CREATE TABLE "Alliance" (
    "id" SERIAL NOT NULL,
    "esiId" INTEGER NOT NULL,
    "creatorCorporationId" INTEGER NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "dateFounded" TIMESTAMP(3) NOT NULL,
    "executorCorporationId" INTEGER NOT NULL,
    "factionId" INTEGER NOT NULL,
    "ticker" TEXT NOT NULL,

    CONSTRAINT "Alliance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Corporation" (
    "id" SERIAL NOT NULL,
    "esiId" INTEGER NOT NULL,
    "allianceId" INTEGER,
    "ceoId" INTEGER NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "dateFounded" TIMESTAMP(3),
    "description" TEXT,
    "factionId" INTEGER,
    "homeStationId" INTEGER,
    "memberCount" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "shares" INTEGER,
    "taxRate" INTEGER NOT NULL,
    "ticker" TEXT NOT NULL,
    "url" TEXT,
    "warEligible" BOOLEAN NOT NULL,

    CONSTRAINT "Corporation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Alliance_esiId_key" ON "Alliance"("esiId");

-- CreateIndex
CREATE UNIQUE INDEX "Corporation_esiId_key" ON "Corporation"("esiId");

-- AddForeignKey
ALTER TABLE "Corporation" ADD CONSTRAINT "Corporation_allianceId_fkey" FOREIGN KEY ("allianceId") REFERENCES "Alliance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
