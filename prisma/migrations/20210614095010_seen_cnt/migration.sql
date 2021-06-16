-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "guid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "notificationTime" DATETIME NOT NULL,
    "notificationText" TEXT NOT NULL,
    "seen" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Task" ("createdAt", "guid", "id", "notificationText", "notificationTime", "title", "updatedAt") SELECT "createdAt", "guid", "id", "notificationText", "notificationTime", "title", "updatedAt" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE UNIQUE INDEX "Task.guid_unique" ON "Task"("guid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
