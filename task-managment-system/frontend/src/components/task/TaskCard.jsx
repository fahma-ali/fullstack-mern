import React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar, Edit2, MoreVertical, Trash2 } from "lucide-react";
import api from "@/api/apiClients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
const TaskCard = ({ task, onEditTask, onstateChange }) => {
  const STATUS_CONFIG = {
    pending: {
      variant: "secondary",
      label: "Pending",
      color: "text-yellow-600",
    },
    "in progress": {
      variant: "default",
      label: "In Progress",
      color: "text-blue-600",
    },
    completed: {
      variant: "outline",
      label: "Completed",
      color: "text-green-600",
    },
  };
  const statusConfig = STATUS_CONFIG[task.status] || STATUS_CONFIG["pending"];

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const dueDate = formatDate(task.dueDate);
  const isOverdue = (dueDate) => {
    if (!dueDate || task.status === "completed") return false;
    return new Date(dueDate) < new Date();
  };

  const overdue = isOverdue(task.dueDate);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/task/${task._id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    },
  });

   const handledelete = () => deleteMutation.mutate();

  return (
    <>
      <Card className=" w-full transition-shadow  hover:shadow-md">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg leading-tight">
              {task.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={statusConfig?.variant} className={"shrink-0"}>
                {statusConfig?.label}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEditTask(task)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {task.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {task.description}
            </p>
          )}
          {dueDate && (
            <div className="flex items-center gap-2 ">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {" "}
                Due
                <Badge
                  variant={overdue ? "destructive" : "secondary"}
                  className="ml-1"
                >
                  {dueDate}
                  {overdue && "(Overdue)"}
                </Badge>
              </span>
            </div>
          )}
          {/* simple status indicator */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>Created: {formatDate(task.createdAt)}</span>
            <span
              variant={statusConfig?.variant}
              className={statusConfig?.color}
            >
              {statusConfig?.label}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            This action cannot be undone. Are you sure you want to delete this
            task?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handledelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskCard;
