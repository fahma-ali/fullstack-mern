import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api/apiClients";
import useAuthStore from "@/store/authStore";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {extractErrorMessages} from '@/utils/errorUtils'
import { Loader } from "lucide-react";
function TaskForm({ task, open, onOpenChange }) {
  const status = [
    { label: "pending", value: "pending" },
    { label: "in progress", value: "in progress" },
    { label: "completed", value: "completed" },
  ];

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
  });
  const [validationError, setvalidationError] = useState(null);
  useEffect(() => {
    if (task) {
      setFormValues({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "pending",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      setFormValues({
        title: "",
        description: "",
        status: "pending",
        dueDate: "",
      });
    }
    setvalidationError(null);
  }, [open, task]);
 
  const queryClient = useQueryClient();

  const createTask = useMutation({
    mutationKey: ["tasks"],
    mutationFn: async (taskData) => {
      const response = await api.post("/task", taskData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tasks"]);
      console.log("success ", data);
      toast.success("Task created successfully");
      onOpenChange?.(false);
      open?.false;
      setFormValues({
        title: "",
        description: "",
        status: "pending",
        dueDate: "",
      });
    },
    onError: (error) => {
      console.log("error", error);
      (toast.error("Failed to create task"), error);
      extractErrorMessages(error)
    },
  });

  const updateTask = useMutation({
    mutationKey: ["tasks"],
    mutationFn: async (taskData) => {
      const response = await api.put(`/task/${task._id}`, taskData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Updated Successfully", data);
      queryClient.invalidateQueries(['task']);
     onOpenChange?.(false);

    },
    onError: (err) => {
      toast.error("Updated failed", err);
    },
  });

 const displayError =
   validationError ||
   extractErrorMessages(createTask.error) ||
    extractErrorMessages(updateTask.error);
  const isloading = createTask.isPending || updateTask.isPending;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const handleStatusChange = (value) => {
    setFormValues({
      ...formValues,
      status: value,
    });
  };

  const handleCancel = () => {
    onOpenChange?.(false);
  };

  const onSubmitHandle = (e) => {
    e.preventDefault();
    if (!formValues.title) {
      setvalidationError("Title is required");
      return;
    }
    const taskData = {
      title: formValues.title.trim(),
      description: formValues.description.trim() || "",
      status: formValues.status,
      dueDate: formValues.dueDate ? new Date(formValues.dueDate) : null,
    };
    if (task) {
      updateTask.mutate(taskData);
    } else {
      createTask.mutate(taskData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new task.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-2" onSubmit={onSubmitHandle}>
          <div className="space-y-2">
            {displayError && (
              <div className=" p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                {displayError}
              </div>
            )}
            <Label htmlFor="title">Title</Label>
            <Input
              name="title"
              placeholder="enter title"
              onChange={handleOnChange}
              value={formValues.title}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">description</Label>
            <Textarea
              name="description"
              placeholder="enter description"
              onChange={handleOnChange}
              value={formValues.description}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">status</Label>
            <Select
              placeholder="enter status"
              value={formValues.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {status.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Due Date</Label>
            <Input
              type="date"
              name="dueDate"
              placeholder="enter due Date"
              onChange={handleOnChange}
              value={formValues.dueDate}
            />
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isloading}>
              {isloading ? (
                <span className="flex items-center gap-2">
                  <Loader className="size-4 animate-spin" />
                  {task ? "Updating ..." : "Creating..."}
                </span>
              ) : task ? (
                "Update Task"
              ) : (
                "Create Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TaskForm;
