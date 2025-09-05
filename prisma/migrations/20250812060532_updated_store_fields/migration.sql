-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Store" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "code" TEXT NOT NULL,
    "nextTransactionNumber" INTEGER NOT NULL DEFAULT 1,
    "governmetTax" REAL,
    "serviceCharge" REAL,
    "outletType" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "wifiSSID" TEXT,
    "branchId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "Store_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Store_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Store" ("address", "branchId", "code", "governmetTax", "id", "isActive", "name", "nextTransactionNumber", "outletType", "ownerId", "phone", "serviceCharge", "wifiSSID") SELECT "address", "branchId", "code", "governmetTax", "id", "isActive", "name", "nextTransactionNumber", "outletType", "ownerId", "phone", "serviceCharge", "wifiSSID" FROM "Store";
DROP TABLE "Store";
ALTER TABLE "new_Store" RENAME TO "Store";
CREATE UNIQUE INDEX "Store_code_key" ON "Store"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
