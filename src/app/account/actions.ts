"use server";

import sql from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createHash } from "crypto";
import { put } from "@vercel/blob";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function registerUser(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const bio = formData.get("bio") as string;
  const imageFile = formData.get("profileImage") as File;

  // check if password and confirmPassword match
  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match." };
  }

  // check if password meets security requirements
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    return { success: false, error: "Password must be at least 8 characters long and contain both letters and numbers." };
  }

  let sellerId: string;

  try {
    // check if the email already exists in the sellers table to prevent duplicate accounts
    const existingSellers = await sql`
      SELECT id FROM sellers WHERE email = ${email}
    `;
    if (existingSellers.length > 0) {
      return { success: false, error: "An account with this email already exists." };
    }

    const hashedPassword = createHash("sha256").update(password).digest("hex");

    let profileImageUrl = "";

    // stream the file to Vercel Storage if it exists
    if (imageFile && imageFile.size > 0) {
      const blob = await put(`profiles/${Date.now()}-${imageFile.name}`, imageFile, {
        access: "public",
      });
      profileImageUrl = blob.url;
    }

    // insert the new record directly into the sellers table
    const result = await sql`
      INSERT INTO sellers (name, email, password_hash, bio, profile_image)
      VALUES (${name}, ${email}, ${hashedPassword}, ${bio || ''}, ${profileImageUrl})
      RETURNING id
    `;

    sellerId = result[0].id;
    revalidatePath("/account");
  } catch (error) {
    console.error("Seller registration database error:", error);
    return { success: false, error: "Database registration transaction failed." };
  }

  const cookieStore = await cookies();
  cookieStore.set("seller_session", sellerId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  redirect("/dashboard");
}

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  let sellerId: string;

  try {
    // fetch the seller record matching the given email
    const sellers = await sql`
      SELECT id, name, password_hash FROM sellers WHERE email = ${email}
    `;

    if (sellers.length === 0) {
      return { success: false, error: "Invalid email or password." };
    }

    const seller = sellers[0];
    const incomingHash = createHash("sha256").update(password).digest("hex");

    if (seller.password_hash !== incomingHash) {
      return { success: false, error: "Invalid email or password." };
    }

    sellerId = seller.id;
  } catch (error) {
    console.error("Seller login database error:", error);
    return { success: false, error: "Database authentication transaction failed." };
  }

  const cookieStore = await cookies();
  cookieStore.set("seller_session", sellerId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  redirect("/dashboard");
}