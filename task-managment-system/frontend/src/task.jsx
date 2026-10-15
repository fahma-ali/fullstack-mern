import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Task() {
  const [task, setTask] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async(newTask) => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify(newTask),
      });
      if (!res.ok) throw new Error("Failed", res.status)
      
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
      setTask("");
    }
  })
  function handleAdd() {
    if (!task.trim()) return;
      mutation.mutate({ title:task, status: "completed" });
    }
  return (
    <div className="flex gap-2 p-4">
      <Input
        className="bg-white text-black border-blue-500 focus-visible:ring-blue-500"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <Button variant={"default"} size="lg" onClick={handleAdd}>
        Add Task
      </Button>
    </div>
  );
}
