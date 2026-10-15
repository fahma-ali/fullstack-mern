import React, { useState } from 'react'
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
import { data, useNavigate } from 'react-router';
import {useMutation} from "@tanstack/react-query"
import axios from "axios"
import api from '../../../api/apiClients.js';
import { extractErrorMessages } from "../../../utils/errorUtils.js";
function RegisterForm() {

  const [formValue, setFormValue] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState(null)
  const registerMutation = useMutation({
    mutationFn: async (newUser) => {
      const response = await api.post(
        "/auth/register",
        newUser,
      );
      console.log(response);
      return response.data;
    },
    onSuccess: (data) => {
      navigate("/login");
    },
    onError: (err) => {
      console.dir(err); // forces an expandable object
      setError(extractErrorMessages(err));
    },
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({...formValue,[name]:value})
  
 }
  const handleSubmitForm = (e) => {
    e.preventDefault();
    setError(null)
    if (!formValue.name || !formValue.email || !formValue.password || !formValue.confirmPassword) {
      setError("All fields are required")
      return
    }
    if (formValue.password !== formValue.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // TODO:Mutation
    registerMutation.mutate({name:formValue.name,email:formValue.email,password:formValue.password,confirmPassword:formValue.confirmPassword});
  }
const navigate = useNavigate();

  return (
    <Card className="w-full border-border">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl text-center">Create an account</CardTitle>
        <CardDescription className="text-center">
          Enter your details to register
        </CardDescription>
        <form onSubmit={handleSubmitForm}>
          <CardContent className="space-y-4 pt-0">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <div className="text-sm font-medium text-left">Full Name</div>
              <Input
                name="name"
                placeholder="John Doe"
                value={formValue.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-left">Email</div>
              <Input
                name="email"
                placeholder="email@email.com"
                value={formValue.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-left">Password</div>
              <Input
                name="password"
                placeholder="*****"
                value={formValue.password}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-left">
                Confirm Password
              </div>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="******"
                value={formValue.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div className="py-4">
   <Button type="submit" disabled={registerMutation.isPending} className="w-full cursor-pointer">
      {registerMutation.isPending ? (
        <span className="flex items-center gap-2">
          <ImSpinner2 className="animate-spin" /> Creating Account ...
        </span>
      ) : (
        "Create Account"
      )}
    </Button>            </div>
          </CardContent>

          <CardFooter>
            <div className="text-center text-sm">
              Already have an account
              <a
                onClick={() => navigate("/login")}
                className="text-primary hover:underline cursor-pointer"
              >
                Sign in
              </a>
            </div>
          </CardFooter>
        </form>
      </CardHeader>
    </Card>
  );
}

export default RegisterForm;