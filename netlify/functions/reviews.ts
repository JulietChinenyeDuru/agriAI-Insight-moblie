import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { reviews } from "../../db/schema.js";
import { desc } from "drizzle-orm";

export default async (req: Request) => {
  if (req.method === "GET") {
    const allReviews = await db
      .select()
      .from(reviews)
      .orderBy(desc(reviews.createdAt))
      .limit(100);
    return Response.json(allReviews);
  }

  if (req.method === "POST") {
    const body = await req.json();
    const { authorName, rating, comment } = body;

    if (!authorName || !rating || !comment) {
      return Response.json(
        { error: "authorName, rating, and comment are required" },
        { status: 400 }
      );
    }

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return Response.json(
        { error: "rating must be an integer between 1 and 5" },
        { status: 400 }
      );
    }

    const trimmedName = String(authorName).trim().slice(0, 100);
    const trimmedComment = String(comment).trim().slice(0, 1000);

    if (!trimmedName || !trimmedComment) {
      return Response.json(
        { error: "authorName and comment must not be empty" },
        { status: 400 }
      );
    }

    const [review] = await db
      .insert(reviews)
      .values({
        authorName: trimmedName,
        rating: ratingNum,
        comment: trimmedComment,
      })
      .returning();

    return Response.json(review, { status: 201 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/reviews",
};
