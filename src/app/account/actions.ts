"use server";

import sql from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createHash } from "crypto";
import { put } from "@vercel/blob";

export async function registerUser(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
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

  try {
    // check if the email already exists in the sellers table to prevent duplicate accounts
    const existingSellers = await sql`
      SELECT id FROM sellers WHERE email = ${email}
    `;
    if (existingSellers.length > 0) {
      return { success: false, error: "An account with this email already exists." };
    }

    const fullName = `${firstName} ${lastName}`;
    const hashedPassword = createHash("sha256").update(password).digest("hex");

    let profileImageUrl = "/placeholder.jpg";

    // stream the file to Vercel Storage if it exists
    if (imageFile && imageFile.size > 0) {
      const blob = await put(`profiles/${Date.now()}-${imageFile.name}`, imageFile, {
        access: "public",
      });
      profileImageUrl = blob.url;
    }

    // insert the new record directly into the sellers table
    await sql`
      INSERT INTO sellers (name, email, password_hash, bio, profile_image)
      VALUES (${fullName}, ${email}, ${hashedPassword}, ${bio || ''}, ${profileImageUrl})
    `;

    revalidatePath("/account");
    return { success: true, error: null };
  } catch (error) {
    console.error("Seller registration database error:", error);
    return { success: false, error: "Database registration transaction failed." };
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

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

    return { 
      success: true, 
      error: null, 
      user: { id: seller.id, name: seller.name } 
    };
  } catch (error) {
    console.error("Seller login database error:", error);
    return { success: false, error: "Database authentication transaction failed." };
  }
}