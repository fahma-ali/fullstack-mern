import React from 'react'
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
  Card,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormStatus } from "react-dom";
import { ImSpinner2 } from "react-icons/im";
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../../../api/apiClients.js';
import { extractErrorMessages } from '../../../utils/errorUtils.js';
import useAuthStore from '../../../store/authstore.js';

function LoginForm() {
  const navigate = useNavigate();
  const [isloading, setIsloading] = useState();

    const [formValue, setFormValue] = useState({
      email: "",
      password: "",
    });
    const [error, setError] = useState(null)
  const {login } = useAuthStore();
  
    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({...formValue,[name]:value})
  
  }

    const loginMutation = useMutation({
      mutationFn: async (newUser) => {
        const response = await api.post("/auth/login", newUser);
        console.log(response);
        return response.data;
      },
      onSuccess: (data) => {
        console.log("LOGIN SUCCESS:", data);

        if (data.token) {
          const user = data.user;
          const token = data.token;

          console.log("BEFORE ZUSTAND LOGIN:", user);

          login(user, token);

          console.log("AFTER ZUSTAND LOGIN:", useAuthStore.getState());

          navigate("/dashboard");
        }
      },
      onError: (err) => {
        console.dir(err); // forces an expandable object
        setError(extractErrorMessages(err));
      },
    });
   const handleSubmitForm = (e) => {
     e.preventDefault();
     setError(null);
     if (
       !formValue.email ||
       !formValue.password ) {
       setError("All fields are required");
       return;
     }
   
     // TODO:Mutation
     loginMutation.mutate({
       email: formValue.email,
       password: formValue.password,
     });
   };
  return (
    <Card className="w-full border-border">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl text-center">Sigin</CardTitle>
        <CardDescription className="text-center">
          Enter your Cridentials access your account
        </CardDescription>
        <form onSubmit={handleSubmitForm}>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-2">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                  {error}
                </div>
              )}
              <div className="text-sm font-medium text-left">Email</div>
              <Input
                name="email"
                placeholder="email@email.com"
                onChange={handleChange}
                value={formValue.email}
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-left">Password</div>
              <Input
                name="password"
                placeholder="*****"
                onChange={handleChange}
                value={formValue.password}
              />
            </div>

            <div className="py-4">
              <Button
                type="submit"
                disabled={isloading}
                className="w-full cursor-pointer"
              >
                {isloading ? (
                  <span className="flex items-center gap-2">
                    <ImSpinner2 className="animate-spin" /> Creating Account ...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </CardContent>

          <CardFooter>
            <div className="text-center text-sm">
              Don't have account ?
              <a
                onClick={() => navigate("/register")}
                className="text-primary hover:underline cursor-pointer"
              >
                Sign up
              </a>
            </div>
          </CardFooter>
        </form>
      </CardHeader>
    </Card>
  );
};
export default LoginForm;