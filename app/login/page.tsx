"use client";
import { FormEvent } from "react";
// import { useRouter } from "next/router";

export default function LoginPage(){

  function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "/dashboard";
  }


    return(
        <div className="h-[100vh] w-full flex justify-center items-center bg-[#272727]">  


            <form onSubmit={handleLogin} className="bg-[black] px-[50px] py-[100px]">
                <div className="pt-5">
                    <label htmlFor="">email</label>
                    <input
                        className="w-full border-2 border-[white]"
                        type="email" placeholder="write you email"/>
                </div>
                <div className="pt-5">
                    <label htmlFor="">email</label>
                    <input 
                        className="w-full border-2 border-[white]"
                        type="password" placeholder="********"/>
                </div>
                <div className="pt-5">
                    <button type="submit" className="bg-[white] text-black">Sign in</button>
                </div>
            </form>


        </div>
    );
}