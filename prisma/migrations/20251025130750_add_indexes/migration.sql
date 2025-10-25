-- CreateIndex
CREATE INDEX "links_userId_idx" ON "links"("userId");

-- CreateIndex
CREATE INDEX "links_userId_isActive_idx" ON "links"("userId", "isActive");

-- CreateIndex
CREATE INDEX "views_userId_idx" ON "views"("userId");

-- CreateIndex
CREATE INDEX "views_createdAt_idx" ON "views"("createdAt");
