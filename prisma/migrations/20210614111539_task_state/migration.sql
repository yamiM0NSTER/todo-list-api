-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "guid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "notificationTime" DATETIME NOT NULL,
    "notificationText" TEXT NOT NULL,
    "seen" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "state" INTEGER NOT NULL DEFAULT 1000,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("createdAt", "guid", "id", "notificationText", "notificationTime", "seen", "title", "updatedAt", "userId") SELECT "createdAt", "guid", "id", "notificationText", "notificationTime", "seen", "title", "updatedAt", "userId" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE UNIQUE INDEX "Task.guid_unique" ON "Task"("guid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
