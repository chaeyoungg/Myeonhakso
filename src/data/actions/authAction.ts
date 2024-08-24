"use server";

import { signIn } from "@/auth";
import { redirect } from "next/navigation";

// email/password 로그인
export async function signInWithCredentials(formData: FormData) {

  try {
    const result = await signIn('credentials',{
      email: formData.get("email") || "",
      password: formData.get("password") || "",
      redirect: false
    });
    console.log(result);
  } catch (err) {
    console.error(err);
  }
  redirect('/')
}

export async function signInWithNaver(formData: FormData) {
  await signIn('naver', {redirectTo: '/'})
}

export async function signInWithKaKao(formData: FormData) {
  await signIn('kakao', {redirectTo: '/'})
}

export async function signInWithGoogle(formData: FormData) {
  await signIn('google', {redirectTo: '/'})
}




