'use client'
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import { useSearchParams } from "next/navigation";
// import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { signIn } from "next-auth/react";
import useAuthCustomer from "@/hooks/useAuthCustomer";

interface LoginClientProps {
    initialLoading: boolean
}
export default function LoginClient ({ initialLoading }: LoginClientProps) {
    const { router } = useAuthCustomer();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || ('/dashboard');
    const errorType = searchParams.get('error')
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("Login...");
    const [loading, setLoading] = useState<boolean>(initialLoading);

    useEffect(() => {
        if(errorType){
            switch (errorType) {
                case "CredentialsSignin":
                    setError("Invalid email or password");
                    break;
                case "SessionRequired":
                    setError("You need to be signed in to access this page");
                    break;
                default:
                    setError("An authentication error occurred");
            }
        }
    }, [errorType])
    
    useEffect(() => {
        const timeProcess = setTimeout (() => {
            setLoading(false);
            setError("Login...");
        }, 1000);
        return () => clearTimeout(timeProcess);
    }, [error])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const user = await signIn('credentials', {email, password, redirect: false});
        if(user?.error){
            setError(!email || !password ? 'Please fill all requirement' : "Invalid Email or Password")
            setEmail("");
            setPassword("");
        }
        else{
            router.push(redirect);
            router.refresh();
        }
    }

    return (
        <div className="bg-amber-700 min-h-screen overflow-x-hidden">
            <Navbar/>
            <main className="flex flex-col justify-center items-center min-h-screen">
                {!loading && (
                    <form onSubmit={handleSubmit} className="flex flex-col bg-amber-100 p-[2rem] gap-[1rem] rounded-[1rem] w-[15rem] lg:w-[25rem] text-black">
                        <h1 className="font-extrabold text-[1rem] lg:text-[2.5rem]">Login Page</h1>
                        <input data-testid="inptEmail" type="email" placeholder="email@mail.com" className="border p-[0.2rem] lg:p-[0.5rem] rounded-[0.6rem] text-[1rem] lg:text-[1.5rem]" onChange={mail => setEmail(mail.target.value)}/>
                        <input data-testid="inptPassword" type="password" placeholder="Passsword" className="border p-[0.2rem] lg:p-[0.5rem] rounded-[0.6rem] text-[1rem] lg:text-[1.5rem]" onChange={pass => setPassword(pass.target.value)}/>
                        <button data-testid="btnSignIn" type="submit" className="bg-emerald-500 rounded-[0.6rem] hover:bg-emerald-700 hover:text-white active:scale-95 duration-200 text-[1rem] lg:text-[1.5rem] p-[0.2rem] lg:p-[0.5rem]" disabled={loading}>Sign In</button>
                        <button data-testid="btnCreate" type="button" className="bg-emerald-500 rounded-[0.6rem] hover:bg-emerald-700 hover:text-white active:scale-95 duration-200 text-[1rem] lg:text-[1.5rem] p-[0.2rem] lg:p-[0.5rem]" disabled={loading} onClick={() => router.push("/register")}>Create Account</button>
                    </form>
                )}
                {loading && (
                    <section className="bg-amber-100 min-w-[15rem] min-h-[4rem] flex justify-center items-center rounded-[1rem]">
                        <h1>{error}</h1>
                    </section>
                )}
            </main>
        </div>
    );
}