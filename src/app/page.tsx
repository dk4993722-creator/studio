
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { YunexLogo } from "@/components/yunex-logo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, User } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { db, firebaseError } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, setDoc } from "firebase/firestore";

const loginSchema = z.object({
  identifier: z.string().min(1, { message: "User ID or Email is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const signupSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
  sponsorId: z.string().min(1, { message: "Sponsor ID is required." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  mobile: z.string().min(10, { message: "Mobile number must be at least 10 digits." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loginRole, setLoginRole] = useState<'dealer' | 'admin' | 'agency'>('dealer');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  useEffect(() => {
    if (firebaseError) {
      toast({
        variant: "destructive",
        title: "Firebase Connection Error",
        description: "Could not connect to the database. Please check your Firebase project configuration in .env.local.",
        duration: 10000,
      });
    }
  }, [toast]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { userId: "", sponsorId: "", name: "", email: "", mobile: "", password: "", terms: false },
  });

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    if (firebaseError) return;

    switch (loginRole) {
      case 'dealer':
        console.log("User login attempt with:", values.identifier);
        router.push("/dashboard");
        break;
      case 'admin':
        if (values.identifier.trim() === 'admin@yunex.com' && values.password.trim() === 'admin') {
          router.push('/admin/dashboard');
        } else {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid admin credentials.",
          });
        }
        break;
      case 'agency':
        console.log("Agency login attempt with:", values.identifier);
        toast({
            title: "Coming Soon",
            description: "The agency dashboard is not yet implemented.",
        });
        break;
    }
  };

  const onSignup = async (values: z.infer<typeof signupSchema>) => {
    if (!db) {
        toast({ variant: "destructive", title: "Database Error", description: "Not connected to Firestore." });
        return;
    }

    try {
      const usersRef = collection(db, "users");
      const qId = query(usersRef, where("id", "==", values.userId));
      const qEmail = query(usersRef, where("email", "==", values.email));

      const idSnapshot = await getDocs(qId);
      if (!idSnapshot.empty) {
          signupForm.setError("userId", {
              type: "manual",
              message: "This User ID is already taken.",
          });
          return;
      }

      const emailSnapshot = await getDocs(qEmail);
      if (!emailSnapshot.empty) {
          signupForm.setError("email", {
              type: "manual",
              message: "This email is already registered.",
          });
          return;
      }

      const newUser = {
          id: values.userId,
          sponsorId: values.sponsorId,
          name: values.name,
          email: values.email,
          mobile: values.mobile,
          password: values.password,
          role: 'Associate' as 'Associate' | 'Dealer',
          status: 'Active' as 'Active' | 'Inactive' | 'Pending',
          isAdminCreated: false,
      };

      await setDoc(doc(db, "users", values.userId), newUser);
      
      toast({
          title: "Signup Successful!",
          description: "Your account has been created.",
      });
      router.push(`/dashboard?name=${encodeURIComponent(values.name)}`);
    } catch (error) {
        console.error("Error signing up:", error);
        toast({
            variant: "destructive",
            title: "Signup Failed",
            description: "Could not create your account. Please try again.",
        });
    }
  };
  
  const handleRoleSelect = (role: 'dealer' | 'admin' | 'agency') => {
    loginForm.reset();
    setLoginRole(role);
    setAuthMode('login');
  };

  const roleConfig = {
    dealer: {
      title: "User Login",
      description: "Access your YUNEX wallet.",
      emailLabel: "User ID / Email",
      emailPlaceholder: "Enter your User ID or Email",
      passwordLabel: "Password",
      buttonText: "Login"
    },
    admin: {
      title: "Admin Login",
      description: "Access the admin dashboard.",
      emailLabel: "Admin Email",
      emailPlaceholder: "admin@yunex.com",
      passwordLabel: "Admin Password",
      buttonText: "Login as Admin"
    },
    agency: {
      title: "Agency Login",
      description: "Access the agency dashboard.",
      emailLabel: "Agency Email",
      emailPlaceholder: "agency@example.com",
      passwordLabel: "Agency Password",
      buttonText: "Login as Agency"
    }
  }
  const currentRoleConfig = roleConfig[loginRole];

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <User className="mr-2 h-4 w-4" />
              <span>Login As</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Select Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => handleRoleSelect('dealer')}>User Login</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleRoleSelect('agency')}>Agency Login</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleRoleSelect('admin')}>Admin Login</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="absolute inset-0 -z-10 bg-background" />
      <div className="flex items-center gap-4 mb-8">
        <YunexLogo className="h-16 w-16" />
        <h1 className="text-4xl font-headline font-bold text-foreground">YUNEX</h1>
      </div>
      
      <Card className="w-full max-w-md overflow-hidden">
        <div className="grid w-full grid-cols-2 bg-[#326cd1]">
          <button
            onClick={() => setAuthMode('login')}
            className={cn(
              "py-3 text-base transition-colors",
              authMode === 'login' ? 'bg-background text-primary' : 'text-primary-foreground hover:bg-primary/90'
            )}
          >
            Login
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={cn(
              "py-3 text-base transition-colors",
              authMode === 'signup' ? 'bg-background text-primary' : 'text-primary-foreground hover:bg-primary/90'
            )}
          >
            Sign Up
          </button>
        </div>
        
        {authMode === 'login' && (
          <>
            <CardHeader>
              <CardTitle className="font-headline">{currentRoleConfig.title}</CardTitle>
              <CardDescription>{currentRoleConfig.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                  <FormField
                    control={loginForm.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{currentRoleConfig.emailLabel}</FormLabel>
                        <FormControl>
                          <Input placeholder={currentRoleConfig.emailPlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{currentRoleConfig.passwordLabel}</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">{currentRoleConfig.buttonText}</Button>
                </form>
              </Form>
            </CardContent>
          </>
        )}

        {authMode === 'signup' && (
          <>
            <CardHeader>
              <CardTitle className="font-headline">Sign Up</CardTitle>
              <CardDescription>Create your new YUNEX wallet.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-6">
                  <FormField
                    control={signupForm.control}
                    name="sponsorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sponsor ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter sponsor ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={signupForm.control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Create your unique user ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile No.</FormLabel>
                        <FormControl>
                          <Input placeholder="Your mobile number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input type={showSignupPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                            onClick={() => setShowSignupPassword(!showSignupPassword)}
                          >
                            {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>I agree to the terms and conditions.</FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Create Account</Button>
                </form>
              </Form>
            </CardContent>
          </>
        )}
      </Card>
    </main>
  );
}
