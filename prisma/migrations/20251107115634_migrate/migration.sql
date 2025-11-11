-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);
