-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN "name" TEXT;

-- CreateTable
CREATE TABLE "Location" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "aisle" TEXT NOT NULL,
    "rack" TEXT NOT NULL,
    "shelf" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InventoryItems" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inventoryId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "locationId" INTEGER,
    CONSTRAINT "InventoryItems_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InventoryItems_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InventoryItems_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_InventoryItems" ("id", "inventoryId", "itemId", "quantity") SELECT "id", "inventoryId", "itemId", "quantity" FROM "InventoryItems";
DROP TABLE "InventoryItems";
ALTER TABLE "new_InventoryItems" RENAME TO "InventoryItems";
CREATE UNIQUE INDEX "InventoryItems_locationId_key" ON "InventoryItems"("locationId");
CREATE UNIQUE INDEX "InventoryItems_inventoryId_itemId_key" ON "InventoryItems"("inventoryId", "itemId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
