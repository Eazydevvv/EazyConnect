import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs"
import Background from "../../assets/login2.avif"
import Hand from "../../assets/hand.gif"
import Victory from "../../assets/victory.gif"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Tabs, TabsList } from "../../components/ui/tabs"
import { useState } from "react"
import { toast } from "sonner"
import { apiClient } from "../../lib/api-client"
import { LOGIN_ROUTES, SIGNUP_ROUTES } from "../../utils/constant"
import { useNavigate } from "react-router-dom"
import { useAppStore } from "../../store"
import { FiEye, FiEyeOff } from "react-icons/fi";

const Auth = () => {
    const navigate = useNavigate()
    const { setUserInfo } = useAppStore();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);


    const validateLogin = () => {
        if (!email.length) {
            toast.error('Email is required.');
            return false;
        }
        if (!password.length) {
            toast.error("Password is required.")
            return false;

        }


        return true;
    }

    const validateSignup = () => {
        if (!email.length) {
            toast.error('Email is required.');
            return false;
        }
        if (!password.length) {
            toast.error("Password is required.")
            return false;

        }

        if (password !== confirmPassword) {
            toast.error("Password does not match")
            return false;

        }
        return true;

    };


    const handleLogin = async () => {
        if (validateLogin()) {
            setLoading(true);
            try {
                const response = await apiClient.post(LOGIN_ROUTES, { email, password }, { withCredentials: true });
                if (response.data.user.id) {
                    setUserInfo(response.data.user);
                    toast.success("Login successful!");
                    navigate(response.data.user.profileSetup ? "/chat" : "/profile");
                }
            } catch (error) {
                toast.error("Login failed.");
            } finally {
                setLoading(false);
            }
        }
    };


    const handleSignup = async () => {
        if (validateSignup()) {
            setLoading(true);
            try {
                const response = await apiClient.post(SIGNUP_ROUTES,
                    { email, password },
                    { withCredentials: true }
                );
                if (response.status === 201) {
                    setUserInfo(response.data.user);
                    toast.success("Signup successful!");
                    navigate("/profile");
                }
            } catch (error) {
                toast.error("Signup failed.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className=" h-[100vh] w-[100vw] flex items-center justify-center">
            <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
                <div className="flex flex-col gap-10 items-center justify-center ">
                    <div className="flex items-center justify-center flex-col">
                        <div className="flex items-center justify-center">
                            <h1 className="text-5xl font-bold md:text-6xl"> Welcome</h1>
                            <img src={Hand} alt="victory" className="h-[100px]" />
                        </div>
                        <p className=" font-medium text-center">
                            Fill in the details to get started with EazyConnect!
                        </p>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Tabs className={"w-3/4"} defaultValue="login">
                            <TabsList className="bg-transparent rounded-none w-full">
                                <TabsTrigger value="login"
                                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 "
                                >Sign In</TabsTrigger>
                                <TabsTrigger value="signup"
                                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 "
                                >Sign Up</TabsTrigger>
                            </TabsList>
                            <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    className="rounded-full p-6"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <div className="relative">
                                    <Input
                                        placeholder="Password"
                                        type={showPassword ? "text" : "password"}
                                        className="rounded-full p-6 pr-12"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </div>
                                </div>

                                <Button
                                    className="rounded-full p-6"
                                    onClick={handleLogin}
                                    disabled={loading}
                                >
                                    {loading ? "Signing in..." : "Sign in"}
                                </Button>
                            </TabsContent>

                            <TabsContent className="flex flex-col gap-5" value="signup">
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    className="rounded-full p-6"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <div className="relative">
                                    <Input
                                        placeholder="Password"
                                        type={showPassword ? "text" : "password"}
                                        className="rounded-full p-6 pr-12"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </div>
                                </div>

                                <div className="relative">
                                    <Input
                                        placeholder="Confirm Password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="rounded-full p-6 pr-12"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <div
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                    </div>
                                </div>

                                <Button
                                    className="rounded-full p-6"
                                    onClick={handleSignup}
                                    disabled={loading}
                                >
                                    {loading ? "Signing up..." : "Sign up"}
                                </Button>
                            </TabsContent>

                        </Tabs>
                    </div>
                </div>
                <div className="hidden xl:flex items-center justify-center">
                    <img src={Background} alt="background" className="h-[700px]" />

                </div>
            </div>
        </div>
    )
}

export default Auth