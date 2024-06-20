-- CreateTable
CREATE TABLE "Coupon" (
    "code" TEXT NOT NULL,
    "discount" INTEGER NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("code")
);
